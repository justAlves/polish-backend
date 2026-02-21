import { Elysia, t } from "elysia";
import { ChatService } from "./service";
import { betterAuthModule } from "../../config/auth";

export const ChatModule = new Elysia({ prefix: "/chat" })
  .use(betterAuthModule)
  .post(
    "/conversations",
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

  .get("/conversations", async ({ user }) => {

    
    const conversations = await ChatService.listConversations(user.id);
    return conversations;
  }, {
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
      auth: true,
    }
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
      auth: true,
    },
  );
