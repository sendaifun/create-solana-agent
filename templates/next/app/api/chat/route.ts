import { NextRequest } from "next/server";
import { initializeAgent } from "@/config/agent";
import { streamText } from "ai";

export async function POST(req: NextRequest) {
  try {
    const { message, modelName } = await req.json();
    const { getModelResponse } = await initializeAgent(modelName);

    // Get the streaming response from OpenRouter
    const response = await getModelResponse(message);
    
    // Convert the stream to text stream
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
