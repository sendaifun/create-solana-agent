import { NextRequest, NextResponse } from "next/server";
import { createSolanaTools } from "solana-agent-kit";
import { SolanaAgentKit } from "solana-agent-kit";
import { validateEnvironment } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    validateEnvironment();

    const solanaAgent = new SolanaAgentKit(process.env.SOLANA_PRIVATE_KEY!, process.env.RPC_URL!, {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
    });

    const tools = createSolanaTools(solanaAgent);

    let response = "";

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
