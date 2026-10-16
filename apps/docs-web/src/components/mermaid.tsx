"use client";

import { useEffect, useId, useState } from "react";

type MermaidModule = (typeof import("mermaid"))["default"];

type RenderState =
  | Readonly<{ chart: string; status: "loading" }>
  | Readonly<{ chart: string; status: "ready"; svg: string }>
  | Readonly<{ chart: string; message: string; status: "error" }>;

let mermaidModule: Promise<MermaidModule> | undefined;

function loadMermaid(): Promise<MermaidModule> {
  mermaidModule ??= import("mermaid").then(({ default: mermaid }) => {
    mermaid.initialize({
      securityLevel: "strict",
      startOnLoad: false,
      theme: "neutral",
    });
    return mermaid;
  });
  return mermaidModule;
}

export function Mermaid({ chart }: { chart: string }) {
  const generatedId = useId().replace(/[^A-Za-z0-9_-]/g, "");
  const renderId = `rtq-mermaid-${generatedId}`;
  const [state, setState] = useState<RenderState>({
    chart,
    status: "loading",
  });

  useEffect(() => {
    let active = true;

    void loadMermaid()
      .then((mermaid) => mermaid.render(renderId, chart))
      .then(({ svg }) => {
        if (active) setState({ chart, status: "ready", svg });
      })
      .catch((error: unknown) => {
        document.getElementById(`d${renderId}`)?.remove();
        if (!active) return;
        setState({
          chart,
          message: error instanceof Error ? error.message : String(error),
          status: "error",
        });
      });

    return () => {
      active = false;
    };
  }, [chart, renderId]);

  const currentState: RenderState =
    state.chart === chart ? state : { chart, status: "loading" };

  return (
    <figure
      className="mermaid-diagram not-prose"
      data-state={currentState.status}
    >
      {currentState.status === "loading" ? (
        <div className="mermaid-diagram__status" role="status">
          Rendering diagram…
        </div>
      ) : null}
      {currentState.status === "error" ? (
        <div className="mermaid-diagram__error" role="alert">
          <strong>Diagram could not be rendered.</strong>
          <p>{currentState.message}</p>
          <pre>{chart}</pre>
        </div>
      ) : null}
      {currentState.status === "ready" ? (
        <div
          aria-label="Mermaid diagram"
          className="mermaid-diagram__canvas"
          dangerouslySetInnerHTML={{ __html: currentState.svg }}
          role="img"
        />
      ) : null}
    </figure>
  );
}
