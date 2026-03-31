import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../persistence/prisma.js";

const ruleSchema = z.object({
  thresholdValue: z.number().positive(),
  cooldownMinutes: z.number().int().positive().default(720),
  isEnabled: z.boolean().default(true),
});

export const ruleRouter = Router();

ruleRouter.get("/products/:id/rules", async (req, res) => {
  const rules = await prisma.alertRule.findMany({ where: { productId: req.params.id } });
  return res.json(rules);
});

ruleRouter.post("/products/:id/rules", async (req, res) => {
  const parsed = ruleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const rule = await prisma.alertRule.create({
    data: {
      productId: req.params.id,
      thresholdValue: parsed.data.thresholdValue,
      cooldownMinutes: parsed.data.cooldownMinutes,
      isEnabled: parsed.data.isEnabled,
    },
  });

  return res.status(201).json(rule);
});

ruleRouter.patch("/rules/:id", async (req, res) => {
  const parsed = ruleSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const rule = await prisma.alertRule.update({ where: { id: req.params.id }, data: parsed.data });
  return res.json(rule);
});

ruleRouter.delete("/rules/:id", async (req, res) => {
  await prisma.alertRule.delete({ where: { id: req.params.id } });
  return res.status(204).send();
});
