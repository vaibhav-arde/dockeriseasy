
# Docker Compose – Detailed Notes (Production-Oriented)

---

# What is Docker Compose?

**Docker Compose** is a tool used to define and run **multi-container applications** using a single YAML file (`docker-compose.yml`).

Instead of running multiple `docker run` commands, you define everything in one file and start all services together.

---

## Why Use Docker Compose?

- Manage multiple containers easily
- Define networks, volumes, and configs in one place
- Simplify local development and CI setups
- Start full system with one command

---

## Basic Structure of docker-compose.yml

```yaml
version: "3.9"

services:
  app:
    image: nginx
    ports:
      - "8080:80"
```

---

## Key Sections

* `services` → containers
* `networks` → communication
* `volumes` → persistent storage
* `build` → custom image creation

---

# Example Project Structure

```text
project/
├── app/
│   └── Dockerfile
├── docker-compose.yml
└── data/
```

---

# 1) Docker Compose Example (Complete)

```yaml
version: "3.9"

services:
  backend:
    image: node:20
    container_name: backend
    working_dir: /app
    volumes:
      - ./app:/app
    command: ["node", "server.js"]
    networks:
      - app-network

  db:
    image: postgres
    container_name: db
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - app-network

networks:
  app-network:

volumes:
  db-data:
```

---

# 2) Networking in Docker Compose

---

## Default Behavior

* Compose automatically creates a **default network**
* All services can communicate using **service names**

Example:

```yaml
services:
  backend:
  db:
```

Backend can call:

```text
http://db:5432
```

No need for IP.

---

## Custom Network in Compose

```yaml
networks:
  app-network:
```

Attach services:

```yaml
services:
  backend:
    networks:
      - app-network

  db:
    networks:
      - app-network
```

---

## Key Benefits

* automatic DNS resolution
* isolation between projects
* clean service communication

---

## Multiple Networks Example

```yaml
networks:
  frontend-net:
  backend-net:

services:
  frontend:
    networks:
      - frontend-net

  backend:
    networks:
      - frontend-net
      - backend-net

  db:
    networks:
      - backend-net
```

👉 frontend cannot directly talk to db

---

# 3) Volumes in Docker Compose

---

## Why Use Volumes?

* persist data
* store DB data
* store logs/reports

---

## Named Volume Example

```yaml
volumes:
  db-data:
```

Use in service:

```yaml
services:
  db:
    image: postgres
    volumes:
      - db-data:/var/lib/postgresql/data
```

---

## Bind Mount Example

```yaml
services:
  app:
    volumes:
      - ./app:/app
```

---

## Full Example with Both

```yaml
services:
  app:
    image: node:20
    volumes:
      - ./app:/app   # bind mount

  db:
    image: postgres
    volumes:
      - db-data:/var/lib/postgresql/data   # named volume

volumes:
  db-data:
```

---

## Key Difference

| Type         | Use Case    |
| ------------ | ----------- |
| Bind Mount   | development |
| Named Volume | production  |

---

# 4) Custom Build in Docker Compose

---

## Why Use `build`?

Instead of pulling image, you can **build your own Dockerfile**

---

## Basic Example

```yaml
services:
  app:
    build: .
```

This means:

* Dockerfile is in current folder

---

## With Custom Context

```yaml
services:
  app:
    build:
      context: ./app
      dockerfile: Dockerfile
```

---

## Example with Multi-Stage Dockerfile

```yaml
services:
  test-runner:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: test-runner
    networks:
      - test-network
```

---

## Pass Build Arguments

```yaml
services:
  app:
    build:
      context: .
      args:
        NODE_ENV: production
```

---

# Real-World Example (Automation Setup)

```yaml
version: "3.9"

services:
  tests:
    build:
      context: .
    container_name: playwright-tests
    volumes:
      - ./reports:/app/reports
    networks:
      - test-net
    depends_on:
      - backend

  backend:
    image: node:20
    container_name: backend
    networks:
      - test-net

networks:
  test-net:

volumes:
  reports:
```

---

## How It Works

* `tests` runs automation
* `backend` is system under test
* both are in same network → communicate via name
* reports stored on host

---

# Common Commands

## Start Services

```bash
docker compose up
```

## Run in Background

```bash
docker compose up -d
```

## Stop Services

```bash
docker compose down
```

## Rebuild

```bash
docker compose up --build
```

---

# Best Practices

* use service names instead of IPs
* use custom networks for isolation
* use named volumes for DBs
* use bind mounts for dev/test reports
* separate services (frontend, backend, tests)
* use `depends_on` for startup order

---

# Common Mistakes

❌ Hardcoding IP addresses
❌ Not using volumes → data loss
❌ Mixing dev and prod configs
❌ Not using build → less flexibility
❌ Not isolating networks

---

# Quick Interview Summary

* Docker Compose manages multi-container apps using YAML
* Networking:
  * automatic DNS via service names
  * supports custom networks
* Volumes:
  * bind mount (dev)
  * named volume (prod)
* Custom build:
  * build images using Dockerfile
  * supports args and context

---

```

```
