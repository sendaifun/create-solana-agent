import type { Attachment, UIMessage } from "ai";
import type React from "react";
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
  type ChangeEvent,
  memo,
} from "react";
import { toast } from "sonner";
import { useLocalStorage, useWindowSize } from "usehooks-ts";

import { Icon } from "./ui/icon";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { SuggestedActions } from "./SuggestedActions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import equal from "fast-deep-equal";
import type { UseChatHelpers } from "@ai-sdk/react";
import { cn } from "~/lib/utils";
import { useNavigate } from "@tanstack/react-router";

function PureMultimodalInput({
  chatId,
  input,
  setInput,
  status,
  stop,
  attachments,
  setAttachments,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
}: {
  chatId: string;
  input: UseChatHelpers["input"];
  setInput: UseChatHelpers["setInput"];
  status: UseChatHelpers["status"];
  stop: () => void;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers["setMessages"];
  append: UseChatHelpers["append"];
  handleSubmit: UseChatHelpers["handleSubmit"];
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();
  const nav = useNavigate();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 2
      }px`;
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = "98px";
    }
  };

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    "input",
    "",
  );

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || "";
      setInput(finalValue);
      adjustHeight();
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);

  const submitForm = useCallback(async () => {
    if (window.location.pathname === "/chats") {
      nav({
        href: `/chats/${chatId}?input=${input}`,
        replace: true,
      });
    }
    setInput("");

    handleSubmit(undefined, {
      experimental_attachments: attachments,
    });

    setAttachments([]);
    setLocalStorageInput("");
    resetHeight();

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [
    attachments,
    handleSubmit,
    setAttachments,
    setLocalStorageInput,
    width,
    input,
    setInput,
    chatId,
  ]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: contentType,
        };
      }
      const { error } = await response.json();
      toast.error(error);
    } catch (error) {
      toast.error("Failed to upload file, please try again!");
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined,
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error("Error uploading files!", error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setAttachments],
  );

  return (
    <div className="relative w-full">
      {messages.length === 0 &&
        attachments.length === 0 &&
        uploadQueue.length === 0 && (
          <SuggestedActions append={append} chatId={chatId} />
        )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />

      {/* Attachments Display */}
      {(attachments.length > 0 || uploadQueue.length > 0) && (
        <div className="mb-2 flex flex-wrap gap-2">
          {uploadQueue.map((filename) => (
            <div
              key={filename}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs"
            >
              <span>{filename}</span>
              <span>Uploading...</span>
            </div>
          ))}
          {attachments.map((attachment, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs"
            >
              <span>{attachment.name}</span>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800"
                onClick={() => {
                  setAttachments((currentAttachments) =>
                    currentAttachments.filter((_, index) => index !== i),
                  );
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 p-2 w-full rounded-xl">
        {/* Attachment Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md text-gray-500 dark:text-gray-400 hover:bg-[#1E9BB9]/20 transition-colors duration-200"
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon name="paperclip-linear" className="h-4 w-4" />
                <span className="sr-only">Attach files</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Attach files</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Input Area */}
        <Textarea
          ref={textareaRef}
          tabIndex={0}
          placeholder="Ask anything..."
          value={input}
          onChange={handleInput}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              input.trim() &&
              status !== "streaming"
            ) {
              e.preventDefault();
              submitForm();
            }
          }}
          className="min-h-[48px] w-full resize-none border-0 p-2 shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
          disabled={status === "streaming"}
        />

        {/* Control Buttons */}
        <div className="flex shrink-0 items-center">
          <TooltipProvider>
            {status === "streaming" ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="rounded-full bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 text-white h-8 w-8 p-0 flex items-center justify-center"
                    onClick={() => {
                      stop();
                      // Remove the last assistant message which is still streaming
                      setMessages((messages) => {
                        const lastMessage = messages[messages.length - 1];
                        if (lastMessage?.role === "assistant") {
                          return messages.slice(0, -1);
                        }
                        return messages;
                      });
                    }}
                  >
                    <Icon name="stop-circle-linear" className="h-4 w-4" />
                    <span className="sr-only">Stop generating</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Stop generating</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    disabled={!input.trim() && uploadQueue.length === 0}
                    className="rounded-full bg-[#1E9BB9] hover:bg-[#1E9BB9]/90 dark:bg-[#1E9BB9] dark:hover:bg-[#1E9BB9]/90 text-white h-8 w-8 p-0 flex items-center justify-center"
                    onClick={submitForm}
                  >
                    <Icon name="arrow-up-linear" className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send message</p>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (prevProps.input !== nextProps.input) return false;
    if (prevProps.status !== nextProps.status) return false;
    if (!equal(prevProps.attachments, nextProps.attachments)) return false;

    return true;
  },
);

function PureAttachmentsButton({
  fileInputRef,
  status,
}: {
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  status: UseChatHelpers["status"];
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            data-testid="attachments-button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md text-gray-500 dark:text-gray-400 hover:bg-[#1E9BB9]/20 transition-colors duration-200"
            onClick={(event) => {
              event.preventDefault();
              fileInputRef.current?.click();
            }}
            disabled={status !== "ready"}
          >
            <Icon name="paperclip-linear" className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Attach files</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const AttachmentsButton = memo(PureAttachmentsButton);

function PureStopButton({
  stop,
  setMessages,
}: {
  stop: () => void;
  setMessages: UseChatHelpers["setMessages"];
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            data-testid="stop-button"
            variant="default"
            size="sm"
            className="rounded-full bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 text-white h-8 w-8 p-0 flex items-center justify-center"
            onClick={(event) => {
              event.preventDefault();
              stop();
              setMessages((messages) => messages);
            }}
          >
            <Icon name="stop-circle-linear" className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Stop generating</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const StopButton = memo(PureStopButton);

function PureSendButton({
  submitForm,
  input,
  uploadQueue,
}: {
  submitForm: () => void;
  input: string;
  uploadQueue: Array<string>;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            data-testid="send-button"
            variant="default"
            size="sm"
            className="rounded-full bg-[#1E9BB9] hover:bg-[#1E9BB9]/90 dark:bg-[#1E9BB9] dark:hover:bg-[#1E9BB9]/90 text-white h-8 w-8 p-0 flex items-center justify-center"
            onClick={(event) => {
              event.preventDefault();
              submitForm();
            }}
            disabled={input.length === 0 || uploadQueue.length > 0}
          >
            <Icon name="arrow-up-linear" className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Send message</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length)
    return false;
  if (prevProps.input !== nextProps.input) return false;
  return true;
});
