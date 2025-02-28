# Shuto - Image Processing and Delivery

This monorepo contains packages and examples for using the shuto-api into your applications. You can find the repo for the main shuto API service [here](https://github.com/shutolabs/api).

## 📦 Packages

- [@shuto-img/api](packages/api/README.md) - Core TypeScript/JavaScript client for interacting with the Shuto API
- [@shuto-img/react](packages/react/README.md) - React components and hooks for seamless Shuto integration

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or later
- pnpm (recommended) or npm

### Local Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/shuto-mono.git
   cd shuto-mono
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Build all packages:

   ```bash
   pnpm nx run-many --target=build --all
   ```

4. Run tests:
   ```bash
   pnpm nx run-many --target=test --all
   ```

## 🔧 Using Nx

This project uses [Nx](https://nx.dev) for managing the monorepo workspace. Nx provides powerful tools for building and testing multiple packages efficiently.

### Key Nx Commands

- Build a specific package:

  ```bash
  pnpm nx build @shuto-img/react
  ```

- Test a specific package:

  ```bash
  pnpm nx test @shuto-img/react
  ```

- Run the example app:

  ```bash
  pnpm nx serve react-example
  ```

- Generate dependency graph:
  ```bash
  pnpm nx graph
  ```

## 📚 Documentation

Each package contains its own detailed documentation:

- [@shuto-img/api](packages/api/README.md) - Core API client documentation
- [@shuto-img/react](packages/react/README.md) - React integration documentation

## 📝 License

MIT
