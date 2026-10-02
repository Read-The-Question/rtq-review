import { join } from "node:path";

import { resolveRtqContentPaths } from "./index.ts";

export default {
  content: [
    join(resolveRtqContentPaths().assetsRoot, "papers", "**/*.svg").replaceAll(
      "\\",
      "/",
    ),
  ],
};
