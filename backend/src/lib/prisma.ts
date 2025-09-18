
// FIX: Changed to a named import to resolve module resolution issues.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;