import dotenv from "dotenv"
import path from "path"
dotenv.config({ path: path.resolve(process.cwd(), ".env") })

import { PrismaClient } from "../generated/prisma/client.ts" 
import { PrismaNeon } from "@prisma/adapter-neon"

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

export const prisma = new PrismaClient({ adapter })