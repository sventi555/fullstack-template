# Fullstack Template

This is a template for a fullstack web application.
It is laid out as a monorepo composed of 3 packages by default:
- [client](./packages/client/README.md): Frontend application built with [Vite](https://vitejs.dev/)
- [server](./packages/server/README.md): Backend API built with [Fastify](https://www.fastify.io/)
- [lib](./packages/lib/README.md): Library containing shared code used in both the client and server

## Requirements

- Node.js v18+
- Python3 (for running lerna/nx commands)

## Getting Started

Install dependencies:
```
yarn
```

Start the app in dev mode:
```
yarn dev
```

Commands can be run in the package workspaces by prefixing the command with the package name.

For example:
```
yarn client test
```
