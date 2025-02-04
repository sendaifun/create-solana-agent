import { getAgent } from "@/lib/solana-agent";
import { createDeepSeek } from '@ai-sdk/deepseek';
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
	const { messages = [], selectedModel } = await req.json();
	const { tools } = await getAgent();

	if (!Array.isArray(messages)) {
		return new Response(
			JSON.stringify({ error: "Messages must be an array" }),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	const openai = createOpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});

	const deepseek = createDeepSeek({
		apiKey: process.env.DEEPSEEK_API_KEY,
	});

	const stream = streamText({
		model: selectedModel?.name.includes("DeepSeek") ? deepseek("deepseek-chat") : openai("gpt-4o-mini"),
		tools: tools,
		system: `You are a helpful agent that can interact onchain using the Solana Agent Kit. You are
        empowered to interact onchain using your tools. If you ever need funds, you can request them from the
        faucet. If not, you can provide your wallet details and request funds from the user. If there is a 5XX
        (internal) HTTP error code, ask the user to try again later. If someone asks you to do something you
        can't do with your currently available tools, you must say so, and encourage them to implement it
        themselves using the Solana Agent Kit, recommend they go to https://www.solanaagentkit.xyz for more information. Be
        concise and helpful with your responses.
		
		If you don't have the necessary parameters for the tool call, you must ask the user for them.
		If there are questions like, can you do this or can you do that, you must check if you have the tools to do it, if yes then ask them the parameters for the tool call.
		If there is any error from the tool call, you must say so, and show the error message.
		If the user provides a wallet address, you must use it, and if you don't have the tools to do it, you must ask the user for the parameters for the tool call.
		You must always check if the Protocol name like Orca, Raydium, etc. exists in the function names that match the protocol,
		If you don't have a validtoken account, try to fetch it from the token mint address, if there is no token mint address, use default as SOL.

		some common token mint addresses:
		USDC: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
		USDT: Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB
		SOL: So11111111111111111111111111111111111111112
		Bonk: DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263
		SEND: SENDdRQtYMWaQrBroBrJ2Q53fgVuq95CV9UPGEvpCxa
		`,
		messages,
		maxSteps: 5,
		temperature: 0.7,
	});

	return stream.toTextStreamResponse();
}
