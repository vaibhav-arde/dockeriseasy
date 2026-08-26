# Docker From Scratch: 2-Hour Complete Guide

## 2-Hour Hands-On Training Notes

> **Audience:** Developers, QA / Automation Engineers, DevOps Beginners, System Administrators
> **Goal:** Understand Docker from zero and use it to containerize applications (Node.js, Python, Web Apps), backend services, databases, and test automation suites reliably in local and CI/CD environments.

---

# 1. Learning Objectives

By the end of this session, students should be able to explain and practically use:

- Docker
- Docker Desktop
- Docker Engine
- Docker CLI
- Docker Hub
- Docker Registry
- Docker Image
- Docker Container
- Dockerfile
- `docker build`
- `docker run`
- `docker pull`
- `docker push`
- Ports
- Volumes / bind mounts
- Environment variables
- `.dockerignore`
- Docker Compose
- Application & Test Containerization (Node.js, Python, Web Apps, Playwright, etc.)
- Docker + GitHub Actions / CI/CD

The final mental model:

```text
Dockerfile
    |
    | docker build
    v
Docker Image
    |
    | docker run
    v
Docker Container
    |
    v
Application / Microservice / Test Suite
```

And for sharing:

```text
Developer
    |
    | docker push
    v
Docker Hub
    |
    | docker pull
    v
Another Machine / Staging / CI
```

---

# 2. 2-Hour Session Agenda

|         Time | Topic                                           | Type           |
| -----------: | ----------------------------------------------- | -------------- |
|    0–10 min | Why Docker?                                     | Concept        |
|   10–20 min | Docker Desktop & installation                   | Setup          |
|   20–30 min | Docker architecture                             | Concept        |
|   30–40 min | Docker Hub                                      | Concept + Demo |
|   40–50 min | First container with NGINX                      | Hands-on       |
|   50–60 min | Images, containers & commands                   | Hands-on       |
|   60–75 min | Dockerfile & first custom image                 | Hands-on       |
|   75–85 min | Docker Hub: tag, login, push, pull              | Hands-on       |
|  85–100 min | Application & Test Containerization             | Hands-on       |
| 100–110 min | Volumes, ports & environment variables          | Hands-on       |
| 110–117 min | Docker Compose                                  | Hands-on       |
| 117–120 min | CI/CD + recap                                   | Discussion     |

---

# 3. Why Do We Need Docker?

Start with a classic software engineering and QA problem:

> "It works on my machine."

Imagine the same web application or test framework executed across three environments:

```text
Developer A
Mac
Node 22 / Python 3.12
Local DB (PostgreSQL 15)
Specific dependencies

Developer B
Windows
Node 20 / Python 3.10
Local DB (PostgreSQL 14)
Different system packages

CI Server / Production
Linux
Node 18 / Python 3.9
Cloud DB / Containerized DB
System libraries & environment variables
```

The application or test suite can behave differently because of variations in:

- Programming runtime versions (Node.js, Python, Java, Go)
- Package dependencies (`package.json`, `requirements.txt`)
- Database drivers & native system libraries
- Browser engines & system dependencies (for UI automation)
- Operating system differences (Mac vs Windows vs Linux)
- Environment variables and configuration files
- Port bindings and network setup

Docker helps create a controlled, consistent, and reproducible runtime environment.

Without Docker:

```text
Code
  |
  v
Local Machine
  |
  v
"It works on my machine" (Fails in Staging/CI)
```

With Docker:

```text
Code
  |
  v
Docker Image
  |
  v
Docker Container
  |
  v
Controlled Environment (Identical Everywhere)
```

## Key takeaway

Docker is essential across the entire software delivery lifecycle:

- **For Developers:** Consistent local development environments matching production.
- **For QA / Automation Engineers:** Reliable, repeatable test execution without browser or dependency mismatches.
- **For DevOps & SysAdmins:** Seamless deployment, scalability, isolation, and simplified CI/CD pipelines.

---

# 4. Docker vs Virtual Machine

## Virtual Machine

```text
Physical Machine
|
+-- Host OS
|
+-- VM 1
|    +-- Guest OS (GBs)
|    +-- Application
|
+-- VM 2
     +-- Guest OS (GBs)
     +-- Application
```

Each VM contains a complete guest operating system, requiring high CPU, RAM, and disk overhead.

## Docker Container

```text
Physical Machine
|
+-- Host OS
|
+-- Docker Engine
     |
     +-- Container 1
     |    +-- Application
     |
     +-- Container 2
     |    +-- Application
     |
     +-- Container 3
          +-- Application
```

Containers are lightweight, isolated processes that share the host operating-system kernel.

### Simple analogy

- **Virtual Machine:** Separate house (has its own plumbing, electricity, and structural foundation).
- **Docker Container:** Separate apartment (has private living space, but shares the building's infrastructure).

A VM is generally heavier and takes minutes to boot. Containers start in milliseconds and use minimal memory.

---

# 5. What Is Docker Desktop?

## Definition

**Docker Desktop** is the easiest way for developers on Mac and Windows to install and run Docker locally.

It provides a local Docker environment bundled with:

- Docker Engine
- Docker CLI
- Docker Build (BuildKit)
- Docker Compose
- Docker Desktop GUI

Think of it as:

```text
Docker Desktop
|
+-- Docker Engine
+-- Docker CLI
+-- Docker Build
+-- Docker Compose
+-- GUI Dashboard
```

### Important distinction

Docker Desktop is **not the same thing as Docker Hub**.

```text
Docker Desktop
    |
    +-- Runs Docker locally
    +-- Manages local containers & images
    +-- Builds custom images
```

Docker Hub:

```text
Docker Hub
    |
    +-- Remote cloud image registry
    +-- Stores and distributes images
    +-- Shares images across teams & CI/CD
```

---

# 6. Installing Docker Desktop

## Mac

Official download link:
[https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

Official Mac installation documentation:
[https://docs.docker.com/desktop/setup/install/mac-install/](https://docs.docker.com/desktop/setup/install/mac-install/)

### Check your Mac architecture

Go to:

```text
Apple Menu -> About This Mac
```

Identify your processor type:
- **Apple Silicon:** M1, M2, M3, M4...
- **Intel Processor:** Intel Core i5/i7/i9...

Choose the corresponding installer (Apple Silicon vs Intel).

### Installation steps

1. Download Docker Desktop (`.dmg`).
2. Open the file and drag Docker into the **Applications** folder.
3. Launch Docker Desktop from Applications.
4. Accept the terms and wait until the status indicator reports that Docker is running.

---

# 7. Verify Docker Installation

Open your terminal.

## Check Docker CLI

```bash
docker --version
```

Output:

```text
Docker version 27.x.x, build ...
```

## Check Docker Compose

```bash
docker compose version
```

## Check Docker Engine

```bash
docker info
```

### Understanding the commands

```text
docker --version       -> Confirms Docker CLI client is installed
docker info            -> Confirms Docker Engine daemon is running and reachable
docker compose version -> Confirms Docker Compose plugin is available
```

If Docker Desktop is not running, commands requiring the engine daemon (like `docker info` or `docker run`) will return a connection error.

---

# 8. Docker Desktop GUI

Docker Desktop provides a graphical user interface to visualize and manage local Docker assets:

- **Containers:** View active, paused, and stopped containers, inspect real-time logs, open terminal sessions, and monitor memory/CPU usage.
- **Images:** See locally cached images, inspect layers, and purge unused images.
- **Volumes:** Inspect persistent storage volumes.
- **Builds:** Review build history and layer caching details.

Important concept:

> Docker Desktop GUI and Docker CLI control the exact same Docker environment.

Examples:

| Action | GUI Action | CLI Command |
| :--- | :--- | :--- |
| Start Container | Click "Run" on image | `docker run nginx` |
| Stop Container | Click "Stop" icon | `docker stop <container-id>` |
| Remove Container | Click trash icon | `docker rm <container-id>` |

Engineers should master CLI usage for scripting, automation, and CI/CD pipelines while using the GUI for quick visualization.

---

# 9. Docker Architecture

The core Docker architecture relies on a client-server model:

```text
Developer / User
    |
    v
Docker CLI (Client)
    |
    v (REST API / Socket)
Docker Engine (Daemon - dockerd)
    |
    +-------------------+-------------------+
    |                   |                   |
    v                   v                   v
Docker Images      Containers            Volumes
    |
    v
Docker Hub / Remote Registry
```

## Docker Client / CLI
The command line tool (`docker`) used to issue commands like `run`, `build`, `pull`, and `push`.

## Docker Engine (`dockerd`)
The background daemon process responsible for building images, executing containers, managing networking, and handling storage.

## Docker Image
An immutable, read-only template containing application code, runtimes, libraries, environment variables, and configuration files.

## Docker Container
A runnable, isolated process instance created from an image.

## Docker Registry
A hosted service storing container images for distribution (e.g., Docker Hub, GitHub Container Registry (GHCR), Amazon ECR, Azure ACR, Google Artifact Registry).

---

# 10. Docker Hub

## What is Docker Hub?

Docker Hub is the official public cloud registry for container images.

Analogous to GitHub:

```text
GitHub     -> Stores and shares source code repositories
Docker Hub -> Stores and shares pre-built container images
```

Website: [https://hub.docker.com/](https://hub.docker.com/)

Sign up for a free account: [https://hub.docker.com/signup](https://hub.docker.com/signup)

---

# 11. Docker Hub vs Docker Desktop

| Feature | Docker Desktop | Docker Hub |
| :--- | :--- | :--- |
| **Location** | Installed locally on workstation | Cloud-hosted remote registry |
| **Primary Role** | Runs Engine, builds images & runs containers | Stores, manages, and distributes images |
| **User Base** | Single developer / local machine | Teams, public community, CI/CD systems |
| **Artifacts** | Running processes & local image cache | Tagged repositories of immutable images |

Mental model:

```text
                 Docker Hub
              Remote Registry
                    ^
                    |
              docker push / pull
                    |
                    v
              Docker Desktop
              Local Machine
                    |
              +-----+-----+
              |           |
              v           v
            Image     Container
```

---

# 12. Docker Hub Repository

Suppose your Docker Hub username is `vaibhav123`.

A repository path looks like:

```text
vaibhav123/my-web-app
```

Repositories store multiple versions using **tags**:

```text
vaibhav123/my-web-app:latest
vaibhav123/my-web-app:1.0.0
vaibhav123/my-web-app:staging
```

### Image Naming Standard

```text
[registry_url/][username/]repository_name:tag
```

Examples:
- `nginx:latest` (Official library image on Docker Hub)
- `vaibhav123/api-service:1.2.0` (User image on Docker Hub)
- `ghcr.io/my-org/test-runner:v2` (GitHub Container Registry image)

---

# 13. First Docker Test

To verify your Docker setup, run the canonical hello-world image:

```bash
docker run hello-world
```

What happens under the hood?

1. Docker checks your local machine for the `hello-world:latest` image.
2. When not found locally, Docker pulls it automatically from Docker Hub.
3. Docker Engine creates a container from the image.
4. The container executes, outputs a confirmation message, and exits.

Output message:
```text
Hello from Docker!
This message shows that your installation appears to be working correctly...
```

---

# 14. Docker Images

A Docker image is an immutable template containing everything required to run an application.

Common official base images:
- Runtimes: `node`, `python`, `openjdk`, `golang`, `ruby`
- Operating Systems: `ubuntu`, `alpine`, `debian`
- Web Servers & Proxy: `nginx`, `httpd`, `caddy`
- Databases: `postgres`, `redis`, `mongo`, `mysql`
- Specialized & Test Runtimes: `mcr.microsoft.com/playwright`, `selenium/standalone-chrome`

One single image can spawn multiple isolated containers:

```text
             Node.js API Image
                     |
         +-----------+-----------+
         |           |           |
         v           v           v
     Container   Container   Container
      (Dev)       (Stage)     (Prod)
```

---

# 15. Docker Containers

A container is a live, isolated execution environment instantiated from an image.

Relationship:

```text
Image     = Class / Blueprint
Container = Object / Instance
```

Example:

```bash
docker run -d --name my-app-container nginx
```

This creates and starts an instance named `my-app-container` from the `nginx` image.

---

# 16. First Real Docker Example — NGINX

Pull the official NGINX image:

```bash
docker pull nginx
```

List local images:

```bash
docker images
```

Run NGINX container mapping host port 8080 to container port 80:

```bash
docker run -d -p 8080:80 --name my-web-server nginx
```

Verify in browser:
Open `http://localhost:8080` to see the "Welcome to nginx!" page.

---

# 17. Understand `docker run`

Command breakdown:

```bash
docker run -d -p 8080:80 --name my-web-server nginx
```

```text
docker run
    |
    +-- -d
    |     Detached mode (runs in background, releases terminal)
    |
    +-- -p 8080:80
    |     Port mapping (HOST_PORT:CONTAINER_PORT)
    |
    +-- --name my-web-server
    |     Assigns a custom readable container name
    |
    +-- nginx
          Image name to instantiate
```

---

# 18. Ports

Syntax:

```bash
-p HOST_PORT:CONTAINER_PORT
```

Example:

```bash
-p 8080:80
```

Network visualization:

```text
Host Machine (Your Mac / PC)
http://localhost:8080
         |
         | (Port Forwarding)
         v
Docker Container
Internal Port 80 (Web Server)
```

If you do not specify `-p`, the service running inside the container will not be accessible from your host machine's browser or API clients.

---

# 19. Essential Docker Commands

## System & Verification
```bash
docker --version
docker info
```

## Image Operations
```bash
docker pull <image>            # Download image from registry
docker images                  # List local images
docker rmi <image-id-or-name>  # Remove local image
docker history <image>         # Inspect image layers
```

## Container Lifecycle
```bash
docker run <image>             # Create and run container in foreground
docker run -d <image>          # Run container in background (detached)
docker run --rm <image>        # Run container and delete automatically on exit
docker ps                      # List running containers
docker ps -a                   # List all containers (running + stopped)
docker stop <container-id>     # Gracefully stop running container
docker start <container-id>    # Start stopped container
docker restart <container-id>  # Restart container
docker rm <container-id>       # Remove stopped container
docker rm -f <container-id>    # Force remove running container
```

## Logs & Shell Access
```bash
docker logs <container-id>        # Print container logs
docker logs -f <container-id>     # Follow live log stream
docker exec -it <container> bash  # Open interactive bash shell inside container
docker exec -it <container> sh    # Open fallback sh shell inside container
```

---

# 20. What Does `--rm` Mean?

Example:

```bash
docker run --rm node:22 node -e "console.log('One-off execution')"
```

`--rm` instructs Docker to:

> Automatically remove the container filesystem when it finishes execution.

Without `--rm`:

```text
Container runs -> Application exits -> Container enters "Exited" state -> Remains on disk
```
*(Accumulates clutter visible in `docker ps -a`)*

With `--rm`:

```text
Container runs -> Application exits -> Container is instantly destroyed
```

### Key Distinction

```text
--rm        -> Deletes the short-lived CONTAINER after exit
docker rmi  -> Deletes the cached Docker IMAGE from host
```

`--rm` is recommended for one-off tasks, CLI utilities, background data operations, and test automation runs.

---

# 21. Dockerfile

A **Dockerfile** is a text script containing sequential instructions used by Docker to build an image.

Mental model:

```text
Dockerfile       = Recipe / Source Code
Docker Image     = Compiled Binary / Package
Docker Container = Running Process
```

Example Dockerfile for a Node.js Application:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

---

# 22. Core Dockerfile Instructions

## `FROM`
Specifies the base image. Must be the first instruction.
```dockerfile
FROM node:22-alpine
```

## `WORKDIR`
Sets the working directory inside the container for subsequent instructions (`COPY`, `RUN`, `CMD`).
```dockerfile
WORKDIR /app
```
*(Creates `/app` if it does not exist, like `cd /app`)*

## `COPY`
Copies files or directories from host path (relative to build context) to container path.
```dockerfile
COPY package*.json ./
COPY . .
```

## `RUN`
Executes terminal commands **during image build time** to install packages or dependencies. Creates a new image layer.
```dockerfile
RUN npm ci
```

## `EXPOSE`
Documents the port on which the container application listens at runtime (informational metadata).
```dockerfile
EXPOSE 3000
```

## `ENV`
Sets environment variables inside the container image.
```dockerfile
ENV NODE_ENV=production
```

## `CMD`
Defines the default command executed **when a container starts**.
```dockerfile
CMD ["npm", "start"]
```

### Critical Distinction: `RUN` vs `CMD`

```text
RUN -> Executes ONCE during image BUILD time (e.g., compile code, install packages)
CMD -> Executes EVERY TIME a container STARTS (e.g., launch application server, run tests)
```

---

# 23. Build Your First Custom Image

Create a practice directory structure:

```text
docker-demo/
├── Dockerfile
└── app.js
```

`app.js`:
```javascript
const http = require('http');
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Docker Container!\n');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

`Dockerfile`:
```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY app.js .

EXPOSE 3000

CMD ["node", "app.js"]
```

Build image:
```bash
docker build -t my-node-app:1.0 .
```

Run container:
```bash
docker run -d -p 3000:3000 --rm --name my-running-app my-node-app:1.0
```

Test access:
Open `http://localhost:3000` or curl:
```bash
curl http://localhost:3000
```

---

# 24. Understand `docker build`

Command syntax:

```bash
docker build -t my-node-app:1.0 .
```

Breakdown:

```text
docker build
    |
    +-- -t my-node-app:1.0
    |     Tags the image with name "my-node-app" and version "1.0"
    |
    +-- .
          Build context directory (current working directory)
```

The build context specifies which local files are sent to the Docker Engine daemon to execute `COPY` instructions.

---

# 25. Docker Image Layers & Caching

Docker images are composed of stacked, read-only layers. Each instruction in a Dockerfile creates a layer.

Consider:

```dockerfile
FROM node:22-alpine       # Layer 1: Base OS + Node runtime
WORKDIR /app              # Layer 2: Metadata
COPY package*.json ./     # Layer 3: Package manifest
RUN npm ci                # Layer 4: Installed dependencies (Heavy layer)
COPY . .                  # Layer 5: Application source code
CMD ["node", "server.js"] # Layer 6: Default startup command
```

## Layer Caching Optimization

Docker reuses unchanged cached layers during re-builds.

### Recommended Pattern:
```dockerfile
COPY package*.json ./
RUN npm ci

COPY . .
```

If you edit `server.js` source code, Docker reuses cached Layer 1 through Layer 4 and only rebuilds Layer 5 & 6. This speeds up build times significantly.

### Bad Pattern:
```dockerfile
COPY . .
RUN npm ci
```
Every single source code edit invalidates the cache for `COPY . .`, forcing Docker to re-run `npm ci` from scratch every build.

---

# 26. `.dockerignore`

Create a `.dockerignore` file in the root of your project directory.

Example `.dockerignore`:

```text
node_modules
.venv
dist
build
.git
.github
*.log
test-results
playwright-report
coverage
.env
.DS_Store
```

### Why `.dockerignore` is critical:
- **Speeds up builds:** Excludes large directories (`node_modules`) from being transferred into the build context.
- **Prevents conflicts:** Ensures host-compiled binaries or local OS packages are not copied into container.
- **Security:** Prevents accidental inclusion of sensitive files like `.env`, SSH keys, or secrets into public images.

---

# 27. Docker Hub — Push Your Own Image

Assume your Docker Hub username is `vaibhav123`.

Local image: `my-node-app:1.0`

## Step 1: Log in to Docker Hub via CLI
```bash
docker login
```
*(Enter Docker Hub username and Personal Access Token or password)*

## Step 2: Tag the image with Docker Hub repository format
```bash
docker tag my-node-app:1.0 vaibhav123/my-node-app:1.0
```

Tag structure:
```text
vaibhav123 / my-node-app : 1.0
    |            |         |
 Username    Repository   Tag
```

## Step 3: Push image to Docker Hub
```bash
docker push vaibhav123/my-node-app:1.0
```

---

# 28. Pull Image on Another Machine

On any other machine (or server/CI environment) with Docker installed:

Pull the published image:
```bash
docker pull vaibhav123/my-node-app:1.0
```

Run directly without needing original source code:
```bash
docker run -d -p 3000:3000 --rm vaibhav123/my-node-app:1.0
```

Flow summary:

```text
Developer Machine
       |
       | docker push
       v
  Docker Hub
       |
       | docker pull
       v
Staging / Production Server / CI Pipeline
```

---

# 29. Application & Test Containerization

Docker containerization applies universally to:

1. **Backend APIs & Services:** Node.js, Python FastAPI/Flask, Java Spring, Go APIs.
2. **Frontend Web Applications:** React, Vue, Angular, Next.js, static NGINX bundles.
3. **Database & Cache Services:** PostgreSQL, MySQL, Redis, MongoDB.
4. **Test Automation Suites:** Playwright, PyTest, Cypress, Selenium grid nodes.

Containerizing tests ensures that test automation runs in an identical browser and runtime environment regardless of developer OS or CI runner specifications.

---

# 30. Choosing Official Base Images

Select base images aligned with your application or test requirements:

- **Node.js Web App:** `FROM node:22-alpine`
- **Python Backend:** `FROM python:3.12-slim`
- **Go Microservice:** `FROM golang:1.22-alpine`
- **Playwright Test Suite:** `FROM mcr.microsoft.com/playwright:v1.49.1-noble`

### Example A: Python Web API Dockerfile
```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Example B: Playwright Automation Dockerfile
```dockerfile
FROM mcr.microsoft.com/playwright:v1.49.1-noble

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npx", "playwright", "test"]
```

---

# 31. Build and Run Containerized Workloads

Build application image:
```bash
docker build -t my-api:1.0 .
```

Run application container:
```bash
docker run -d -p 8000:8000 --name api-service my-api:1.0
```

Build test suite image:
```bash
docker build -t test-suite:1.0 .
```

Run test suite container:
```bash
docker run --rm test-suite:1.0
```

---

# 32. Why Containerize Applications & Tests?

```text
WITHOUT DOCKER
Dev Machine (Node 22, macOS)  --->  CI Server (Node 18, Ubuntu)  ---> Production (Node 20, Debian)
  [Behavior Mismatches & Flaky Failures]

WITH DOCKER
Container (Node 22, Alpine)  --->  Container (Node 22, Alpine) ---> Container (Node 22, Alpine)
  [Guaranteed Identical Execution Everywhere]
```

Benefits:
- Eliminates dependency drift across development, QA, staging, and production environments.
- Simplifies onboarding—new engineers simply run `docker compose up` instead of manually configuring runtimes, drivers, and databases.
- Makes test automation headless, parallelizable, and easy to run in any cloud CI system.

---

# 33. Environment Variables in Docker

Pass environment variables dynamically using the `-e` flag:

```bash
docker run --rm \
  -e PORT=8000 \
  -e ENVIRONMENT=staging \
  -e DATABASE_URL="postgresql://user:pass@db:5432/mydb" \
  -e BASE_URL="https://staging.example.com" \
  my-api:1.0
```

Alternatively, pass an environment file using `--env-file`:

```bash
docker run --rm --env-file .env my-api:1.0
```

### Security Warning
> Never hardcode secrets, passwords, or API keys directly in a Dockerfile using `ENV MY_SECRET=xyz`. Use runtime environment flags (`-e`), environment files, or secret managers in CI/CD pipelines.

---

# 34. Volumes and Bind Mounts

Containers have ephemeral storage—when a container is removed, data inside its writable layer is lost.

To persist data or share files between host and container, use **Volumes** or **Bind Mounts**.

Syntax:
```bash
-v HOST_PATH:CONTAINER_PATH
```

## Scenario 1: Persistent Database Storage (Named Volume)
```bash
docker run -d \
  --name postgres-db \
  -v pgdata:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  postgres:16
```

## Scenario 2: Host File Sharing / Test Reports / Logs (Bind Mount)
```bash
docker run --rm \
  -v "$(pwd)/reports:/app/playwright-report" \
  -v "$(pwd)/logs:/app/logs" \
  test-suite:1.0
```

Visualization:

```text
Host System
$(pwd)/reports
     ^
     | (Bind Mount Synchronization)
     v
Container System
/app/playwright-report
```

Even after the test container completes and is removed (`--rm`), test reports and logs remain safely saved on the host filesystem.

---

# 35. What Is Docker Compose?

**Docker Compose** is a tool used to define and run multi-container applications using a single YAML configuration file (`compose.yaml` or `docker-compose.yml`).

Imagine an application architecture consisting of:

```text
  Web App / Frontend (Node/React)
             +
    Backend API (Python/Go)
             +
   Database (PostgreSQL)
             +
    Cache Service (Redis)
             +
  Automation Tests (Playwright)
```

Running each of these manually with individual `docker run` commands and managing network connections is cumbersome. Docker Compose orchestrates the entire system with one command: `docker compose up`.

---

# 36. Multi-Container Setup with Compose

Create `compose.yaml`:

```yaml
services:
  # Database Service
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: apppassword
      POSTGRES_DB: appdb
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

  # Backend Web API Service
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      PORT: 3000
      DATABASE_URL: postgresql://appuser:apppassword@db:5432/appdb
    depends_on:
      - db

  # Optional Test Runner Service
  tests:
    build:
      context: ./tests
      dockerfile: Dockerfile
    environment:
      BASE_URL: http://app:3000
    depends_on:
      - app

volumes:
  db_data:
```

---

# 37. Critical Concept: `localhost` inside Docker

A common mistake for beginners:

```text
BASE_URL=http://localhost:3000
```

inside a container attempting to talk to another container.

> `localhost` inside a container refers strictly to that specific container's loopback interface!

In Docker Compose, services are automatically assigned container domain names corresponding to their service key:

```text
Service Name in Compose -> "app"
Correct internal URL    -> http://app:3000

Service Name in Compose -> "db"
Correct internal URL    -> postgresql://appuser:pass@db:5432/appdb
```

Networking diagram:

```text
+-------------------------------------------------------+
| Docker Network (compose_default)                      |
|                                                       |
|   +------------------+         +------------------+   |
|   | Service: "tests" |         | Service: "app"   |   |
|   |                  | ------> |                  |   |
|   | http://app:3000  |         | Port 3000        |   |
|   +------------------+         +------------------+   |
|                                         |             |
|                                         v             |
|                                +------------------+   |
|                                | Service: "db"    |   |
|                                |                  |   |
|                                | db:5432          |   |
|                                +------------------+   |
+-------------------------------------------------------+
```

---

# 38. Essential Docker Compose Commands

## Start all services
```bash
docker compose up
```

## Start all services in detached (background) mode
```bash
docker compose up -d
```

## Force rebuild of image layers and start services
```bash
docker compose up --build
```

## Stop and remove all containers, networks, and volumes
```bash
docker compose down
```

## Remove containers along with persistent volumes
```bash
docker compose down -v
```

## List status of compose services
```bash
docker compose ps
```

## View aggregated service logs
```bash
docker compose logs
```

## Follow continuous service logs
```bash
docker compose logs -f app
```

## Execute command inside a compose service container
```bash
docker compose exec app sh
```

## Validate and render active Compose file syntax
```bash
docker compose config
```

---

# 39. Docker + CI/CD with GitHub Actions

Containerizing your workflow allows GitHub Actions (or GitLab CI, Jenkins, Azure DevOps) to execute builds and tests inside standard Docker containers.

Architecture flow:

```text
Git Push to main
       |
       v
GitHub Actions Workflow Triggered
       |
       v
Build Docker Image (`docker build`)
       |
       v
Run Containerized Services / Tests (`docker run` / `docker compose up`)
       |
       +---> Publish App Container to Docker Hub / Registry
       |
       +---> Generate & Upload Test Artifacts / Reports
```

Example GitHub Actions Workflow (`.github/workflows/ci.yml`):

```yaml
name: CI Build & Test Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build Application Image
        run: docker build -t my-app:${{ github.sha }} .

      - name: Run Tests in Docker
        run: |
          docker run --rm \
            -e NODE_ENV=test \
            my-app:${{ github.sha }} npm test
```

---

# 40. Complete General Docker Workflow

Visual lifecycle:

```text
1. Write Application / Test Code
               |
               v
2. Create Dockerfile & .dockerignore
               |
               v
3. Run `docker build` -> Produces Docker Image
               |
      +--------+--------+
      |                 |
      v                 v
4. `docker run`   5. `docker push`
   (Local Exec)     (Publish to Docker Hub)
                        |
                        v
                  6. `docker pull`
                     (Pull on Staging / Production / CI)
                        |
                        v
                  7. Run Container in CI/CD Pipeline
```

---

# 41. Complete Practical Hands-On Exercise

## Assignment Objective
Build, containerize, run, publish, and test a Node.js Web API or Playwright Test Suite using Docker.

## Project Structure
```text
my-docker-project/
├── Dockerfile
├── .dockerignore
├── compose.yaml
├── package.json
├── package-lock.json
└── server.js (or tests/)
```

## Step 1: Create `.dockerignore`
```text
node_modules
.git
.env
dist
coverage
reports
```

## Step 2: Create `Dockerfile`
```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

## Step 3: Build local image
```bash
docker build -t my-service:1.0 .
```

## Step 4: Run container locally with environment variables
```bash
docker run -d -p 3000:3000 --rm -e PORT=3000 --name running-service my-service:1.0
```

## Step 5: Test access
```bash
curl http://localhost:3000
```

## Step 6: Stop container
```bash
docker stop running-service
```

## Step 7: Tag & Push to Docker Hub
```bash
docker tag my-service:1.0 <your-dockerhub-username>/my-service:1.0
docker login
docker push <your-dockerhub-username>/my-service:1.0
```

## Step 8: Pull & Run on another environment
```bash
docker pull <your-dockerhub-username>/my-service:1.0
docker run -d -p 3000:3000 --rm <your-dockerhub-username>/my-service:1.0
```

---

# 42. Docker Core Concepts Comparison

| Concept | Definition / Analogy | Primary Action / Command |
| :--- | :--- | :--- |
| **Dockerfile** | Text recipe containing image instructions | Written by developer |
| **Image** | Immutable, packaged application template | `docker build`, `docker pull` |
| **Container** | Live, running process instance of an image | `docker run`, `docker stop` |
| **Docker Desktop** | Workstation GUI & local runtime environment | Installed application |
| **Docker Hub** | Cloud registry for storing/sharing images | `docker push`, `docker pull` |
| **Docker Engine** | Background daemon daemon (`dockerd`) managing containers | Runs silently |
| **Docker CLI** | Command line interface tool (`docker`) | Used in terminal |
| **Docker Compose** | Multi-container service orchestrator | `docker compose up` |

---

# 43. Important Commands Cheat Sheet

## Docker CLI
```bash
docker --version
docker info
```

## Image Commands
```bash
docker images
docker pull <image>
docker build -t <name>:<tag> .
docker rmi <image>
docker tag <source-image> <target-repo>:<tag>
docker push <username>/<repo>:<tag>
```

## Container Commands
```bash
docker run <image>
docker run -d <image>
docker run -d -p <host-port>:<container-port> <image>
docker run --rm <image>
docker run -e KEY=VALUE <image>
docker run -v <host-path>:<container-path> <image>
docker ps
docker ps -a
docker stop <container-id>
docker start <container-id>
docker rm <container-id>
docker logs <container-id>
docker logs -f <container-id>
docker exec -it <container-id> sh
```

## Docker Compose Commands
```bash
docker compose up
docker compose up -d
docker compose up --build
docker compose down
docker compose down -v
docker compose ps
docker compose logs -f
docker compose exec <service-name> sh
docker compose config
```

---

# 44. Questions to Ask Students

Use these review questions to reinforce concepts during training:

1. **Q: Is a Dockerfile an image?**
   *A: No. A Dockerfile is a text recipe used to build an image.*

2. **Q: Is an image a container?**
   *A: No. An image is an immutable template; a container is a running instance of an image.*

3. **Q: Can one image create multiple containers simultaneously?**
   *A: Yes. You can spin up dozens of identical containers from one image.*

4. **Q: What is the difference between `RUN` and `CMD` in a Dockerfile?**
   *A: `RUN` executes during image build time (installing packages). `CMD` defines the default command executed when a container starts at runtime.*

5. **Q: What does the `--rm` flag do in `docker run`?**
   *A: Automatically deletes the container from disk when it stops executing.*

6. **Q: What does `-p 8080:80` mean?**
   *A: Forwards traffic from Host Port 8080 to Container Port 80.*

7. **Q: Why is `.dockerignore` important?**
   *A: Excludes heavy or sensitive files (like `node_modules` or `.env`) from the build context, speeding up builds and securing secrets.*

8. **Q: What does `docker push` do?**
   *A: Uploads a tagged local image to a remote registry such as Docker Hub.*

9. **Q: What is the difference between Docker Desktop and Docker Hub?**
   *A: Docker Desktop runs Docker locally on your computer; Docker Hub is a cloud platform for sharing container images.*

10. **Q: Why is `http://localhost:3000` often wrong inside a container communicating with another service in Docker Compose?**
    *A: `localhost` inside a container refers to that container itself. In Docker Compose, services communicate using service names (e.g., `http://app:3000`).*

11. **Q: What are bind mounts (`-v`) used for?**
    *A: Mapping host directories to container paths to persist database files or share outputs like logs and test reports.*

12. **Q: How do containers differ from Virtual Machines?**
    *A: VMs include a heavy Guest OS; containers share the host kernel, making them lightweight and extremely fast to start.*

13. **Q: How does layer caching help during `docker build`?**
    *A: Docker reuses unchanged build layers (like installed dependencies), making subsequent image builds much faster.*

---

# 45. Final Whiteboard Diagram

Leave this diagram on screen for the wrap-up session:

```text
                         DOCKER SYSTEM
                               |
          +--------------------+--------------------+
          |                                         |
     Docker Desktop                             Docker Hub
     Local Workstation                        Cloud Registry
          |                                         ^
          |                                         |
          v                                 docker push / pull
     Docker Engine                                  |
          |                                         |
          +--------------+--------------------------+
                         |
                         v
                    Docker Image
                         ^
                         | docker build
                    Dockerfile
                         |
                         | docker run
                         v
                 Docker Container
                         |
                         +-------------------+
                         |                   |
                         v                   v
                    Application         Test Automation / CI
```

---

# 46. The Five Sentences Students Must Remember

If students remember only five key takeaways, teach them these:

> **1. Dockerfile is the recipe.**
> **2. Image is the packaged template.**
> **3. Container is the running instance of an image.**
> **4. Docker Hub stores and shares images.**
> **5. Docker Desktop lets us run and manage Docker locally.**

Primary workflow recap:

```text
Dockerfile  --->  docker build  --->  Image  --->  docker run  --->  Container
```

Sharing recap:

```text
Image  --->  docker push  --->  Docker Hub  --->  docker pull  ---> Staging / Production / CI
```

---

# 47. Official Resources

- Docker Desktop: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
- Docker Getting Started: [https://docs.docker.com/get-started/](https://docs.docker.com/get-started/)
- Dockerfile Reference: [https://docs.docker.com/reference/dockerfile/](https://docs.docker.com/reference/dockerfile/)
- Docker Compose Documentation: [https://docs.docker.com/compose/](https://docs.docker.com/compose/)
- Docker Hub: [https://hub.docker.com/](https://hub.docker.com/)
- Official Node Docker Guide: [https://docs.docker.com/language/nodejs/](https://docs.docker.com/language/nodejs/)
- Official Python Docker Guide: [https://docs.docker.com/language/python/](https://docs.docker.com/language/python/)
- Playwright Docker Documentation: [https://playwright.dev/docs/docker](https://playwright.dev/docs/docker)

---

# 48. Recommended Teaching Strategy

Use this step-by-step progressive teaching strategy for maximum student retention:

```text
1. SEE IT
   ↓
   docker run hello-world

2. USE IT
   ↓
   docker pull nginx
   docker run -d -p 8080:80 nginx

3. UNDERSTAND IT
   ↓
   Image vs Container vs VM

4. BUILD IT
   ↓
   Write Dockerfile
   docker build -t my-app .

5. SHARE IT
   ↓
   Docker Hub tag, login, push, pull

6. APPLY IT
   ↓
   Containerize Real Web App & Test Suite

7. ORCHESTRATE IT
   ↓
   Multi-container setup with Docker Compose (`compose.yaml`)

8. AUTOMATE IT
   ↓
   CI/CD execution via GitHub Actions
```

Every concept solves a real problem introduced in the previous step, making learning intuitive, practical, and memorable.
