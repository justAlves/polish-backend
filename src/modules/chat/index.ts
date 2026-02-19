import { Elysia, t } from "elysia";
import { ChatService } from "./service";

export const ChatModule = new Elysia({ prefix: "/chat" })
  .post(
    "/conversations",
    async ({ body }) => {
      return ChatService.createConversation(body.language);
    },
    {
      body: t.Object({
        language: t.String(),
      }),
    },
  )

  .get("/conversations", async () => {
    return ChatService.listConversations();
  })

  .get(
    "/conversations/:id",
    async ({ params, status }) => {
      const conversation = await ChatService.getConversation(params.id);
      if (!conversation) return status(404);
      return conversation;
    },
  )

  .post(
    "/conversations/:id/message",
    async ({ params, body, status }) => {
      const conversation = await ChatService.getConversation(params.id);
      if (!conversation) return status(404);

      return ChatService.sendMessage(
        conversation.id,
        conversation.language,
        conversation.messages,
        body.audio,
      );
    },
    {
      body: t.Object({
        audio: t.File(),
      }),
    },
  );
