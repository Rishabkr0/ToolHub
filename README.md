# 🛠️ ToolHub

<div align="center">

**A modern, lightning-fast, privacy-first document and utility suite built with Next.js 16, React 19, and Tailwind CSS v4.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-v7-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Features](#-key-features) • [Tools Catalog](#-tools-catalog) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure)

</div>

---

## 🌟 Overview

**ToolHub** is a comprehensive, client-first web application designed to simplify document management and digital utility workflows. From PDF manipulation and image conversion to user workspaces and collections, ToolHub brings powerful tools together into a unified, privacy-focused platform.

Core PDF processing is executed **directly in your browser** using client-side engines—ensuring your sensitive documents never leave your device unless explicitly required.

---

## ✨ Key Features

- 🔒 **Privacy-First Architecture**: Client-side document processing with zero unnecessary server uploads for core operations.
- ⚡ **Blazing Fast Performance**: Powered by Next.js 16 App Router, React 19, and WebAssembly / Canvas-accelerated PDF rendering.
- 🎨 **Sleek, Modern UI**: Crafted with Tailwind CSS v4, fluid animations (`framer-motion`), Lucide icons, and light/dark theme support (`next-themes`).
- ✋ **Interactive Drag & Drop**: Visual page arrangement and reordering powered by `@dnd-kit`.
- 🔐 **Authentication & User Accounts**: Integrated account management and session handling via **Better-Auth**.
- 📂 **Personal Workspace**: History tracking, favorite tools, custom tool collections, and preference management backed by **Prisma** and **SQLite**.
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile browsers.

---

## 🧰 Tools Catalog

| Tool | Description | Status |
| :--- | :--- | :--- |
| **Merge PDF** | Combine multiple PDF documents into a single consolidated file in any custom order. | ✅ Available |
| **Split PDF** | Split large PDFs into standalone files or extract specific page ranges seamlessly. | ✅ Available |
| **Compress PDF** | Optimize document structure and streams to minimize file size without quality loss. | ✅ Available |
| **PDF to JPG** | Rasterize PDF pages into crisp, high-resolution JPG images with custom DPI and quality. | ✅ Available |
| **JPG to PDF** | Convert images (JPG, PNG, WebP) into standard PDF documents with configurable margins and orientation. | ✅ Available |
| **Rotate PDF** | Rotate individual pages or entire documents clockwise/counter-clockwise in 90° increments. | ✅ Available |
| **Delete PDF Pages** | Visually preview and remove unnecessary or blank pages from any document. | ✅ Available |
| **Extract PDF Pages** | Select and isolate specific pages to generate a clean, focused PDF file. | ✅ Available |
| **Organize PDF** | Visual drag-and-drop workspace to reorder, duplicate, rotate, and prune PDF pages. | ✅ Available |

---

## 💻 Tech Stack

### Frontend & Core
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components & Server Actions)
- **UI & State**: [React 19](https://react.dev/), [Base UI](https://base-ui.com/), [Radix / Shadcn](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), `tw-animate-css`
- **Icons & Animation**: [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/) (`core`, `sortable`, `utilities`)

### PDF & File Processing
- **PDF Manipulation**: [pdf-lib](https://pdf-lib.js.org/)
- **PDF Rendering & Thumbnails**: [pdfjs-dist](https://mozilla.github.io/pdf.js/)
- **Archive Generation**: [JSZip](https://stuk.github.io/jszip/)
- **Uploads & File Drops**: [React Dropzone](https://react-dropzone.js.org/), [UploadThing](https://uploadthing.com/)

### Backend & Persistence
- **ORM**: [Prisma ORM v7](https://www.prisma.io/)
- **Database**: SQLite with [@prisma/adapter-better-sqlite3](https://github.com/prisma/prisma)
- **Authentication**: [Better-Auth](https://www.better-auth.com/)
- **Data Fetching**: [TanStack React Query v5](https://tanstack.com/query/latest)
- **Validation**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)

---

## 📁 Project Structure

```text
ToolHub/
├── prisma/
│   └── schema.prisma              # Database models, users, workspace, and tools
├── public/                        # Static assets, icons, and PDF worker scripts
├── src/
│   ├── actions/                   # Next.js Server Actions
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/                # Authentication routes (sign-in, sign-up)
│   │   ├── (marketing)/           # Landing page, category browsing, search
│   │   ├── (tool)/                # Dedicated tool execution pages
│   │   ├── (workspace)/           # User dashboard, favorites, history, settings
│   │   └── api/                   # API routes (auth, upload, tools)
│   ├── components/
│   │   ├── layout/                # Headers, footers, navigation, sidebars
│   │   ├── shared/                # Common reusable widgets
│   │   └── ui/                    # Base UI / Shadcn component library
│   ├── config/                    # Global tool registry, categories, and site config
│   ├── features/
│   │   ├── auth/                  # Auth forms, hooks, and session guards
│   │   ├── pdf/                   # PDF engines, visual previewers, canvas renderers
│   │   └── workspace/             # Workspace collections, favorites, history
│   ├── lib/                       # Database client, auth client, helper utilities
│   └── types/                     # TypeScript declarations and schemas
├── .env.example                   # Environment variable template
├── package.json                   # Project dependencies and scripts
└── tsconfig.json                  # TypeScript compiler configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `20.x` or higher
- **npm**, **pnpm**, or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/Rishabkr0/ToolHub.git
cd ToolHub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Ensure your `.env` contains the SQLite database connection string:

```env
DATABASE_URL="file:./dev.db"
```

### 4. Initialize Database

Run Prisma migrations or push the schema to generate your SQLite database and Prisma client:

```bash
npx prisma db push
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view ToolHub.

---

## 📦 Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack / hot reloading |
| `npm run build` | Builds the optimized production application |
| `npm run start` | Runs the built production application |
| `npm run lint` | Runs ESLint to check code quality and formatting |

---

## 🔒 Security & Privacy

- **Client-Side Execution**: All core PDF tools (merge, split, compress, rotate, extract, delete, organize) process data inside the user's browser whenever possible.
- **Data Protection**: No documents are retained on server disks beyond temporary processing lifecycles.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
