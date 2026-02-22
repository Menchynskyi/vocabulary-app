# 📚 Vocabulary App

A Next.js vocabulary learning app powered by Notion as a CMS, Clerk for authentication, Google Cloud for text-to-speech, and Vercel for hosting.

---

## 🚀 Application Setup

### 1. Notion

1. Create a [Notion](https://www.notion.so/) database with the following schema:

   | Column Name    | Type  |
   |:---------------|:------|
   | Word           | Title |
   | Translation    | Text  |
   | Meaning        | Text  |
   | Example        | Text  |
   | Created date   | Date  |

   > ⚠️ Column names must match exactly. If you want custom names, update the server actions accordingly.

2. Create a [Notion integration](https://www.notion.so/my-integrations) and connect it to your database.
   See the [official guide](https://developers.notion.com/docs/create-a-notion-integration) for details.

3. Copy the integration secret and database ID — you'll need them for environment variables.

### 2. Clerk

1. Create a [Clerk](https://clerk.com/) project.
2. Enable **GitHub** and **Google** as sign-in providers.
3. Copy the publishable key and secret key.

### 3. Google Cloud

1. Create a [Google Cloud](https://cloud.google.com/?hl=en) project.
2. Enable the **Text-to-Speech API**.
3. Create a service account and download the credentials (private key, client email, project ID).

### 4. Vercel

1. Create a [Vercel](https://vercel.com/) project.
2. Provision a **PostgreSQL database** from the Vercel dashboard.
3. Add all environment variables (see [Environment Variables](#-environment-variables) below).
4. Connect your forked/cloned repository and deploy.

---

## 🛠️ Local Development

### Prerequisites

* Node.js 18+
* npm, yarn, or pnpm

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Then fill in `.env.local`:

<details>
<summary>📋 Full <code>.env.local</code> template</summary>

```bash
# ─── Notion ───────────────────────────────────────
NOTION_SECRET=your_notion_secret
NOTION_VOCABULARY_DATABASE_ID=your_notion_vocabulary_database_id
NEXT_PUBLIC_NOTION_VOCABULARY_TRANSLATION_LANGUAGE=UA

# ─── URLs ─────────────────────────────────────────
NEXT_PUBLIC_NOTION_PAGE_URL=your_notion_page_url
NEXT_PUBLIC_VERCEL_PROJECT_URL=your_vercel_project_url

# ─── Google Cloud (Text-to-Speech) ────────────────
NEXT_PUBLIC_TEXT_TO_SPEECH_ENABLED=false
GOOGLE_CLOUD_PRIVATE_KEY=your_google_cloud_private_key
GOOGLE_CLOUD_CLIENT_EMAIL=your_google_cloud_client_email
GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id

# ─── Clerk ────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# ─── Postgres (from Vercel Dashboard) ─────────────
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NO_SSL=your_postgres_url_no_ssl
POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling
POSTGRES_USER=your_postgres_user
POSTGRES_HOST=your_postgres_host
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_database
```

</details>

### 3. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 4. Database Studio (Optional)

```bash
npm run db:studio
```

Open [https://local.drizzle.studio](https://local.drizzle.studio) to browse your database.

> 💡 See the `scripts` section in `package.json` for all available commands.
