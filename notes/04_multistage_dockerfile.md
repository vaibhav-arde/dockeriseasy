# Multi-Stage Docker Images for Production

## What is a Multi-Stage Docker Build?

A **multi-stage Docker build** means using **multiple `FROM` instructions** in a single `Dockerfile`.

Each stage has a different purpose, such as:

- installing dependencies
- building the app or framework
- preparing runtime files
- creating a smaller final production image

Instead of shipping everything, Docker allows you to copy **only the required files** from one stage to another.

---

## Why Multi-Stage Builds Are Important in Production

In production, the goal is not just **“it works”** — the goal is:

- **small image size**
- **fast CI/CD**
- **better security**
- **fewer unnecessary files**
- **more predictable deployments**

### Without multi-stage builds, your image may contain:

- source files not needed at runtime
- package manager caches
- test artifacts
- build tools
- dev dependencies

### With multi-stage builds, your final image contains only:

- runtime dependencies
- app/test code needed to execute
- required binaries or browsers

---

## How It Works

A common pattern is:

### Stage 1 — Build / Install

This stage is used to:

- install packages
- compile code
- prepare dependencies

### Stage 2 — Runtime / Production

This stage is used to:

- keep only the required output
- avoid shipping unnecessary tools and files

---

## Basic Syntax

```dockerfile
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:20-slim AS production
WORKDIR /app
COPY --from=builder /app /app
CMD ["node", "index.js"]

---

## Important Keywords

### `FROM`

Starts a new image stage.

### `AS`

Gives a stage a readable name.

Example:

```dockerfile
FROM node:20 AS builder
```

### `COPY --from=...`

Copies files from one stage into another.

Example:

```dockerfile
COPY --from=builder /app /app
```

---

## Why This Is Useful for Automation Projects

If you are running automation frameworks for SaaS/startup clients, multi-stage builds help you create a more professional delivery.

Instead of saying:

> “Install Node, browsers, dependencies, then run this manually…”

You can give clients or your team:

> “Build once, run anywhere.”

This improves:

* onboarding
* repeatability
* team productivity
* CI reliability
* client confidence

---

## Production Benefits

## 1) Smaller Images

Smaller images mean:

* faster build time
* faster push/pull
* lower CI/CD cost

---

## 2) Better Security

If the final image has fewer packages and tools, there are fewer attack points.

---

## 3) Better Layer Caching

Docker builds faster when dependency installation is separated properly.

Example:

```dockerfile
COPY package*.json ./
RUN npm ci
COPY . .
```

This is better than:

```dockerfile
COPY . .
RUN npm ci
```

Because Docker can reuse cached dependency layers if your source code changes but dependencies don’t.

---

## 4) Cleaner Separation of Responsibilities

You can create separate stages like:

* `deps`
* `build`
* `test`
* `production`

This is easier to maintain as your team grows.

---

## Best Practices for Production

### Use specific versions

Bad:

```dockerfile
FROM node:latest
```

Better:

```dockerfile
FROM node:20-bookworm
```

---

### Use `.dockerignore`

Prevent Docker from copying unnecessary files like:

* `.git`
* `node_modules`
* `venv`
* reports
* screenshots
* `.env`

---

### Avoid copying secrets

Do **not** bake credentials into images.

Bad:

```dockerfile
COPY .env .
```

Use runtime environment variables instead.

---

### Keep final stage minimal

Your production image should include only what is needed to run.

---

## One Practical Example — Playwright JavaScript (Production)

This is a good real-world example for a Playwright JS automation project.

### Folder Example

```text
project/
├── tests/
├── playwright.config.js
├── package.json
├── package-lock.json
└── Dockerfile
```

---

## Dockerfile Example

```dockerfile
# Stage 1: Install dependencies
FROM node:20-bookworm AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Stage 2: Copy project files
FROM deps AS builder

WORKDIR /app
COPY . .

# Stage 3: Production runtime
FROM mcr.microsoft.com/playwright:v1.58.2-noble AS production

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app ./

ENV CI=true

CMD ["npx", "playwright", "test"]
```

---

## Explanation of This Example

### Stage 1 — `deps`

```dockerfile
FROM node:20-bookworm AS deps
```

Used to install dependencies.

```dockerfile
COPY package*.json ./
RUN npm ci
```

Why `npm ci`?
Because it is:

* faster
* reproducible
* best for CI/CD

---

### Stage 2 — `builder`

```dockerfile
FROM deps AS builder
COPY . .
```

This copies your framework code:

* tests
* config
* utilities
* page objects

---

### Stage 3 — `production`

```dockerfile
FROM mcr.microsoft.com/playwright:v1.58.2-noble AS production
```

This final stage uses the official Playwright image, which already includes:

* browser dependencies
* Playwright-compatible environment
* stable runtime setup

Then we copy only what is needed:

```dockerfile
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app ./
```

Finally:

```dockerfile
CMD ["npx", "playwright", "test"]
```

This means the container runs tests when started.

---

## Build and Run Commands

### Build Image

```bash
docker build -t playwright-prod .
```

### Run Container

```bash
docker run --rm --init --ipc=host playwright-prod
```

---

## Final Summary

A **multi-stage Docker build** is an industry-standard way to create **clean, small, production-ready Docker images**.

### Main advantages:

* smaller images
* faster CI/CD
* better security
* cleaner deployments
* better team standardization

### Best use case:

Use multi-stage Docker whenever you want to ship a framework or application professionally.

For automation teams, it is one of the best ways to make your framework:

* reproducible
* scalable
* client-ready
* CI-friendly

---

## Short Interview Definition

> **Multi-stage Docker build** is a Dockerfile technique where multiple `FROM` statements are used to separate build and runtime environments, allowing only required artifacts to be included in the final production image.

---

---
