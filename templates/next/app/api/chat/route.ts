import { NextRequest, NextResponse } from "next/server";
import { HumanMessage } from "@langchain/core/messages";
import { getAgent } from "@/lib/solana-agent";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

export async function POST(req: NextRequest) {
  try {
    const { message, modelName } = await req.json();
    console.log("modelName", modelName);
    const { agent, config } = await getAgent(modelName);

    const messages = [
      new HumanMessage({
        content: message
      })
    ];

    const stream = await agent.stream({ messages }, config);

    let response = "";

    for await (const chunk of stream) {
      if ("agent" in chunk) {
        // console.log("chunk.agent", chunk.agent);
        response += chunk.agent.messages[0].content + "\n";
      } else if ("tools" in chunk) {
        // console.log("chunk.tools", chunk.tools);
        console.log(chunk.tools.messages[0].content);
      }
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// get the wallet address from the user
export async function GET(req: NextRequest) {
  const keypair = Keypair.fromSecretKey(
    bs58.decode(process.env.SOLANA_PRIVATE_KEY!)
  );
  return NextResponse.json({ walletAddress: keypair.publicKey.toBase58() });
}