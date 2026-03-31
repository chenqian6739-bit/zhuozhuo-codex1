import { Router } from "express";
import { prisma } from "../../persistence/prisma.js";

export const logRouter = Router();

logRouter.get("/logs/crawl", async (_req, res) => {
  const logs = await prisma.crawlRunLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return res.json(logs);
});

logRouter.get("/logs/notifications", async (_req, res) => {
  const logs = await prisma.notificationLog.findMany({ orderBy: { sentAt: "desc" }, take: 200 });
  return res.json(logs);
});
