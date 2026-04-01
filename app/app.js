const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ────────────────────────────────────────────────────────────────────────────
// HOME ROUTE
// ────────────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🐳 Welcome to DockeriseEasy Learning App!',
    routes: {
      'GET  /':            'This home page',
      'GET  /info':        'Container & host system info',
      'GET  /dockerfile':  'Dockerfile reference for this app',
      'GET  /commands':    'Key Docker commands cheatsheet',
      'GET  /health':      'Health-check endpoint',
    },
  });
});

// ────────────────────────────────────────────────────────────────────────────
// SYSTEM INFO (great for seeing container isolation)
// ────────────────────────────────────────────────────────────────────────────
app.get('/info', (req, res) => {
  res.json({
    hostname:   os.hostname(),
    platform:   os.platform(),
    arch:       os.arch(),
    totalMemMB: Math.round(os.totalmem() / 1024 / 1024),
    freeMemMB:  Math.round(os.freemem()  / 1024 / 1024),
    cpus:       os.cpus().length,
    nodeVersion: process.version,
    env:        {
      NODE_ENV: process.env.NODE_ENV || 'development',
      PORT:     process.env.PORT     || 3000,
    },
  });
});

// ────────────────────────────────────────────────────────────────────────────
// DOCKERFILE REFERENCE
// ────────────────────────────────────────────────────────────────────────────
app.get('/dockerfile', (req, res) => {
  res.json({
    title: 'Dockerfile for this Express app',
    instructions: [
      { instruction: 'FROM',       value: 'node:18-alpine',                         explanation: 'Base image – slim Alpine-based Node 18'                     },
      { instruction: 'WORKDIR',    value: '/app',                                   explanation: 'Set working directory inside the container'                  },
      { instruction: 'COPY',       value: 'package*.json ./',                       explanation: 'Copy dependency manifests first (layer-cache optimisation)'  },
      { instruction: 'RUN',        value: 'npm install --production',               explanation: 'Install only production dependencies'                        },
      { instruction: 'COPY',       value: '. .',                                    explanation: 'Copy the rest of the source code'                            },
      { instruction: 'EXPOSE',     value: '3000',                                   explanation: 'Document the port the app listens on'                        },
      { instruction: 'CMD',        value: '["node", "app.js"]',                     explanation: 'Default command to start the application'                    },
    ],
  });
});

// ────────────────────────────────────────────────────────────────────────────
// DOCKER COMMANDS CHEATSHEET
// ────────────────────────────────────────────────────────────────────────────
app.get('/commands', (req, res) => {
  res.json({
    title: 'Essential Docker commands for this app',
    build: [
      { cmd: 'docker build -t dockeriseasy:v1 .', note: 'Build image, tag it dockeriseasy:v1' },
      { cmd: 'docker build -t dockeriseasy:v1 --no-cache .', note: 'Force a fresh build (ignore cache)' },
      { cmd: 'docker image ls', note: 'List all local images' },
    ],
    run: [
      { cmd: 'docker run -d -p 3000:3000 --name easy dockeriseasy:v1', note: 'Run container in background on port 3000' },
      { cmd: 'docker run --rm -p 3000:3000 dockeriseasy:v1',           note: 'Run & auto-remove when stopped'            },
      { cmd: 'docker run -e NODE_ENV=production -p 3000:3000 dockeriseasy:v1', note: 'Pass env variable'           },
    ],
    inspect: [
      { cmd: 'docker ps',                      note: 'List running containers'          },
      { cmd: 'docker logs easy',               note: 'View app logs'                    },
      { cmd: 'docker logs -f easy',            note: 'Stream logs live'                 },
      { cmd: 'docker exec -it easy sh',        note: 'Open shell inside container'      },
      { cmd: 'docker inspect easy',            note: 'Full JSON container details'      },
      { cmd: 'docker stats easy',              note: 'Live CPU / memory usage'          },
    ],
    cleanup: [
      { cmd: 'docker stop easy',               note: 'Stop container gracefully'        },
      { cmd: 'docker rm easy',                 note: 'Remove stopped container'         },
      { cmd: 'docker rmi dockeriseasy:v1',     note: 'Remove the image'                 },
      { cmd: 'docker system prune -a',         note: 'Remove ALL unused Docker objects' },
    ],
  });
});

// ────────────────────────────────────────────────────────────────────────────
// HEALTH CHECK (used by Docker HEALTHCHECK instruction)
// ────────────────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// ────────────────────────────────────────────────────────────────────────────
// START SERVER
// ────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🐳 DockeriseEasy app running on http://localhost:${PORT}`);
  console.log(`   Hostname: ${os.hostname()}`);
});
