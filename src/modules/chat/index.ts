import { Elysia, t } from "elysia";
import { ChatService } from "./service";

export const ChatModule = new Elysia({ prefix: "/chat" })
.post(
  "/conversations",
    //@ts-ignore - Elysia's type inference struggles with the auth macro
    async ({ body, user }) => {
      return ChatService.createConversation(body.language, user.id);
    },
    {
      body: t.Object({
        language: t.String(),
      }),
      auth: true,
    },
  )
  //@ts-ignore - Elysia's type inference struggles with the auth macro
  .get("/conversations", async ({ user }) => {

    
    const conversations = await ChatService.listConversations(user.id);
    return conversations;
  }, {
    //@ts-ignore - Elysia's type inference struggles with the auth macro
    auth: true,
  })

  .get(
    "/conversations/:id",
    async ({ params, status }) => {
      const conversation = await ChatService.getConversation(params.id);
      if (!conversation) return status(404);
      return conversation;
    },
    {
     //@ts-ignore - Elysia's type inference struggles with the auth macro
      auth: true,
    }
  )

  .post(
    "/conversations/:id/message",
      //@ts-ignore - Elysia's type inference struggles with the auth macro
    async ({ params, body, status, userId }) => {
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
      auth: true,
    },
  );
