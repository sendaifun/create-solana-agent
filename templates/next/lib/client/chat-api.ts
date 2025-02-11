"use client";

export async function sendChatMessage(message: string, modelName: string) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, modelName }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Chat API Error:", error);
    throw error;
  }
}
