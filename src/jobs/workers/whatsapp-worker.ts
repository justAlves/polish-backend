import { Worker } from "bullmq";
import { redis } from "../../config/redis";

const whatsappWorker = new Worker("whatsapp", async (job) => {
    console.log("Processing WhatsApp job:", job.id, job.data, job.name);
    // Here you would add the logic to process the WhatsApp job
    // For example, sending a message via the WhatsApp API
}, { connection: redis});

export { whatsappWorker }