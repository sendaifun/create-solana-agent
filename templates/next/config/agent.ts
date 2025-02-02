import { SolanaAgentKit, createVercelAITools } from "solana-agent-kit";
import { validateEnvironment } from "@/lib/utils";

export async function initializeAgent() {
	validateEnvironment();

	const solanaAgent = new SolanaAgentKit(
		process.env.SOLANA_PRIVATE_KEY!,
		process.env.RPC_URL!,
		{
			OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
		},
	);

	const tools = createVercelAITools(solanaAgent);

	return { tools };
}
