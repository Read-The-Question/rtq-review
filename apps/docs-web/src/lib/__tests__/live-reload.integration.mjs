import assert from "node:assert/strict";
import { once } from "node:events";
import { access, rename, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { dirname, relative, resolve } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(testDirectory, "../../..");
const externalRepository = resolve(
  process.env.RTQ_DOCS_LIVE_RELOAD_REPOSITORY ??
    resolve(appRoot, "../../../rtq-env"),
);
const externalDocs = resolve(externalRepository, "docs");
const fileStem = `rtq-docs-live-reload-${process.pid}`;
const initialFile = resolve(externalDocs, `${fileStem}.md`);
const renamedStem = `${fileStem}-renamed`;
const renamedFile = resolve(externalDocs, `${renamedStem}.md`);
const initialRoute = `/docs/rtq-env/docs/${fileStem}`;
const renamedRoute = `/docs/rtq-env/docs/${renamedStem}`;
let serverOutput = "";
let server;

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
}

function hasNavigationRoute(html, route) {
  return html.includes(`href="${route}"`) || html.includes(`\\"${route}\\"`);
}

async function getAvailablePort() {
  const listener = createServer();
  listener.listen(0, "127.0.0.1");
  await once(listener, "listening");
  const address = listener.address();
  assert.ok(address && typeof address === "object");
  await new Promise((resolveClose, rejectClose) =>
    listener.close((error) => (error ? rejectClose(error) : resolveClose())),
  );
  return address.port;
}

async function request(baseUrl, route) {
  const response = await fetch(`${baseUrl}${route}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
  });
  return { status: response.status, text: await response.text() };
}

async function eventually(description, check, timeout = 90_000) {
  const deadline = Date.now() + timeout;
  let lastError;

  while (Date.now() < deadline) {
    if (server?.exitCode !== null) {
      throw new Error(`Next.js exited before ${description}.\n${serverOutput}`);
    }

    try {
      if (await check()) return;
    } catch (error) {
      lastError = error;
    }

    await delay(250);
  }

  throw new Error(
    `Timed out waiting for ${description}.${
      lastError instanceof Error ? ` ${lastError.message}` : ""
    }\n${serverOutput}`,
  );
}

async function stopServer(exitPromise) {
  if (!server || server.exitCode !== null) return;

  server.kill("SIGINT");
  const exited = await Promise.race([
    exitPromise.then(() => true),
    delay(10_000).then(() => false),
  ]);
  if (exited) return;

  server.kill("SIGKILL");
  await exitPromise;
}

async function main() {
  assert.ok(
    relative(appRoot, externalRepository).startsWith(".."),
    "The live-reload integration source must be outside apps/docs-web",
  );
  await access(externalDocs);

  const port = await getAvailablePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const require = createRequire(import.meta.url);
  const nextBin = require.resolve("next/dist/bin/next");

  server = spawn(
    process.execPath,
    [nextBin, "dev", "--hostname", "127.0.0.1", "--port", String(port)],
    {
      cwd: appRoot,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  const exitPromise = once(server, "exit");
  for (const stream of [server.stdout, server.stderr]) {
    stream.on("data", (chunk) => {
      serverOutput = `${serverOutput}${chunk.toString()}`.slice(-12_000);
    });
  }

  try {
    await eventually("the documentation server", async () => {
      const response = await request(baseUrl, "/docs");
      return response.status === 200;
    });

    await writeFile(
      initialFile,
      "# External Live Reload Probe\n\nMarker: T6-ADDED\n",
      { flag: "wx" },
    );
    await eventually(
      "an added external page and navigation entry",
      async () => {
        const [page, navigation] = await Promise.all([
          request(baseUrl, initialRoute),
          request(baseUrl, "/docs"),
        ]);
        return (
          page.status === 200 &&
          page.text.includes("T6-ADDED") &&
          hasNavigationRoute(navigation.text, initialRoute)
        );
      },
    );

    await writeFile(
      initialFile,
      "# External Live Reload Probe Updated\n\nMarker: T6-CHANGED\n",
    );
    await eventually("updated external content", async () => {
      const page = await request(baseUrl, initialRoute);
      return (
        page.status === 200 &&
        page.text.includes("T6-CHANGED") &&
        !page.text.includes("T6-ADDED")
      );
    });

    await rename(initialFile, renamedFile);
    await eventually(
      "an external rename in content and navigation",
      async () => {
        const [oldPage, renamedPage, navigation] = await Promise.all([
          request(baseUrl, initialRoute),
          request(baseUrl, renamedRoute),
          request(baseUrl, "/docs"),
        ]);
        return (
          oldPage.status === 404 &&
          renamedPage.status === 200 &&
          renamedPage.text.includes("T6-CHANGED") &&
          hasNavigationRoute(navigation.text, renamedRoute) &&
          !hasNavigationRoute(navigation.text, initialRoute)
        );
      },
    );

    await rm(renamedFile);
    await eventually(
      "an external deletion in content and navigation",
      async () => {
        const [page, navigation] = await Promise.all([
          request(baseUrl, renamedRoute),
          request(baseUrl, "/docs"),
        ]);
        return (
          page.status === 404 &&
          !hasNavigationRoute(navigation.text, renamedRoute)
        );
      },
    );

    console.log(
      "External live reload passed: add, change, rename, delete, and navigation invalidation.",
    );
  } finally {
    await Promise.all([
      rm(initialFile, { force: true }),
      rm(renamedFile, { force: true }),
    ]);
    await stopServer(exitPromise);
  }
}

await main();
