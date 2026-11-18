import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/database.js";
import { env } from "../../config/env.js";

export async function registerAdmin(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 12);
  return prisma.admin.create({
    data: { email: email.toLowerCase(), passwordHash },
    select: { id: true, email: true, createdAt: true }
  });
}

export async function loginAdmin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    return null;
  }

  if (!env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign({ adminId: admin.id }, env.JWT_SECRET, { expiresIn: "24h" });
  return {
    token,
    admin: { id: admin.id, email: admin.email, createdAt: admin.createdAt }
  };
}

export async function getAdmin(adminId: string) {
  return prisma.admin.findUnique({
    where: { id: adminId },
    select: { id: true, email: true, createdAt: true }
  });
}
