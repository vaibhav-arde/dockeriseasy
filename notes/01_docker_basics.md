
# Docker Notes

## What is Docker

Docker is a platform used to **develop, ship, and run applications in containers**.

- A container is a lightweight, portable unit that includes:
  - Application code
  - Dependencies
  - Libraries
  - Runtime

👉 Key Idea: *"It works on my machine" → Works everywhere with Docker*

---

## Virtualization vs Dockerization

### Virtualization (VMs)
- Uses Hypervisor
- Each VM has its own OS
- Heavyweight
- Slower startup
- More resource usage

### Dockerization (Containers)
- Uses host OS kernel
- No separate OS required
- Lightweight
- Fast startup
- Efficient resource usage

| Feature        | Virtual Machine | Docker Container |
|---------------|----------------|------------------|
| OS            | Separate OS    | Shared OS        |
| Size          | Large (GBs)    | Small (MBs)      |
| Boot Time     | Minutes        | Seconds          |
| Performance   | Slower         | Faster           |

---

## Docker Components

- **Docker Engine** → Core service that runs containers
- **Docker Image** → Blueprint/template for container
- **Docker Container** → Running instance of image
- **Dockerfile** → Script to create images
- **Docker Hub** → Public registry for images

---

## Difference: Image vs Container

### Docker Image
- Read-only template
- Used to create containers
- Example: Ubuntu image

### Docker Container
- Running instance of image
- Can be started, stopped, deleted

👉 Analogy:
- Image = Class
- Container = Object

---

## Docker Engine

Docker Engine is the core system that:
- Builds images
- Runs containers
- Manages resources

---

## Basic Docker Commands

### Run a Container
```bash
docker run nginx
````

* Downloads image if not present
* Starts container

---

### List Running Containers

```bash
docker ps
```

---

### List All Containers (including stopped)

```bash
docker ps -a
docker ps --all
docker container ps -a
```

---

### List Images

```bash
docker images
```

---

### Docker Info

```bash
docker info
```

* Shows system-wide information about Docker

---

### Docker Version

```bash
docker --version
```

---

### Stop a Container

```bash
docker stop <container_id>
```

---

### Remove a Container

```bash
docker rm <container_id>
```

---

### Remove an Image

```bash
docker rmi <image_id>
```

---

## Useful Tips

* Use `docker run -d` → Run in background
* Use `docker run -it` → Interactive mode
* Use `docker logs <container_id>` → View logs

---
---


# Images

## Docker Image Commands Explained (with Examples)

---

### 1. List Images

### Command
```bash
docker image ls
````

### Description

* Lists all Docker images available on your system

### Example

```bash
docker image ls
```

### Output Example

```bash
REPOSITORY   TAG       IMAGE ID       SIZE
nginx        latest    abc123         142MB
ubuntu       20.04     xyz456         72MB
```

---

## 2. Prune Images

### Command

```bash
docker image prune
```

### Description

* Removes **unused (dangling) images**
* Helps free disk space

### Example

```bash
docker image prune
```

👉 Remove all unused images:

```bash
docker image prune -a
```

---

## 3. Pull Image

### Command

```bash
docker image pull <image_name>
```

### Description

* Downloads an image from Docker Hub or registry

### Example

```bash
docker image pull nginx
docker image pull ubuntu:20.04
```

---

## 4. Push Image

### Command

```bash
docker image push <image_name>
```

### Description

* Uploads your image to Docker Hub (or registry)

### Example

```bash
docker image push myusername/myapp:v1
```

👉 Note:

* You must login first:

```bash
docker login
```

---

## 5. Remove Image

### Command

```bash
docker image rm <image_name_or_id>
```

### Description

* Deletes one or more images from your system

### Example

```bash
docker image rm nginx
docker image rm abc123
```

👉 Remove multiple images:

```bash
docker image rm nginx ubuntu
```

---

## 6. Save Image (Export)

### Command

```bash
docker image save -o <file_name>.tar <image_name>
```

### Description

* Saves image as a `.tar` file
* Useful for backup or transfer

### Example

```bash
docker image save -o nginx.tar nginx
```

👉 Without `-o` (outputs to STDOUT):

```bash
docker image save nginx > nginx.tar
```

---

## 7. Tag Image

### Command

```bash
docker image tag <source_image> <target_image>
```

### Description

* Creates a new tag (alias) for an image
* Required before pushing to Docker Hub

### Example

```bash
docker image tag nginx myusername/nginx:v1
```

👉 Now you can push:

```bash
docker image push myusername/nginx:v1
```

---

## Quick Summary

| Command            | Purpose              |
| ------------------ | -------------------- |
| docker image ls    | List images          |
| docker image prune | Remove unused images |
| docker image pull  | Download image       |
| docker image push  | Upload image         |
| docker image rm    | Delete image         |
| docker image save  | Export image         |
| docker image tag   | Rename/tag image     |

---

## Real Flow Example (Important 🚀)

```bash
# Step 1: Pull image
docker image pull nginx

# Step 2: Tag image
docker image tag nginx myusername/nginx:v1

# Step 3: Push image
docker image push myusername/nginx:v1

# Step 4: Save image
docker image save -o nginx.tar nginx

# Step 5: Remove image
docker image rm nginx

# Step 6: Load back later
docker load -i nginx.tar
```

---
---

# Docker Container Commands (Complete Guide)


## What is a Container

A container is a **running instance of a Docker image**.

👉 Example:
- Image = `nginx`
- Container = Running web server from nginx image

---

# 🔹 Container Lifecycle Commands

---

## 1. Create a Container

### Command
```bash
docker container create <image_name>
````

### Description

* Creates a container but does NOT start it

### Example

```bash
docker container create nginx
```

---

## 2. Run a Container

### Command

```bash
docker container run <image_name>
```

### Description

* Creates + Starts container

### Example

```bash
docker container run nginx
```

👉 Run in background:

```bash
docker container run -d nginx
```

👉 Run with name:

```bash
docker container run -d --name mynginx nginx
```

👉 Run with port mapping:

```bash
docker container run -d -p 8080:80 nginx
```

---

## 3. Start a Container

### Command

```bash
docker container start <container_id>
```

### Description

* Starts an existing stopped container

### Example

```bash
docker container start mynginx
```

---

## 4. Stop a Container

### Command

```bash
docker container stop <container_id>
```

### Description

* Stops a running container

### Example

```bash
docker container stop mynginx
```

---

## 5. Restart a Container

### Command

```bash
docker container restart <container_id>
```

### Description

* Stops and starts container again

### Example

```bash
docker container restart mynginx
```

---

## 6. Pause / Unpause Container

### Pause

```bash
docker container pause <container_id>
```

### Unpause

```bash
docker container unpause <container_id>
```

### Description

* Freezes / resumes container processes

### Example

```bash
docker container pause mynginx
docker container unpause mynginx
```

---

## 7. Kill a Container

### Command

```bash
docker container kill <container_id>
```

### Description

* Force stops container immediately

### Example

```bash
docker container kill mynginx
```

---

# 🔹 Inspection & Monitoring

---

## 8. List Running Containers

```bash
docker container ls
```

---

## 9. List All Containers

```bash
docker container ls -a
```

---

## 10. Inspect Container

```bash
docker container inspect <container_id>
```

### Description

* Detailed JSON info

### Example

```bash
docker container inspect mynginx
```

---

## 11. View Logs

```bash
docker container logs <container_id>
```

### Example

```bash
docker container logs mynginx
```

👉 Follow logs (live):

```bash
docker container logs -f mynginx
```

---

## 12. View Resource Usage

```bash
docker container stats
```

### Description

* Shows CPU, memory usage

---

## 13. Top Command (Processes inside container)

```bash
docker container top <container_id>
```

---

# 🔹 Interaction Commands

---

## 14. Execute Command Inside Container

```bash
docker container exec -it <container_id> <command>
```

### Example

```bash
docker container exec -it mynginx bash
```

---

## 15. Attach to Container

```bash
docker container attach <container_id>
```

### Description

* Connect to running container terminal

---

# 🔹 File & Data Operations

---

## 16. Copy Files

### Copy from host to container

```bash
docker container cp file.txt mynginx:/file.txt
```

### Copy from container to host

```bash
docker container cp mynginx:/file.txt .
```

---

# 🔹 Cleanup Commands

---

## 17. Remove Container

```bash
docker container rm <container_id>
```

### Example

```bash
docker container rm mynginx
```

👉 Remove multiple:

```bash
docker container rm c1 c2 c3
```

👉 Force remove:

```bash
docker container rm -f mynginx
```

---

## 18. Remove All Stopped Containers

```bash
docker container prune
```

---

# 🔹 Advanced Commands

---

## 19. Rename Container

```bash
docker container rename old_name new_name
```

---

## 20. Update Container Resources

```bash
docker container update --memory 500m mynginx
```

---

## 21. Export Container

```bash
docker container export mynginx > mynginx.tar
```

---

## 22. Commit Container to Image

```bash
docker container commit mynginx myimage:v1
```

---

# 🔹 Quick Summary Table

| Command | Purpose                    |
| ------- | -------------------------- |
| run     | Create + start container   |
| start   | Start stopped container    |
| stop    | Stop container             |
| restart | Restart container          |
| kill    | Force stop                 |
| ls      | List containers            |
| logs    | View logs                  |
| exec    | Run command inside         |
| cp      | Copy files                 |
| rm      | Remove container           |
| prune   | Cleanup stopped containers |

---

# 🚀 Real Workflow Example

```bash
# Run container
docker container run -d --name mynginx -p 8080:80 nginx

# Check running containers
docker container ls

# View logs
docker container logs mynginx

# Enter container
docker container exec -it mynginx bash

# Stop container
docker container stop mynginx

# Remove container
docker container rm mynginx
```

---









