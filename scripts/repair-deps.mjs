// npm scripts resolve the project-local Node before the older system Node.
import { spawnSync } from "node:child_process";
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error("Run this through npm run repair:deps.");
const result = spawnSync(process.execPath, [npmCli, "install", "--include=optional"], { stdio: "inherit" });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
