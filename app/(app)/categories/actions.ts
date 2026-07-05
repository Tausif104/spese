"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth/session";
import { categorySchema, type CategoryInput } from "@/lib/validation/category";

export async function createCategory(input: CategoryInput) {
  const userId = await requireUserId();
  const data = categorySchema.parse(input);
  await prisma.category.create({ data: { ...data, userId } });
  revalidatePath("/categories");
}

export async function updateCategory(id: string, input: CategoryInput) {
  const userId = await requireUserId();
  const data = categorySchema.parse(input);
  // Type is locked on edit; only name/color change.
  await prisma.category.updateMany({
    where: { id, userId },
    data: { name: data.name, color: data.color },
  });
  revalidatePath("/categories");
}

export async function deleteCategory(id: string) {
  const userId = await requireUserId();
  await prisma.category.deleteMany({ where: { id, userId } });
  revalidatePath("/categories");
}
