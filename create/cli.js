#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = process.argv[2] || "my-app";
const templateDir = path.join(__dirname, "template");

try {
  // Copy template
  await fs.copy(templateDir, targetDir);
  console.log(`✅ Project created in "${targetDir}"`);

  const pkgPath = path.join(targetDir, "package.json");
  const pkg = await fs.readJson(pkgPath);
  pkg.name = targetDir; // Rename project
  await fs.writeJson(pkgPath, pkg, { spaces: 2 });

  console.log(`➡️ cd ${targetDir} && npm install`);
} catch (err) {
  console.error("❌ Erreur :", err);
  process.exit(1);
}