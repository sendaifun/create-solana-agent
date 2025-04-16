import fs from "fs";
import path from "path";
import pc from "picocolors";
import * as p from "@clack/prompts";
import ora from "ora";
import { fileURLToPath } from "url";
import { optimizedCopy, toValidPackageName } from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const nextTemplateDir = path.join(__dirname, '../templates/next');
const viteTemplateDir = path.join(__dirname, '../templates/vite');

const renameFiles: Record<string, string | undefined> = {
  _gitignore: ".gitignore",
};

const excludeDirs = ["node_modules", ".next", "dist"];
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
  const useVite = argv.includes('--vite');
  const sourceDir = useVite ? viteTemplateDir : nextTemplateDir;

  console.log(
    pc.cyan(`
    ╭━━━╮╱╱╭━━━╮╱╱╭━╮╱╭╮╱╱╭━━━╮╱╱/╭━━━╮╱╱╭╮
    ┃╭━━╯╱╱┃╭━━╯╱╱┃┃╰╮┃┃╱╱┃╭━╮╰╮╱╱┃╭━╮┃╱╱┃┃
    ┃╰━━╮╱╱┃╰━━╮╱╱┃╭╮╰╯┃╱╱┃┃╱┃ ┃╱╱┃┃╱┃┃╱╱┃┃
    ╰━━╮┃╱╱┃╭━━╯╱╱┃┃╰╮┃┃╱╱┃┃╱┃ ┃╱╱┃╰━╯┃╱╱┃┃
    ┃╰━╯┃╱╱┃╰━━╮╱╱┃┃╱┃┃┃╱╱┃╰━╯╭╯╱/┃╭━╮┃╱╱┃┃
    ╰━━━╯╱╱╰━━━╯╱╱╰╯╱╰━╯╱╱╰━━━╯╱╱/╰╯╱╰╯╱╱╰╯
 `),
  );

  console.log(pc.green(`Creating a new Solana Agent Terminal project using ${useVite ? 'Vite' : 'Next.js'} template`));

  const defaultProjectName = "solana-agent-terminal";
  const defaultRpcURL = "https://api.mainnet-beta.solana.com";

  type NextPromptResults = {
    projectName: string;
    rpcURL: string;
    model: string;
    apiKey: string;
    solanaPrivateKey: string;
  };

  type VitePromptResults = {
    projectName: string;
    rpcURL: string;
    openaiApiKey: string;
    privyClientId?: string;
    privyAppId?: string;
    privyAppSecret?: string;
    postgresUrl?: string;
  };

  type PromptResults = NextPromptResults | VitePromptResults;

  let promptFields: any = {
    projectName: () =>
      p.text({
        message: "Project name:",
        placeholder: defaultProjectName,
        defaultValue: "",
        validate(value) {
          if (!value) return;
          const targetDir = path.join(process.cwd(), value);
          if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
            return "Directory already exists and is not empty. Please choose a different name.";
          }
        },
      }),
    rpcURL: () =>
      p.text({
        message: "RPC URL:",
        placeholder: defaultRpcURL,
        defaultValue: "",
        validate(value) {
          if (!value) return;
          if (value && !value.startsWith("https://")) {
            return "RPC URL must start with https://";
          }
        },
      }),
  };

  if (useVite) {
    promptFields = {
      ...promptFields,
      openaiApiKey: () =>
        p.text({
          message: "OpenAI API Key:",
          placeholder: "sk-...",
          defaultValue: "",
          validate(value) {
            if (!value) {
              return "OpenAI API Key is required";
            }
          },
        }),
      privyClientId: () =>
        p.text({
          message: "Privy Client ID:",
          placeholder: "",
          defaultValue: "",
        }),
      privyAppId: () =>
        p.text({
          message: "Privy App ID:",
          placeholder: "",
          defaultValue: "",
        }),
      privyAppSecret: () =>
        p.text({
          message: "Privy App Secret:",
          placeholder: "",
          defaultValue: "",
        }),
      postgresUrl: () =>
        p.text({
          message: "Postgres URL:",
          placeholder: "",
          defaultValue: "",
        }),
    };
  } else {
    promptFields = {
      ...promptFields,
      model: () =>
        p.select({
          message: "Choose your AI model:",
          options: [
            { value: "claude-sonnet", label: "Claude Sonnet"},
            { value: "gpt-4", label: "GPT-4" },
            { value: "deepseek-chat", label: "DeepSeek Chat" },
          ],
        }),
      apiKey: (results: { results: { model: string } }) =>
        p.text({
          message: `${results.results.model === "claude-sonnet" ? "Anthropic" : results.results.model === "gpt-4" ? "OpenAI" : "DeepSeek"} API Key:`,
          placeholder: "sk-...",
          defaultValue: "",
          validate(value) {
            if (!value) {
              return "API Key is required";
            }
          },
        }),
      solanaPrivateKey: () =>
        p.text({
          message: "Solana Private Key:",
          placeholder: "[Press Enter to input your private key]",
          defaultValue: "",
          validate(value) {
            if (!value) {
              return "Solana Private Key is required";
            }
          },
        }),
    };
  }

  const group = await p.group(promptFields, {
      onCancel: () => {
        p.cancel("Cancelled");
        process.exit(1);
      },
    },
  ) as PromptResults;

  const { projectName, rpcURL } = group;
  const finalProjectName = projectName || defaultProjectName;
  const finalRpcURL = rpcURL || defaultRpcURL;

  const root = path.join(process.cwd(), finalProjectName);

  const spinner = ora(`Creating ${finalProjectName}...`).start();

  await copyDir(sourceDir, root);

  const pkgPath = path.join(root, "package.json");
  const pkg = JSON.parse(await fs.promises.readFile(pkgPath, "utf-8"));

  pkg.name = toValidPackageName(finalProjectName);
  await fs.promises.writeFile(pkgPath, JSON.stringify(pkg, null, 2));

  const envPath = path.join(root, ".env");
  let envContent = "";

  if (useVite) {
    const viteGroup = group as VitePromptResults;
    const { openaiApiKey, privyClientId, privyAppId, privyAppSecret, postgresUrl } = viteGroup;
    
    envContent = `# Create an OpenAI subscription and copy your environment variables from your dashboard.
OPENAI_API_KEY=${openaiApiKey}
VITE_OPENAI_API_KEY=${openaiApiKey}

# Privy, reference https://docs.privy.io
VITE_PRIVY_CLIENT_ID=${privyClientId || ""}
VITE_PRIVY_APP_ID=${privyAppId || ""}
PRIVY_APP_SECRET=${privyAppSecret || ""}

# Supabase - This can be gotten from Vercel or Supabase dashboard
# You can create a Supabase instance on vercel with their add ons, link it to your project and use the environment variables from there.
# Database configuration
POSTGRES_URL=${postgresUrl || ""}

# A solana RPC URL that can be gotten from helius, quicknode, or any other RPC providers
VITE_RPC_URL=${finalRpcURL}`;
  } else {
    const nextGroup = group as NextPromptResults;
    const { model, apiKey, solanaPrivateKey } = nextGroup;
    const apiKeyName = model === "claude-sonnet" ? "ANTHROPIC_API_KEY" 
      : model === "gpt-4" ? "OPENAI_API_KEY" 
      : "DEEPSEEK_API_KEY";
      
    envContent = `MODEL=${model}\n${apiKeyName}=${apiKey}\nRPC_URL=${finalRpcURL}\nSOLANA_PRIVATE_KEY=${solanaPrivateKey}`;
  }

  await fs.promises.writeFile(envPath, envContent);

  spinner.succeed();

  console.log(`\n${pc.magenta(`Created new Solana Agent Terminal project in ${root}`)}`);

  console.log(`\nTo get started with ${pc.green(finalProjectName)}, run the following commands:\n`);
  if (root !== process.cwd()) {
    console.log(` - cd ${path.relative(process.cwd(), root)}`);
  }
  console.log(" - pnpm install");
  console.log(" - pnpm run dev");
}