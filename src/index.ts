import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { betterAuthModule } from "./config/auth";
import { ChatModule } from "./modules/chat";
import "./jobs/workers";
import { whatsappQueue } from "./jobs/queues/whatsapp-queue";

const app = new Elysia()
  .use(
    cors({
      origin: ["*", "exp://192.168.*.*:*/**", "polish://"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(betterAuthModule)
  .use(ChatModule)
  .get("/", () => "")
  .get("/health", () => "Healthy")
  .post("/test", async () => {
    await whatsappQueue.add("send-message", {
      to: "+1234567890",
      type: "greeting",
    });
    return "Job added to WhatsApp queue";
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export default app;