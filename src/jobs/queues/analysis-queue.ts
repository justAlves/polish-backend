import { Queue } from "bullmq";
import { redis } from "../../config/redis";

const analysisQueue = new Queue("analysis", {
    connection: redis,
})

export { analysisQueue }