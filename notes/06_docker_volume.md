
# Docker Volumes – Quick Notes (Production-Oriented)

---

## What is a Docker Volume?

A **Docker volume** is a way to **store data outside the container**.

Normally, container data is **temporary**.  
If the container is deleted, the data inside it is also deleted.

Docker volumes help you:
- persist data
- share files between host and container
- avoid losing important files
- keep app data separate from container lifecycle

---

# Why Volumes Are Important

Without volumes:

- logs disappear
- database data is lost
- uploaded files are lost
- test reports/screenshots may disappear

With volumes:

- data remains even if container is removed
- you can reuse the same data with new containers

---

# Two Common Ways to Store Data in Docker

1. **Bind Mount (Mount)**
2. **Named Volume (Custom Volume)**

---

# 1) Bind Mount (Mount)

A **bind mount** maps a folder/file from your **host machine** directly into the container.

### Syntax

```bash id="rfd8ci"
-v /host/path:/container/path
```

or

```bash
--mount type=bind,source=/host/path,target=/container/path
```

---

## When to Use Bind Mount

Use bind mount when you want:

* live code changes
* local development
* to access files directly from your laptop/server
* to store reports/screenshots locally

---

## Example – Bind Mount

### Command

```bash
docker run -dit \
  --name my-nginx \
  -v $(pwd)/html:/usr/share/nginx/html \
  nginx
```

### What It Does

* `$(pwd)/html` → folder on your host machine
* `/usr/share/nginx/html` → folder inside container

So if you put `index.html` inside local `html/`, Nginx will serve it.

---

## Bind Mount Example for Automation

```bash
docker run --rm \
  -v $(pwd)/playwright-report:/app/playwright-report \
  playwright-tests
```

This is useful because:

* test reports are saved on your host
* container can be deleted safely

---

# 2) Named Volume (Custom Volume)

A **named volume** is managed by Docker itself.

Instead of giving a host folder path, you give a  **volume name** .

### Syntax

```bash
-v volume_name:/container/path
```

or

```bash
--mount type=volume,source=volume_name,target=/container/path
```

---

## When to Use Named Volume

Use named volume when you want:

* cleaner production storage
* Docker-managed persistent data
* databases
* reusable application storage

---

## Example – Named Volume

### Step 1: Create volume

```bash
docker volume create mydata
```

### Step 2: Use it in container

```bash
docker run -dit \
  --name my-container \
  -v mydata:/app/data \
  ubuntu
```

### What It Does

* Docker creates and manages `mydata`
* Data stored in `/app/data` remains even if container is removed

---

## Example Use Case

If you save a file inside the container:

```bash
docker exec -it my-container bash
echo "Hello Docker Volume" > /app/data/test.txt
```

Then even if you remove container:

```bash
docker rm -f my-container
```

The file still exists in the volume.

---

# Difference: Bind Mount vs Named Volume

| Feature                           | Bind Mount      | Named Volume |
| --------------------------------- | --------------- | ------------ |
| Managed by                        | You (host path) | Docker       |
| Best for                          | Development     | Production   |
| Easy local access                 | Yes             | Not directly |
| Good for DB / persistent app data | Sometimes       | Yes          |
| Host dependency                   | High            | Low          |

---

# Commands for Bind Mount

## Run with Bind Mount

```bash
docker run -v /host/path:/container/path image-name
```

## Example

```bash
docker run -dit \
  --name web1 \
  -v $(pwd)/site:/usr/share/nginx/html \
  nginx
```

---

# Commands for Named Volume

## Create Volume

```bash
docker volume create myvolume
```

## List Volumes

```bash
docker volume ls
```

## Inspect Volume

```bash
docker volume inspect myvolume
```

## Remove Volume

```bash
docker volume rm myvolume
```

## Run Container with Volume

```bash
docker run -dit \
  --name app1 \
  -v myvolume:/app/data \
  ubuntu
```

---

# How to See Mounted Volumes

```bash
docker inspect container_name
```

Look for:

```json
"Mounts": [...]
```

This shows:

* source
* destination
* mount type

---

# Real-World Example for Test Automation

Suppose your Playwright or Pytest framework generates:

* screenshots
* videos
* traces
* HTML reports

### Bind Mount Example

```bash
docker run --rm \
  -v $(pwd)/reports:/app/reports \
  -v $(pwd)/screenshots:/app/screenshots \
  test-framework
```

This is best for:

* local execution
* CI artifact collection

---

### Named Volume Example

```bash
docker volume create test-results

docker run --rm \
  -v test-results:/app/reports \
  test-framework
```

This is better for:

* Docker-managed persistence
* cleaner production setups

---

# Best Practices

* Use **bind mount** for development
* Use **named volume** for production
* Never store important data only inside container
* Use volumes for:
  * DBs
  * reports
  * logs
  * uploads
  * test artifacts

---

# Common Mistakes

❌ Storing important files only inside container
❌ Confusing bind mount with named volume
❌ Forgetting volume persists after container deletion
❌ Using bind mounts carelessly in production

---

# Quick Interview Summary

* Docker volume stores data outside the container
* Two common types:
  * **Bind Mount** → host folder mapped into container
  * **Named Volume** → Docker-managed persistent storage
* Use bind mount for development
* Use named volume for production
* Volumes prevent data loss when containers are removed

---

```

```
