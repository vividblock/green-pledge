# Green Pledge Initiative - MVP

This project is a Minimum Viable Product (MVP) for the Green Pledge Initiative, a platform allowing users to create and share pledges for carbon reduction.

This MVP focuses on the core loop:
1.  **Create** a pledge.
2.  **Save** the pledge to a PostgreSQL database.
3.  **View** public pledges on the homepage.
4.  **Download** a basic PDF certificate of a pledge.

## Tech Stack

*   **Frontend & Backend Framework:** [Next.js](https://nextjs.org/) (using App Router)
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/) (managed via Docker Compose for local development)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **PDF Generation:** [pdf-lib](https://pdf-lib.js.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)

## Project Structure (Key MVP Files)

```
.
├── app/                        # Next.js App Router
│   ├── page.tsx                # Homepage (lists public pledges)
│   ├── create-pledge/
│   │   ├── page.tsx            # Page to host the create pledge form
│   │   ├── CreatePledgeForm.tsx # Client component for the form
│   │   └── actions.ts          # Server Action to handle form submission
│   └── pledges/
│       └── [id]/
│           └── download/
│               └── route.ts    # Route Handler for PDF generation & download
├── lib/
│   └── prisma.ts               # Prisma client instantiation
├── prisma/
│   ├── schema.prisma           # Prisma schema definition
│   └── migrations/             # (Will be created when you use `prisma migrate dev`)
├── public/                     # Static assets
├── .env                        # Environment variables (DATABASE_URL) - DO NOT COMMIT SENSITIVE DATA
├── .env.example                # Example environment variables
├── docker-compose.yml          # Docker Compose for PostgreSQL
├── next.config.js
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18.x or later recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd green-pledge-app
```

### 2. Install Dependencies

```bash
npm install
# or
# yarn install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project by copying `.env.example` (if you create one) or manually.
It should contain your database connection string:

```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/greenpledgedb?schema=public"
```

*   `user`: The PostgreSQL username (e.g., `postgres` if using the `docker-compose.yml` below)
*   `password`: The PostgreSQL password (e.g., `mysecretpassword` if using the `docker-compose.yml` below)
*   `localhost:5432`: The host and port where PostgreSQL will be running (from Docker).
*   `greenpledgedb`: The name of the database.
*   `?schema=public`: Ensures Prisma uses the default public schema.

**Create an `.env.example` for your repository (without sensitive data):**
```env
# .env.example
DATABASE_URL="postgresql://DB_USER:DB_PASSWORD@DB_HOST:DB_PORT/DB_NAME?schema=public"
```

### 4. Start PostgreSQL using Docker Compose

Create a `docker-compose.yml` file in the root of your project:

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres_db:
    image: postgres:15 # Or your preferred PostgreSQL version
    container_name: green_pledge_postgres
    restart: always
    environment:
      POSTGRES_USER: postgres # Or your desired username
      POSTGRES_PASSWORD: mysecretpassword # Or your desired password
      POSTGRES_DB: greenpledgedb # The database name
    ports:
      - "5432:5432" # Maps container port 5432 to host port 5432
    volumes:
      - postgres_data:/var/lib/postgresql/data # Persists data

volumes:
  postgres_data:
```

Then, run:

```bash
docker-compose up -d
```

This will start a PostgreSQL container in the background.

### 5. Apply Database Schema with Prisma

Once the database is running, apply your Prisma schema:

```bash
npx prisma migrate dev --name init
```
*   This command will create your database if it doesn't exist (based on your `DATABASE_URL`).
*   It will create a `migrations` folder and apply the schema defined in `prisma/schema.prisma`.
*   It will also generate the Prisma Client.

*(If you've already used `npx prisma db push` and want to switch to migrations, you might need to baseline your database first. For a fresh start, `migrate dev` is good.)*

Alternatively, if you are in early development and don't need migration files yet:
```bash
npx prisma db push
```
Followed by:
```bash
npx prisma generate
```

### 6. Run the Development Server

```bash
npm run dev
# or
# yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How the Project Runs (MVP Workflow)

1.  **Homepage (`app/page.tsx`):**
    *   This is a Next.js Server Component.
    *   It directly queries the PostgreSQL database using `prisma.pledge.findMany(...)` to fetch pledges where `isPublic` is true.
    *   It displays information about the project and lists these public pledges.
    *   Contains a link to `/create-pledge`.

2.  **Create Pledge Page (`app/create-pledge/...`):**
    *   **`page.tsx`:** Hosts the `CreatePledgeForm` client component.
    *   **`CreatePledgeForm.tsx`:**
        *   A client component (`'use client'`) that renders the HTML form.
        *   Uses `useFormState` and `useFormStatus` for handling form submission with a Server Action.
    *   **`actions.ts`:**
        *   A Server Action (`'use server'`).
        *   Receives `FormData` from the form.
        *   Uses `zod` for validation.
        *   If valid, uses `prisma.pledge.create(...)` to save the new pledge to the database.
        *   Calls `revalidatePath('/')` to ensure the homepage shows the new pledge if it's public.
        *   Returns a message/status to the client form.

3.  **Download Pledge PDF (`app/pledges/[id]/download/route.ts`):**
    *   This is a Next.js Route Handler (an API endpoint).
    *   It's accessed via a URL like `/pledges/some-pledge-id/download`.
    *   It receives the `pledgeId` from the URL parameters.
    *   Uses `prisma.pledge.findUnique(...)` to fetch the specific pledge data.
    *   Uses the `pdf-lib` library to dynamically generate a PDF document in memory.
    *   Sends the PDF back to the browser with `Content-Type: application/pdf` and `Content-Disposition: attachment` headers, prompting a download.

## Database Management with Prisma

*   **Schema Definition:** `prisma/schema.prisma` is the single source of truth for your database schema.
*   **Migrations:**
    *   `npx prisma migrate dev --name <migration_name>`: Creates a new SQL migration file and applies it. (Recommended for changes after initial setup).
*   **Prisma Client:**
    *   `npx prisma generate`: Run this after any changes to `schema.prisma` to update the typed Prisma Client used for database queries.
*   **Prisma Studio (Optional):**
    *   `npx prisma studio`: Opens a web UI to view and manage your database data.

## Next Steps (Post-MVP Considerations)

*   User Authentication (e.g., with NextAuth.js or by integrating Supabase Auth if you reconsider).
*   User dashboards to view/manage their own pledges.
*   Editing pledges.
*   More sophisticated pledge update tracking.
*   Advanced PDF certificate styling.
*   Robust error handling and UI/UX improvements.
*   Unit and integration tests.
