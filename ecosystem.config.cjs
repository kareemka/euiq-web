module.exports = {
  apps: [{
    name: 'euiq-web',
    cwd: '/var/www/euiq-web',
    script: 'node_modules/next/dist/bin/next',
    args: 'start --hostname 127.0.0.1 --port 3000',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    max_memory_restart: '700M',
    restart_delay: 3000,
    min_uptime: '10s',
    max_restarts: 10,
    time: true,
    env: { NODE_ENV: 'production', PORT: '3000' },
  }],
};
