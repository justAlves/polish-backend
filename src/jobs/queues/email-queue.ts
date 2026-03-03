import { Queue } from "bullmq";
import { redis } from "../../config/redis";

const emailQueue = new Queue("email", {
    connection: redis,
})

export { emailQueue }