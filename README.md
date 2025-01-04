# create-solana-agent

:zap: Get up and running fast with Solana dApps :zap:

Just run one simple command to create a new agent chat UI with Solana Agent Kit!

```shell
npx create-solana-agent@latest
```

## Features

- 🎨 Modern, minimalist UI
<!-- - 📱 Fully responsive design with mobile-first approach -->
- ⛓️ Interact with 20+ Solana Protocols via Solana Agent Kit
- 🏗️ Built with:
  - Next 15
  - TypeScript
  - Tailwind CSS
  - Solana Agent Kit

## Project Structure

```
solana-agent-terminal/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # Chat API endpoint
│   ├── layout.tsx            # Root layout with providers
│   └── page.tsx              # Main chat interface
├── components/
│   └── ui/                   # Reusable UI components
├── lib/
│   └── utils.ts              # Utility functions
└── public/
    └── fonts/               # Custom fonts
```

## Development

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Create a new project:
   ```bash
   npx create-solana-agent@latest
   ```

2. Install dependencies:
   ```bash
   cd my-chat-app
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Customization

### Styling

The project uses Tailwind CSS for styling. Customize the theme in `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        // Add your custom colors
      }
    }
  }
}
```

### Components

UI components are built using shadcn/ui. Add new components:

```bash
npx shadcn-ui add [component-name]
```
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Solana Agent Kit](https://www.solanaagentkit.xyz/)
- [Next.js](https://nextjs.org)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com)

## FAQ

### Q: Can I use this in production?
A: Yes! The template is production-ready, but make sure to:
- Use appropriate environment variables
- Set up proper error handling
- Configure your Solana RPC endpoint

### Q: How do I deploy this?
A: The app can be deployed to any platform that supports Next.js:
- Vercel (recommended)
- Netlify
- AWS

### Q: How do I update the dependencies?
A: Run `npm outdated` to check for updates, then update packages individually or all at once with `npm update`.

## Roadmap

- [ ] Add persistent storage for chat history
- [ ] Add CI/CD pipeline
- [ ] Make UI mobile friendly