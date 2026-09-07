import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import Database from "better-sqlite3"

const sqlite = new Database("prisma/dev.db")
const adapter = new PrismaBetterSqlite3(sqlite as any)
const prisma = new PrismaClient({ adapter })

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite",
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "dummy",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "dummy",
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "dummy",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy",
        },
    },
})
