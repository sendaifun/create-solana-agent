import fs from "fs";
import path from "path";
import pc from "picocolors";
import * as p from "@clack/prompts";
import ora from "ora";
import { fileURLToPath } from "url";
import { optimizedCopy, toValidPackageName } from "./utils.js";

const sourceDir = path.resolve(fileURLToPath(import.meta.url), "../../templates/next");

const renameFiles: Record<string, string | undefined> = {
  _gitignore: ".gitignore",
};

const excludeDirs = ["node_modules", ".next"];
const excludeFiles = [".DS_Store"];

async function copyDir(src: string, dest: string) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, renameFiles[entry.name] || entry.name);

    if (entry.isDirectory()) {
      if (!excludeDirs.includes(entry.name)) {
        await copyDir(srcPath, destPath);
      }
    } else {
      if (!excludeFiles.includes(entry.name)) {
        await optimizedCopy(srcPath, destPath);
      }
    }
  }
}

export async function main(argv: string[]) {
  console.log(pc.cyan(`
    ╭━━━╮╱╱╭━━━╮╱╱╭━╮╱╭╮╱╱╭━━━╮╱╱/╭━━━╮╱╱╭╮
    ┃╭━━╯╱╱┃╭━━╯╱╱┃┃╰╮┃┃╱╱┃╭━╮╰╮╱╱┃╭━╮┃╱╱┃┃
    ┃╰━━╮╱╱┃╰━━╮╱╱┃╭╮╰╯┃╱╱┃┃╱┃ ┃╱╱┃┃╱┃┃╱╱┃┃
    ╰━━╮┃╱╱┃╭━━╯╱╱┃┃╰╮┃┃╱╱┃┃╱┃ ┃╱╱┃╰━╯┃╱╱┃┃
    ┃╰━╯┃╱╱┃╰━━╮╱╱┃┃╱┃┃┃╱╱┃╰━╯╭╯╱/┃╭━╮┃╱╱┃┃
    ╰━━━╯╱╱╰━━━╯╱╱╰╯╱╰━╯╱╱╰━━━╯╱╱/╰╯╱╰╯╱╱╰╯
 `));

  const defaultProjectName = "solana-agent-terminal";

  const group = await p.group(
    {
      projectName: () =>
        p.text({
          message: `Project name: (${defaultProjectName})`,
          placeholder: defaultProjectName,
          validate(value) {
            const targetDir = path.join(process.cwd(), value || defaultProjectName);
            if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
              return "Directory already exists and is not empty. Please choose a different name.";
            }
          },
        }),
      rpcURL: () =>
        p.text({
          message: "RPC URL:",
          placeholder: "https://api.mainnet-beta.solana.com",
          validate(value) {
            if (value && !value.startsWith("https://")) {
              return "RPC URL must start with https://";
            }
          },
        }),
      openaiApiKey: () =>
        p.text({
          message: "OpenAI API Key:",
          placeholder: "sk-...",
          validate(value) {
            if (!value) {
              return "OpenAI API Key is required";
            }
          },
        }),
      solanaPrivateKey: () =>
        p.text({
          message: "Solana Private Key:",
          initialValue: "",
          validate(value) {
            if (!value) {
              return "Solana Private Key is required";
            }
          },
        }),
    },
    {
      onCancel: ({ results }) => {
        p.cancel("Cancelled");
        process.exit(1);
      },
    },
  );

  const { projectName, rpcURL, openaiApiKey, solanaPrivateKey } = group;
  
  const finalProjectName = projectName || defaultProjectName;
  const finalRpcURL = rpcURL || "https://api.mainnet-beta.solana.com";

  const root = path.join(process.cwd(), finalProjectName);

  const spinner = ora(`Creating ${finalProjectName}...`).start();

  await copyDir(sourceDir, root);

  const pkgPath = path.join(root, "package.json");
  const pkg = JSON.parse(await fs.promises.readFile(pkgPath, "utf-8"));

  pkg.name = toValidPackageName(finalProjectName);
  await fs.promises.writeFile(pkgPath, JSON.stringify(pkg, null, 2));

  const envPath = path.join(root, ".env");
  await fs.promises.writeFile(
    envPath,
    `OPENAI_API_KEY=${openaiApiKey}\nRPC_URL=${finalRpcURL}\nSOLANA_PRIVATE_KEY=${solanaPrivateKey}`,
  );

  spinner.succeed();

  console.log(`\n${pc.magenta(`Created new Solana Agent Terminal project in ${root}`)}`);

  console.log(`\nTo get started with ${pc.green(finalProjectName)}, run the following commands:\n`);
  if (root !== process.cwd()) {
    console.log(` - cd ${path.relative(process.cwd(), root)}`);
  }
  console.log(" - pnpm install");
  console.log(" - pnpm run dev");
}
