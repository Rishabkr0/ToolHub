# 🗄️ Database & Schema Guide

ToolHub uses **Prisma ORM** for type-safe database access. The schema is located at `prisma/schema.prisma`.

## Core Domains

### 1. Identity & Access Management (IAM)
Powered by `Better-Auth`.
- **`User`**: Core user record.
- **`Session`** & **`Account`**: Handle active logins and OAuth provider linkages.

### 2. User Settings
- **`UserPreference`**: 1-to-1 relationship with `User`. Stores theme preferences, language, and notification settings.

### 3. Tool Catalog
The dynamic registry of available tools on the platform.
- **`Category`**: Broad grouping (e.g., "PDF Tools", "Image Tools").
- **`Tool`**: Individual utility definitions. Includes flags like `isActive` and `isPro`.
- **`Tag`**: Many-to-many relationship with tools for robust searchability.

### 4. Workspace & Collections
Allows users to personalize their experience.
- **`ToolHistory`**: Automatically tracks recently used tools per user.
- **`FavoriteTool`**: User-defined quick-access tools.
- **`Collection`** & **`CollectionTool`**: Users can create custom groups of tools (e.g., "Monthly Report Setup") and define the exact order of tools within that collection.

### 5. Telemetry & Analytics
- **`UsageStat`**: Aggregated usage tracking per tool per day, used to power "Popular Tools" sections without violating individual privacy.
- **`Upload`**: A strict registry for files that *must* be uploaded temporarily. Enforces an `expiresAt` field to guarantee data deletion.

## Development Commands

- **Push schema to DB (sync):** `npx prisma db push`
- **Generate Prisma Client:** `npx prisma generate`
- **View DB Data:** `npx prisma studio`
