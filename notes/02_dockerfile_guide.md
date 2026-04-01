
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
---
---


# Dockerfile Notes (Complete Guide)

---

## What is a Dockerfile

A Dockerfile is a **text file containing instructions** to build a Docker image.

👉 It automates image creation.

---

## Basic Structure of Dockerfile

```dockerfile
# Base Image
FROM ubuntu:20.04

# Metadata
LABEL maintainer="you@example.com"

# Install dependencies
RUN apt-get update && apt-get install -y nginx

# Copy files
COPY . /app

# Set working directory
WORKDIR /app

# Expose port
EXPOSE 80

# Default command
CMD ["nginx", "-g", "daemon off;"]
````

---

# 🔹 Dockerfile Keywords (Instructions)

---

## 1. FROM

### Description

* Specifies the base image
* MUST be the first instruction

### Example

```dockerfile
FROM node:18
```

---

## 2. LABEL

### Description

* Adds metadata to image

### Example

```dockerfile
LABEL version="1.0" author="John"
```

---

## 3. RUN

### Description

* Executes commands during build time
* Creates a new layer

### Example

```dockerfile
RUN apt-get update
RUN apt-get install -y curl
```

👉 Best practice:

```dockerfile
RUN apt-get update && apt-get install -y curl
```

---

## 4. COPY

### Description

* Copies files from local system → container

### Example

```dockerfile
COPY . /app
COPY index.html /usr/share/nginx/html/
```

---

## 5. ADD

### Description

* Similar to COPY but with extra features:

  * Can extract `.tar` files
  * Can download from URL

### Example

```dockerfile
ADD app.tar.gz /app
ADD https://example.com/file.txt /file.txt
```

👉 Prefer `COPY` unless extra features needed

---

## 6. WORKDIR

### Description

* Sets working directory inside container

### Example

```dockerfile
WORKDIR /app
```

👉 Automatically creates directory if not exists

---

## 7. EXPOSE

### Description

* Documents which port container uses

### Example

```dockerfile
EXPOSE 3000
```

👉 Does NOT publish port (just info)

---

## 8. ENV

### Description

* Sets environment variables

### Example

```dockerfile
ENV NODE_ENV=production
ENV PORT=3000
```

---

## 9. ARG

### Description

* Build-time variables

### Example

```dockerfile
ARG VERSION=1.0
```

👉 Used during build only

---

## 10. CMD

### Description

* Default command when container starts
* Only one CMD is used (last one)

### Example

```dockerfile
CMD ["node", "app.js"]
```

---

## 11. ENTRYPOINT

### Description

* Fixed command that always runs

### Example

```dockerfile
ENTRYPOINT ["node"]
```

👉 Combine with CMD:

```dockerfile
ENTRYPOINT ["node"]
CMD ["app.js"]
```

---

## 12. USER

### Description

* Sets user inside container

### Example

```dockerfile
USER node
```

---

## 13. VOLUME

### Description

* Creates mount point for persistent data

### Example

```dockerfile
VOLUME /data
```

---

## 14. ONBUILD

### Description

* Executes when image is used as base

### Example

```dockerfile
ONBUILD COPY . /app
```

---

## 15. SHELL

### Description

* Changes default shell

### Example

```dockerfile
SHELL ["/bin/bash", "-c"]
```

---

# 🔹 Example Dockerfile (Node App)

```dockerfile
FROM node:18

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
```

---

# 🔹 Build and Run Example

## Build Image

```bash
docker build -t mynodeapp .
```

## Run Container

```bash
docker run -d -p 3000:3000 mynodeapp
```

---

# 🔹 Important Concepts

---

## Layers

* Each instruction creates a layer
* Layers are cached for faster builds

---

## Best Practices

* Use small base images (`alpine`)
* Combine RUN commands
* Use `.dockerignore`
* Avoid unnecessary files
* Use specific versions (not `latest`)

---

# 🔹 Quick Summary Table

| Instruction | Purpose              |
| ----------- | -------------------- |
| FROM        | Base image           |
| RUN         | Execute command      |
| COPY        | Copy files           |
| ADD         | Advanced copy        |
| WORKDIR     | Set directory        |
| EXPOSE      | Declare port         |
| CMD         | Default command      |
| ENTRYPOINT  | Fixed command        |
| ENV         | Environment variable |
| ARG         | Build-time variable  |
| VOLUME      | Persistent storage   |

---

# 🚀 Simple Example (Nginx)

```dockerfile
FROM nginx:latest
COPY index.html /usr/share/nginx/html/
EXPOSE 80
```

Run:

```bash
docker build -t mynginx .
docker run -p 8080:80 mynginx
```

👉 Open: [http://localhost:8080](http://localhost:8080)

---

