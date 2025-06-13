# Michele Bellitti Portfolio

A modern, interactive portfolio website built with Next.js 14, TypeScript, and Supabase.

## Features

- 🎨 Modern design with smooth animations (Framer Motion)
- 🌓 Dark/Light mode support
- 🎭 3D particle effects with Three.js
- 📱 Fully responsive design
- 🔐 Admin authentication system
- 📄 CV/Resume management
- ✏️ Visual CV editor
- 🚀 Optimized performance

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **3D Graphics**: Three.js
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio-michele.git
cd portfolio-michele
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL commands from the setup guide to create tables
   - Copy your project URL and keys

4. Configure environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase credentials
   - Set your admin email

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Admin Features

Access admin features by logging in at `/login` with your configured admin email.

- Upload/manage resume PDFs
- Use the visual CV editor
- Update projects (future feature)

## Deployment

Deploy to Vercel:

```bash
vercel
```

Remember to set environment variables in the Vercel dashboard.

## Project Structure

```
portfolio-michele/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utilities and configurations
├── hooks/           # Custom React hooks
├── types/           # TypeScript types
└── public/          # Static assets
```

## License

MIT License

## Contact

Michele Bellitti - michelebellitti272@gmail.com