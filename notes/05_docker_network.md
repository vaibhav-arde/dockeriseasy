
# Docker Networking – Quick Notes (Production-Oriented)

---

## What is a Network in Docker?

A **Docker network** allows containers to communicate with:
- other containers
- the host machine
- external systems (internet, APIs, DBs)

It provides:
- **IP addressing**
- **DNS-based service discovery**
- **isolation between environments**

Think of it as a **virtual network layer** created by Docker.

---

## Types of Networks in Docker

---

## 1) Bridge Network (Default)

- Default network created by Docker (`bridge`)
- Containers get:
  - private IP
  - internal DNS (if custom bridge)

### Key Points:
- Containers can talk using **IP**
- Default bridge → no automatic name resolution
- **Custom bridge → supports container name DNS**

---

## 2) Host Network

```bash
docker run --network host nginx
```

### Behavior:

* Container shares host’s network
* No separate IP
* Runs directly on host ports

### Use Case:

* performance-sensitive apps
* low latency requirements

### Risk:

* no isolation → less secure

---

## 3) None Network

```bash
docker run --network none ubuntu
```

### Behavior:

* No network access at all
* No internet
* No communication with other containers

### Use Case:

* high security
* batch processing jobs

---

## 4) Custom Network (Recommended)

```bash
docker network create my-network
```

### Benefits:

* automatic DNS (use container names)
* better isolation
* production-ready setup

---

## How to Create a Network

```bash
docker network create my-network
```

---

## How to Run Container in a Network

```bash
docker run -d --name app1 --network my-network nginx
docker run -d --name app2 --network my-network ubuntu sleep 1000
```

---

## How to Connect a Container to a Network

```bash
docker network connect my-network app1
```

---

## How to Disconnect a Container from a Network

```bash
docker network disconnect my-network app1
```

---

## How Containers Communicate (Important)

In a  **custom bridge network** , containers can communicate using:

```bash
ping app1
```

No need for IP → Docker provides **internal DNS**

---

## How to Ping Containers (Same Network)

### Step 1: Create network

```bash
docker network create test-net
```

### Step 2: Run containers

```bash
docker run -dit --name c1 --network test-net ubuntu
docker run -dit --name c2 --network test-net ubuntu
```

### Step 3: Exec into container

```bash
docker exec -it c1 bash
```

### Step 4: Ping

```bash
apt update && apt install -y iputils-ping
ping c2
```

✅ Works because both are in same network

---

## How to Ping Containers (Different Networks)

### Setup:

```bash
docker network create net1
docker network create net2

docker run -dit --name c1 --network net1 ubuntu
docker run -dit --name c2 --network net2 ubuntu
```

### Try ping:

```bash
ping c2
```

❌ Will NOT work (network isolation)

---

## How to Fix (Connect to Same Network)

```bash
docker network connect net1 c2
```

Now from `c1`:

```bash
ping c2
```

✅ Works

---

## Key Concept

> Containers must share at least one common network to communicate.

---

## How to Inspect a Network

```bash
docker network inspect my-network
```

### Output Includes:

* network ID
* subnet
* gateway
* connected containers
* container IP addresses

---

## How to List Networks

```bash
docker network ls
```

---

## How to Remove Network

```bash
docker network rm my-network
```

---

## Real-World Example (Automation Setup)

For a test automation setup:

* `frontend` container (Playwright)
* `backend` container (API)
* `db` container (Postgres)

All should be in same network:

```bash
docker network create automation-net

docker run -d --name backend --network automation-net backend-image
docker run -d --name db --network automation-net postgres
docker run -d --name tests --network automation-net playwright-image
```

Now tests can call:

```
http://backend:3000
http://db:5432
```

No IP needed → use service names

---

## Best Practices

* Always use **custom networks** in production
* Avoid default `bridge`
* Avoid `host` unless required
* Use container names instead of IPs
* Keep services isolated by network
* Connect only required containers

---

## Common Mistakes

❌ Using IP instead of container name
❌ Using default bridge for production
❌ Not understanding network isolation
❌ Forgetting to connect containers to same network

---

## Quick Interview Summary

* Docker network allows container communication
* Types:
  * bridge (default)
  * host (no isolation)
  * none (no network)
  * custom (recommended)
* Containers communicate using names in custom networks
* Use `docker network connect` to join networks
* Use `docker network inspect` to debug

---

```

```
