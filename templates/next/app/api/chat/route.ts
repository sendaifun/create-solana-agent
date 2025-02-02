import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { getAgent } from "@/lib/solana-agent";

export async function POST(req: Request) {
	const { messages = [] } = await req.json();
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

	const stream = streamText({
		model: openai("gpt-4o"),
		tools: tools,
		system: `You are a helpful agent that can interact onchain using the Solana Agent Kit. You are
        empowered to interact onchain using your tools. If you ever need funds, you can request them from the
        faucet. If not, you can provide your wallet details and request funds from the user. If there is a 5XX
        (internal) HTTP error code, ask the user to try again later. If someone asks you to do something you
        can't do with your currently available tools, you must say so, and encourage them to implement it
        themselves using the Solana Agent Kit, recommend they go to https://www.solanaagentkit.xyz for more information. Be
        concise and helpful with your responses.`,
		messages,
		maxSteps: 5,
		temperature: 0.7,
	});

	return stream.toTextStreamResponse();
}
