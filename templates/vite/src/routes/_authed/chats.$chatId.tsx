import {
  ErrorComponent,
  createFileRoute,
  notFound,
  useNavigate,
} from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { Chat } from "~/components/Chat";
import { NotFound } from "~/components/NotFound.js";
import {
  fetchChat,
  fetchMessages,
  saveChatFn,
  saveMessagesFn,
} from "~/functions/chats.js";
import { convertToUIMessages, generateUUID, isValidUUID } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";

export const Route = createFileRoute("/_authed/chats/$chatId")({
  loader: async ({ params: { chatId }, location }) => {
    // Validate the chatId is a proper UUID
    if (!isValidUUID(chatId)) {
      throw new Error("Invalid chat ID format");
    }
    
    const chat = await fetchChat({ data: { id: chatId } });
    const { input, initialPrompt } = location.search as { 
      input?: string,
      initialPrompt?: string
    };
    
    const messageContent = initialPrompt || input;

    if (!chat) {
      if (messageContent) {
        try {
          await saveChatFn({
            data: {
              id: chatId,
              title: messageContent.slice(0, 20)
            },
          });
          
          await saveMessagesFn({
            data: {
              messages: [
                {
                  id: generateUUID(),
                  chatId: chatId,
                  role: "user",
                  attachments: [],
                  parts: [{ type: "text", text: messageContent }],
                  createdAt: new Date(),
                },
              ],
            },
          });
        } catch (error) {
          console.error("Error saving chat:", error);
          throw new Error("Failed to create chat. Please try again.");
        }
      } else {
        throw notFound();
      }
    }

    const messages = await fetchMessages({ data: { id: chatId } });

    if (!messages) {
      throw notFound();
    }

    return {
      chat,
      messages
    };
  },
  errorComponent: PostErrorComponent,
  component: PostComponent,
  notFoundComponent: () => {
    return <NotFound>Chat not found</NotFound>;
  },
});

function PostErrorComponent({ error }: ErrorComponentProps) {
  const navigate = useNavigate();
  const isUUIDError = error instanceof Error && 
    error.message.includes("Invalid chat ID format");

  const goHome = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] max-w-xl mx-auto text-center px-4">
      <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl shadow-sm border border-red-200 dark:border-red-800">
        <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-4">
          {isUUIDError ? "Invalid Chat Session" : "Error Loading Chat"}
        </h2>
        
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {isUUIDError 
            ? "The chat session ID format is invalid. This might be due to a corrupted URL or a session that was created with an incompatible format."
            : "An error occurred while trying to load this chat. Please try again or start a new conversation."}
        </p>
        
        <Button 
          onClick={goHome}
          className="bg-[#1E9BB9] hover:bg-[#1E9BB9]/80 text-white"
        >
          <Icon name="home-linear" className="mr-2 h-4 w-4" />
          Go Home
        </Button>
      </div>
    </div>
  );
}

function PostComponent() {
  const { chat, messages } = Route.useLoaderData();
  const { chatId } = Route.useParams();

  return (
    <>
      <Chat
        id={chat?.id ?? chatId}
        initialMessages={convertToUIMessages(messages)}
        isReadonly={false}
      />
    </>
  );
}
