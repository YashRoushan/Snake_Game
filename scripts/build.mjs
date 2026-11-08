import { cp, mkdir, rm } from "node:fs/promises";
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("hosted", "dist", { recursive: true });
console.log("Built self-contained static game in dist/");
