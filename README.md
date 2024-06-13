# Vocabulary App

## Application Setup

### Notion

1. Create a [Notion](https://www.notion.so/) database. Be precise with column names and types. If you want to use different column names, adjust the server actions accordingly.

   | Column Name  | Type  |
   | ------------ | ----- |
   | Word         | Title |
   | Translation  | Text  |
   | Meaning      | Text  |
   | Example      | Text  |
   | Created date | Date  |

2. Create a [Notion integration](https://www.notion.so/my-integrations) and connect it to your database. You can find the tutorial [here](https://developers.notion.com/docs/create-a-notion-integration).
3. Add env variables to your Vercel project.

### Clerk

1. Create a [Clerk](https://clerk.com/) project.
2. Choose GitHub and Google options for your application.
3. Add env variables to your Vercel project.

### Google Cloud

1. Create [Google Cloud](https://cloud.google.com/?hl=en) project.
2. Add env variables to your Vercel project.

### Vercel

1. Create [Vercel](https://vercel.com/) project.
2. Create a PostgreSQL database.
3. Connect the forked or original repository to your project and deploy the app.

## Local Development Setup

This is a [Next.js](https://nextjs.org/) project.

### Setup Environment Variables

1. Create a `.env.local` file in the root of your project:
   ```bash
   cp .env.example .env.local
   ```
2. Open the `.env.local` file and update the values accordingly:

   ```bash
   # Notion
   NOTION_SECRET=your_notion_secret
   NOTION_VOCABULARY_DATABASE_ID=your_notion_vocabulary_database_id
   NEXT_PUBLIC_NOTION_VOCABULARY_TRANSLATION_LANGUAGE=UA  # Default is set to Ukrainian

   # URLs
   NEXT_PUBLIC_NOTION_PAGE_URL=your_notion_page_url
   NEXT_PUBLIC_VERCEL_PROJECT_URL=your_vercel_project_url

   # Google Cloud
   NEXT_PUBLIC_TEXT_TO_SPEECH_ENABLED=false  # Indicates if text-to-speech is enabled (true/false)
   GOOGLE_CLOUD_PRIVATE_KEY=your_google_cloud_private_key # Get this from Google Cloud Dashboard
   GOOGLE_CLOUD_CLIENT_EMAIL=your_google_cloud_client_email # Get this from Google Cloud Dashboard
   GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id # Get this from Google Cloud Dashboard

   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key # Get this from Clerk Dashboard
   CLERK_SECRET_KEY=your_clerk_secret_key # Get this from Clerk Dashboard
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/  # Clerk sign-in URL path
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/  # Clerk sign-up URL path
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/  # Redirect URL after sign-in
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/  # Redirect URL after sign-up

   # Postgres
   # Get all these values from Vercel Dashboard
   POSTGRES_URL=your_postgres_url
   POSTGRES_PRISMA_URL=your_postgres_prisma_url
   POSTGRES_URL_NO_SSL=your_postgres_url_no_ssl
   POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling
   POSTGRES_USER=your_postgres_user
   POSTGRES_HOST=your_postgres_host
   POSTGRES_PASSWORD=your_postgres_password
   POSTGRES_DATABASE=your_postgres_database
   ```

### Getting Started

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

3. To run Drizzle Studio:

   ```bash
   npm run db:studio
   # or
   yarn db:studio
   # or
   pnpm db:studio
   ```

   Open https://local.drizzle.studio/ with your browser to see Drizzle Studio.

For more details, refer to the `scripts` section in `package.json` file.
