import { Outlet, createFileRoute } from "@tanstack/react-router";
import { fetchChats } from "~/functions/chats.js";

export const Route = createFileRoute("/_authed/chats")({
  loader: () =>
    fetchChats({
      data: { limit: 20, endingBefore: null, startingAfter: null },
    }),
  component: PostsComponent,
});

function PostsComponent() {
  return <Outlet />;
}
