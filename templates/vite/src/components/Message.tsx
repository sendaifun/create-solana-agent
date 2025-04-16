import type { UIMessage } from "ai";
import { AnimatePresence, motion } from "motion/react";
import { memo, useState } from "react";
import { Markdown } from "./Markdown";
import { MessageActions } from "./MessageActions";
import equal from "fast-deep-equal";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./ui/tooltip";
import { MessageEditor } from "./MessageEditor";
import type { UseChatHelpers } from "@ai-sdk/react";

const PurePreviewMessage = ({
  message,
  isLoading,
  setMessages,
  reload,
  isReadonly,
}: {
  message: UIMessage;
  isLoading: boolean;
  setMessages: UseChatHelpers["setMessages"];
  reload: UseChatHelpers["reload"];
  isReadonly: boolean;
}) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-2 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={cn(
            "flex gap-3 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
            {
              "w-full": mode === "edit",
              "group-data-[role=user]/message:w-fit": mode !== "edit",
            },
          )}
        >
          {message.role === "assistant" && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-[#1E9BB9]/50 bg-[#1E9BB9]/10 dark:bg-[#1E9BB9]/20">
              <div className="translate-y-px text-[#1E9BB9]">
                <Icon name="face-scan-square-linear" className="w-[16px] h-[16px]" />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 w-full">
            {message.parts?.map((part, index) => {
              const { type } = part;
              const key = `message-${message.id}-part-${index}`;

              if (type === "text") {
                if (mode === "view") {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      {message.role === "user" && !isReadonly && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                data-testid="message-edit-button"
                                variant="ghost"
                                className="px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
                                onClick={() => {
                                  setMode("edit");
                                }}
                              >
                                <Icon name="pencil-linear" className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit message</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      <div
                        data-testid="message-content"
                        className={cn("flex flex-col gap-4", {
                          "bg-[#1E9BB9] text-white px-3 py-2 rounded-xl": message.role === "user",
                          "bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-xl": message.role === "assistant",
                        })}
                      >
                        <Markdown>{part.text}</Markdown>
                      </div>
                    </div>
                  );
                }

                if (mode === "edit") {
                  return (
                    <div key={key} className="flex flex-row gap-2 items-start">
                      <div className="size-8" />

                      <MessageEditor
                        key={message.id}
                        message={message}
                        setMode={setMode}
                        setMessages={setMessages}
                        reload={reload}
                      />
                    </div>
                  );
                }
              }

              if (type === "tool-invocation") {
                const { toolInvocation } = part;
                const { toolCallId, state } = toolInvocation;

                if (state === "result") {
                  const { result } = toolInvocation;

                  return (
                    <div
                      key={toolCallId}
                      className="bg-[#1E9BB9]/10 dark:bg-[#1E9BB9]/20 text-gray-700 dark:text-gray-200 rounded-xl p-3 font-mono text-sm"
                    >
                      <div className="text-xs font-semibold mb-1 text-[#1E9BB9]">Tool Result</div>
                      <pre className="whitespace-pre-wrap break-all">{JSON.stringify(result, null, 2)}</pre>
                    </div>
                  );
                }
              }
            })}

            {!isReadonly && (
              <MessageActions
                key={`action-${message.id}`}
                message={message}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const PreviewMessage = memo(
  PurePreviewMessage,
  (prevProps, nextProps) => {
    if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (prevProps.message.id !== nextProps.message.id) return false;
    if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;

    return true;
  },
);

export const ThinkingMessage = () => {
  const role = "assistant";

  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-2 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.5 } }}
      data-role={role}
    >
      <div className="flex gap-3">
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-[#1E9BB9]/50 bg-[#1E9BB9]/10 dark:bg-[#1E9BB9]/20">
          <div className="translate-y-px text-[#1E9BB9]">
            <Icon name="face-scan-square-linear" className="w-[14px] h-[14px]" />
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-xl text-gray-500 dark:text-gray-400 flex items-center">
          <div className="flex gap-1 items-center">
            <div className="size-2 bg-[#1E9BB9] rounded-full animate-bounce"></div>
            <div className="size-2 bg-[#1E9BB9] rounded-full animate-bounce delay-150"></div>
            <div className="size-2 bg-[#1E9BB9] rounded-full animate-bounce delay-300"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
