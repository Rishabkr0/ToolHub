# 🏗️ ToolHub Architecture Guide

This document outlines the high-level architecture of ToolHub, detailing how the frontend, core processing, and backend interact.

## 1. System Overview
ToolHub is a client-first application. To ensure user privacy and reduce server costs, the vast majority of file processing occurs **in the user's browser**. The server is primarily used for authentication, user preferences, history tracking, and serving the Next.js application.

## 2. Frontend Architecture
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4, Base UI, and Shadcn for robust accessible components.
- **State Management**: React state hooks combined with `TanStack React Query` for asynchronous data fetching and cache management.

### Component Structure
The `src/` directory is organized into domains:
- `src/app/`: Next.js file-based routing.
- `src/features/`: Domain-specific logic (e.g., `auth`, `pdf`, `workspace`). Each feature folder encapsulates its own components, hooks, and utilities to prevent a monolithic codebase.
- `src/components/`: Shared, globally used components (UI elements, layout wrappers).

## 3. Client-Side Processing (The "Client-First" Engine)
For PDF operations, ToolHub avoids uploading files to a server.
- **Parsing and Modification**: Powered by `pdf-lib`. Operations like Merge, Split, Rotate, and Delete manipulate the PDF Document Object Model directly in memory using WebAssembly/JavaScript.
- **Rendering**: Powered by `pdfjs-dist` (Mozilla's PDF.js). This allows ToolHub to render PDF pages onto HTML `<canvas>` elements to generate thumbnails and allow visual reordering without server rendering.
- **Performance**: Heavy operations should utilize Web Workers where possible to prevent locking the main UI thread during massive PDF processing.

## 4. Backend & Database
- **API Architecture**: Next.js Server Actions and API Route Handlers (`src/app/api/`).
- **Database**: Prisma ORM with SQLite (Development). Production will transition to PostgreSQL.
- **Authentication**: `Better-Auth` provides secure session management, credential, and OAuth workflows.

## 5. Security & Privacy
- Files loaded into the dropzone remain entirely in browser memory.
- If an upload is strictly required in the future, it will generate a secure, temporary bucket URL, and the `Upload` table manages a lifecycle for automatic deletion.
