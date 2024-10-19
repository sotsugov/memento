# Memento - Recurring Reminder App

Memento is a web application that allows users to set and manage recurring reminders

## Tech Stack

- **Frontend Framework**: Next.js 14 (React)
- **Styling**: TailwindCSS
- **Date Manipulation**: date-fns
- **Database**: Supabase
- **Deployment**: Vercel
- **Jest**: For testing

## Installation

To set up the project locally, follow these steps:

```
pnpm install
```

Set up environment variables:

Create a `.env.local` file in the root directory and add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.


## Testing

Jest and React Testing Library for testing. To run the tests:

```
pnpm test
```
