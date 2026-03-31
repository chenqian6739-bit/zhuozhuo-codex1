import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../persistence/prisma.js";
import { createProduct } from "../../services/productService.js";
import { checkProduct } from "../../services/snapshotService.js";

const createSchema = z.object({
  url: z.string().url(),
  targetPrice: z.number().positive(),
});

const updateSchema = z.object({
  monitoringEnabled: z.boolean().optional(),
  checkIntervalMins: z.number().positive().optional(),
  preferredChannel: z.enum(["TELEGRAM", "EMAIL"]).optional(),
});

export const productRouter = Router();

productRouter.post("/", async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const product = await createProduct(parsed.data);
  return res.status(201).json(product);
});

productRouter.get("/", async (_req, res) => {
  const products = await prisma.product.findMany();
  return res.json(products);
});

productRouter.get("/:id", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { rules: true, snapshots: { orderBy: { capturedAt: "desc" }, take: 100 } },
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.json(product);
});

productRouter.patch("/:id", async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten());
  }

  const updated = await prisma.product.update({
    where: { id: req.params.id },
    data: parsed.data,
  });

  return res.json(updated);
});

productRouter.delete("/:id", async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  return res.status(204).send();
});

productRouter.get("/:id/snapshots", async (req, res) => {
  const snapshots = await prisma.priceSnapshot.findMany({
    where: { productId: req.params.id },
    orderBy: { capturedAt: "desc" },
    take: 500,
  });
  return res.json(snapshots);
});

productRouter.post("/:id/check", async (req, res) => {
  const snapshot = await checkProduct(req.params.id);
  return res.json(snapshot);
});
