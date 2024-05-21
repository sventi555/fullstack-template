# Fullstack Template

This is a template for a fullstack web application.
It is laid out as a monorepo composed of 3 packages by default:

- [client](./packages/client/README.md): Frontend application built with [Vite](https://vitejs.dev/)
- [server](./packages/server/README.md): Backend API built with [Hono](https://hono.dev/)
- [lib](./packages/lib/README.md): Library containing shared code used in both the client and server

## Requirements

- Node.js 20+
- pnpm 8+

## Getting Started

Install dependencies:

```
pnpm install
```

Copy the server package _.env.example_ file and rename it to _.env_:

```
cp ./packages/server/.env.example ./packages/server/.env
```

Start the app in dev mode:

```
pnpm dev
```

The client is accessible by default at port `3000`, and the server at port `3001`.

## Releasing

This repository contains a workflow that publishes docker images (client + server) to the specified GCP artifact registry and deploys Cloud Run revisions with the published images.
In order to perform the release process, the following GitHub Actions variables and secrets need to be set.

#### Variables

- `IMAGE_REGISTRY`: the location of the image registry being published to.

#### Secrets

- `GCP_CREDS`: a service account key with the following permissions:
  - Artifact Registry Writer
  - Cloud Run Admin
  - Service Account User

### Release Please

This template also includes a Release Please workflow that creates release PRs whenever eligible commits are made to the main branch.
Commit messages need to follow [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/) for Release Please to work correctly.
Merging a release PR will trigger a GitHub release, which in turn runs the release action deploying to GCP.
