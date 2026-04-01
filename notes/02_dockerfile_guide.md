
# Dockerfile – Complete Learning Guide

## What is a Dockerfile?

A **Dockerfile** is a plain-text script that contains step-by-step instructions for
building a Docker image. Think of it as a recipe.

```
Dockerfile → docker build → Image → docker run → Container
```

---

## Dockerfile for This Express App

```dockerfile
FROM node:18-alpine
LABEL maintainer="dockeriseasy-learner"
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "app.js"]
```

---

## Instruction-by-Instruction Breakdown

### `FROM node:18-alpine`
- **Purpose**: Specifies the base image to start from.
- `node:18-alpine` = Node 18 on Alpine Linux (~50 MB, very slim).
- Every Dockerfile **must** start with FROM.

```dockerfile
FROM node:18-alpine
```

---

### `LABEL`
- **Purpose**: Adds metadata (key-value pairs) to the image.
- Useful for author info, version, description.

```dockerfile
LABEL maintainer="yourname@example.com"
LABEL version="1.0"
```

---

### `WORKDIR /app`
- **Purpose**: Sets the working directory for all subsequent instructions.
- Creates `/app` inside the container if it doesn't exist.
- Equivalent to `mkdir /app && cd /app`.

```dockerfile
WORKDIR /app
```

---

### `COPY package*.json ./`
- **Purpose**: Copies `package.json` and `package-lock.json` **before** source code.
- 💡 **Why first?**  Docker caches each layer. If you copy package files first and run
  `npm install`, that heavy layer is **re-used** until you change package.json.

```dockerfile
COPY package*.json ./
```

---

### `RUN npm install --omit=dev`
- **Purpose**: Executes a shell command and creates a new image layer.
- `--omit=dev` skips devDependencies for a smaller production image.
- Common uses: installing packages, compiling code, creating directories.

```dockerfile
RUN npm install --omit=dev
```

---

### `COPY . .`
- **Purpose**: Copies remaining source files from host into the container.
- The `.dockerignore` file tells Docker what to skip (like `node_modules`).

```dockerfile
COPY . .
```

---

### `EXPOSE 3000`
- **Purpose**: Documents that the container listens on port 3000.
- ⚠️ This does **not** actually publish the port – use `-p` flag with `docker run`.

```dockerfile
EXPOSE 3000
```

---

### `HEALTHCHECK`
- **Purpose**: Tells Docker how to test if the container is healthy.
- Docker periodically runs the check and marks container as `healthy` or `unhealthy`.

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1
```

---

### `CMD ["node", "app.js"]`
- **Purpose**: Default command run when the container starts.
- Use **array / exec form** `["node", "app.js"]` (not shell form `node app.js`).
- Only **one CMD** per Dockerfile (last one wins).

```dockerfile
CMD ["node", "app.js"]
```

---

## Key Differences: RUN vs CMD vs ENTRYPOINT

| Instruction  | When it runs          | Use case                        |
|-------------|----------------------|---------------------------------|
| `RUN`        | During `docker build` | Install packages, compile code  |
| `CMD`        | During `docker run`   | Default start command           |
| `ENTRYPOINT` | During `docker run`   | Fixed start command, unoverridable |

---

## Layer Caching – Why Order Matters

```dockerfile
# ✅ GOOD – cache-friendly order
COPY package*.json ./
RUN npm install          # ← cached unless package.json changes
COPY . .                 # ← only this layer re-runs on code change

# ❌ BAD – every code change re-runs npm install
COPY . .
RUN npm install
```

---

## Build & Run Commands

```bash
# 1. Build the image
docker build -t dockeriseasy:v1 .

# 2. Check the image was created
docker image ls

# 3. Run the container
docker run -d -p 3000:3000 --name easy dockeriseasy:v1

# 4. Test it
curl http://localhost:3000/
curl http://localhost:3000/info
curl http://localhost:3000/dockerfile
curl http://localhost:3000/commands

# 5. View logs
docker logs easy

# 6. Open a shell inside the container
docker exec -it easy sh

# 7. Stop and clean up
docker stop easy
docker rm easy
docker rmi dockeriseasy:v1
```

---

## Using Docker Compose (easier!)

```bash
# From the app/ directory:

# Build and start
docker compose up --build -d

# View logs
docker compose logs -f

# Stop and remove
docker compose down
```

---

## Dockerfile Best Practices

| ✅ Do                                  | ❌ Don't                               |
|---------------------------------------|---------------------------------------|
| Use slim base images (`alpine`)       | Use `FROM ubuntu` for Node apps       |
| Copy package files before source     | Copy everything in one COPY           |
| Use `.dockerignore`                   | Send `node_modules` in build context  |
| Use exec form for CMD                 | Use shell form `CMD node app.js`      |
| Add a HEALTHCHECK                     | Leave containers without health checks|
| Use multi-stage builds for prod      | Bundle dev tools in production image  |

---

## Quick Reference

```
FROM        Base image
WORKDIR     Set working directory
COPY        Copy files from host
RUN         Execute command during build
EXPOSE      Document a port
ENV         Set environment variable
ARG         Build-time variable
HEALTHCHECK Test container health
CMD         Default runtime command
ENTRYPOINT  Fixed runtime command
```
