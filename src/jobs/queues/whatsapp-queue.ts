import { Queue } from "bullmq";
import { redis } from "../../config/redis";

const whatsappQueue = new Queue("whatsapp", {
    connection: redis,
})

export { whatsappQueue }