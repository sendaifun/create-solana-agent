// Vercel AI SDK : 
// import { initializeAgent } from "@/config/agent";

// let agentInstance: Awaited<ReturnType<typeof initializeAgent>> | null = null;

// export async function getAgent() {
//   if (!agentInstance) {
//     agentInstance = await initializeAgent();
//   }
//   return agentInstance;
// } 


// Langchain : 
import { initializeAgent } from "@/config/agent";

let agentInstance: Awaited<ReturnType<typeof initializeAgent>> | null = null;

export async function getAgent() {
  if (!agentInstance) {
    agentInstance = await initializeAgent();
  }
  return agentInstance;
} 