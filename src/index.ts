import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { betterAuthModule } from "./config/auth";
import { ChatModule } from "./modules/chat";

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
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
