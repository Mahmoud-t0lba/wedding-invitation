import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

async function loadCatalog() {
  const source = await fs.readFile(path.join(repoRoot, "scripts", "template-catalog.js"), "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return sandbox.window.__TEMPLATE_CATALOG__ || [];
}

async function buildFolders() {
  const catalog = await loadCatalog();
  const shellHtml = await fs.readFile(path.join(repoRoot, "invitation-shell.html"), "utf8");
  const folderHtml = shellHtml.replace("<head>", "<head>\n  <base href=\"../\">");

  for (const item of catalog) {
    if (item.folderType === "standalone") {
      continue;
    }

    const targetDir = path.join(repoRoot, item.pathSlug);
    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(path.join(targetDir, "index.html"), folderHtml);
  }
}

buildFolders().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
