import { NextRequest, NextResponse } from "next/server";

import { HumanMessage } from "@langchain/core/messages";
import { initializeAgent } from "@/config/agent";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const { agent, config } = await initializeAgent();

    const stream = await agent.stream({ messages: [new HumanMessage(message)] }, config);

    let response = "";

    for await (const chunk of stream) {
      console.log("chunk", chunk);
      if ("agent" in chunk) {
        console.log("Chunk Agent", chunk.agent);
        console.log("chunk.agent.messages[0].content", chunk.agent.messages[0].content);
        response += chunk.agent.messages[0].content + "\n";
      }
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
