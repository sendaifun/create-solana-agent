import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Icon } from "~/components/ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { formatDistance } from "date-fns";
import { fetchChats } from "~/functions/chats.js";

export const Route = createFileRoute("/_authed/chats/history")({
  loader: () =>
    fetchChats({
      data: { limit: 20, endingBefore: null, startingAfter: null },
    }),
  component: ChatHistoryComponent,
});

function ChatHistoryComponent() {
  const chats = Route.useLoaderData();

  const sortedChats = useMemo(() => {
    return [...chats.chats].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [chats]);

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chat History</h1>
        <Button className="bg-[#1E9BB9] hover:bg-[#1E9BB9]/80 text-white" asChild>
          <Link to="/chats">New Chat</Link>
        </Button>
      </div>
      
      <div className="space-y-2">
        {sortedChats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:border-[#1E9BB9]/50 transition-colors"
          >
            <div className="flex-1 flex flex-col">
              <Link
                to="/chats/$chatId"
                params={{
                  chatId: chat.id,
                }}
                className="truncate"
                activeProps={{ className: "font-bold" }}
              >
                <div className="truncate">{chat.title}</div>
              </Link>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDistance(new Date(chat.createdAt), new Date(), {
                  addSuffix: true,
                  includeSeconds: true,
                })}
              </span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      toast.promise(
                        fetch(`/api/chat?id=${chat.id}`, {
                          method: "DELETE",
                        }),
                        {
                          loading: "Deleting chat...",
                          success: () => {
                            const path = window.location.pathname;

                            if (path.includes(chat.id)) {
                              window.location.href = "/chats";
                            } else {
                              window.location.reload();
                            }

                            return "Chat deleted";
                          },
                          error: (err) => {
                            console.error(err);
                            return `Failed to delete chat: ${err}`;
                          },
                        },
                      );
                    }}
                    className="ml-2"
                  >
                    <Icon name="trash-bin-minimalistic-linear" className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete chat</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
    </div>
  );
} 