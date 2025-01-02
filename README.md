# create-solana-agent

Create a full-featured chat application with Solana Agent Kit integration in seconds.

## Overview

`create-solana-agent` is a CLI tool that helps you quickly set up a modern chat application with Solana blockchain integration. Built with Next.js 14, TypeScript, and Solana Agent Kit, it provides a production-ready template with features like dark and light theme, responsive design, and Solana Agent Kit integration out of the box.

## Quick Start

```bash
npx create-solana-agent my-chat-app
cd my-chat-app
npm run dev
```

Visit `http://localhost:3000` to see your app.

## Features

- 🎨 Modern, minimalist UI with dark/light mode
- 📱 Fully responsive design with mobile-first approach
- ⛓️ Interact with 20+ Solana Protocols via Solana Agent Kit
- 🏗️ Built with:
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Solana Agent Kit

## Project Structure

```
my-chat-app/
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
   npx create-solana-agent my-chat-app
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

### Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SOLANA_RPC_URL=your_rpc_url
NEXT_PUBLIC_SOLANA_NETWORK=devnet  # or mainnet-beta
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

## Contributing

We love contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

### Development Workflow

1. Clone the repository:
   ```bash
   git clone https://github.com/sendaifun/create-solana-agent.git
   cd create-solana-agent
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a link to test locally:
   ```bash
   npm link
   ```

4. Make changes to the template or CLI
5. Test your changes:
   ```bash
   npx create-solana-agent test-app
   ```

### Code Style

- Use TypeScript for type safety
- Follow the ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

## Testing

Run the test suite:

```bash
npm test
```

## Building for Production

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Common Issues

### Troubleshooting

- Clear your `.next` cache:
  ```bash
  rm -rf .next
  ```
- Update dependencies:
  ```bash
  npm update
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

## Support

Need help? Here's how to get support:

- 📖 [Documentation](https://github.com/sendaifun/create-solana-agent/wiki)
- 💬 [Discussions](https://github.com/sendaifun/create-solana-agent/discussions)
- 🐛 [Issues](https://github.com/sendaifun/create-solana-agent/issues)

## Roadmap

- [ ] Implement real-time updates
- [ ] Implement database integration
- [ ] More chat specific features
- [ ] Improve test coverage
- [ ] Add CI/CD pipeline