# Vellum AI

Vellum AI is a premium, executive-grade CV adaptation engine designed for modern developers, architects, and professionals. It allows you to tailor your baseline career history to align with job descriptions from LinkedIn or Indeed in real-time, matching ATS checkpoints with zero data fabrication.

Built with **Nuxt 3**, **Tailwind CSS v4**, **Prisma**, **SQLite**, and **Gemini 2.5 Flash**, it features a design-forward Skincare Matte theme with full Dark Mode support.

---

## Key Features

- ✨ **Fact-Faithful Adaptation**: Our custom Gemini prompt rewrites accomplishments to align with job descriptions without fabricating skills, education, or experience history.
- 📊 **ATS Keyword Scorecard**: Real-time analysis showing matched competencies, integrated keywords, and a scorecard with an ATS compatibility rating.
- 📝 **Markdown Compare Editor**: Side-by-side comparative views of your original Master CV vs. the editable tailored output, with integrated GitHub-style diff rendering.
- 📱 **Mobile Friendly**: Fully optimized layouts down to 320px screen widths, featuring an overlay navigation drawer for both public and dashboard workspaces.
- 🌓 **Premium Matte Dark Mode**: Smooth HSL color-variable themes that persist to local storage based on your preferences.
- 🖨️ **Print Layout Style**: Formatted print sheets that hide sidebars and headers, enabling clean A4/Letter PDF printing of tailored CVs directly from the browser.

---

## Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/) (Vue 3, Vite)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using CSS-native design tokens & theme configuration)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Local DB**: SQLite (using `@prisma/adapter-better-sqlite3`)
- **Cloud DB**: LibSQL / [Turso](https://turso.tech) (using `@prisma/adapter-libsql`)
- **AI Core**: [Google Gemini 2.5 Flash API](https://ai.google.dev/)

---

## Local Setup & Installation

### 1. Clone & Install Dependencies
```bash
git clone git@github.com:sarwan920/tailor-cv-ai.git
cd tailor-cv-ai
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Database Connection (Local SQLite file)
DATABASE_URL="file:./dev.db"

# Gemini AI Credentials (Get one from Google AI Studio)
GEMINI_API_KEY="AIzaSy..."
```

### 3. Initialize the Database
Generate Prisma client files and apply the database schema to your local SQLite file:
```bash
# Run migrations
npx prisma migrate dev --name init

# Generate the Prisma client
npx prisma generate
```

### 4. Run the Development Server
Start the Hot Module Replacement (HMR) local dev server on `http://localhost:3000`:
```bash
npm run dev
```

---

## Database Commands

- **Prisma Studio**: Open the database visual interface to browse users, sessions, profiles, and tailored resumes:
  ```bash
  npx prisma studio
  ```
- **Database Push**: Sync your database schema directly without creating migration files (highly useful for Turso prototyping):
  ```bash
  npx prisma db push
  ```

---

## Production Build & Preview

Compile the application as a standalone Node.js server bundle:
```bash
# Build the production package
npm run build

# Preview the built project locally
node .output/server/index.mjs
```

---

## Deployment (Free Cloud Hosting)

This project contains native support for serverless platforms like **Vercel** combined with cloud SQLite services like **Turso**.

For complete step-by-step instructions on setting up a free database and hosting the app for free, please refer to the [Deployment Guide](.gemini/antigravity/brain/afcac159-fbf9-466f-84c1-401945c43590/deployment_guide.md) (or check local documentation).
