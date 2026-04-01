# ── Stage 1: Use official lightweight Node.js image ──────────────────────────
FROM node:18-alpine

# ── Maintainer label (good practice) ─────────────────────────────────────────
LABEL maintainer="dockeriseasy-learner"
LABEL description="Simple Express app to learn Docker fundamentals"

# ── Set working directory inside the container ────────────────────────────────
# All subsequent commands run inside /app
WORKDIR /app

# ── Copy dependency files FIRST (Docker layer cache optimisation) ─────────────
# Only these two files change when adding packages, so this layer is cached
# unless you run `npm install` again.
COPY package*.json ./

# ── Install production dependencies only ──────────────────────────────────────
RUN npm install --omit=dev

# ── Copy the rest of the application source code ─────────────────────────────
COPY . .

# ── Expose the port the app listens on ───────────────────────────────────────
# This is documentation only; you still need -p when running the container
EXPOSE 3000

# ── Health check: Docker will poll /health every 30 s ────────────────────────
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# ── Default command to start the app ─────────────────────────────────────────
# Use array form (exec form) – no shell wrapper, signals propagate correctly
CMD ["node", "app.js"]
