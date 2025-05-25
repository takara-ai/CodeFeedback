# CodeFeedback - Prompt Engineering Training

A Duolingo-style app for learning prompt engineering through hands-on practice.

## Features

- 🎯 **Interactive Challenges**: Practice with real coding prompts
- 🏆 **Leaderboard System**: Compete with other prompt engineers
- 📊 **Real-time Scoring**: Get instant feedback on your improvements
- 🎮 **Gamified Learning**: Duolingo-style progression and hints
- 🌙 **Dark/Light Mode**: Comfortable learning environment

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (package manager)

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd CodeFeedback
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Add your Mistral API key to `.env.local`:

```
MISTRAL_API_KEY=your_mistral_api_key_here
```

### Leaderboard Setup (Required)

For persistent leaderboards using Upstash Redis:

1. **Create an Upstash Redis database** at [upstash.com](https://upstash.com)
2. **Add environment variables** in Vercel or your `.env.local`:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

> **Note**: Upstash Redis is required for the leaderboard functionality to work.

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to start learning!

### Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/CodeFeedback)

## How It Works

1. **Challenge**: Get a bad prompt that generates poor code
2. **Improve**: Edit the prompt to be more specific and clear
3. **Test**: See how your improved prompt generates better code
4. **Score**: Get points based on code quality improvements
5. **Compete**: Add your name to the leaderboard!

### Scoring System

- **Cumulative Scoring**: Your scores accumulate each time you play! Submit multiple challenges to climb higher on the leaderboard.
- **Code Quality Metrics**: Scores are based on improvements in functions, error handling, documentation, validation, and security.
- **Percentage Improvement**: Scores represent the percentage improvement from the original code to your improved version.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Upstash Redis for leaderboards
- **AI**: Mistral AI for code generation and analysis
- **Deployment**: Vercel

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
