const fs = require("fs");
const path = require("path");

function readEnv(filePath) {
  const absolutePath = path.resolve(__dirname, filePath);
  if (!fs.existsSync(absolutePath)) {
    console.log(`⚠ ${filePath} not found, using default environment variables.`);
    return {};
  }
  const content = fs.readFileSync(absolutePath, "utf8");
  const env = {};
  content.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) return;

    const equalIndex = trimmedLine.indexOf("=");
    if (equalIndex === -1) return;

    const key = trimmedLine.substring(0, equalIndex).trim();
    let value = trimmedLine.substring(equalIndex + 1).trim();

    // Remove surrounding quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.substring(1, value.length - 1);
    }
    env[key] = value;
  });
  return env;
}

const localEnv = readEnv(".env.local");

module.exports = {
  apps: [
    {
      name: "mrilseven",
      script: ".next/standalone/server.js",
      cwd: "./",
      instances: "max", // Use all available CPU cores
      exec_mode: "cluster", // Enable cluster mode for load balancing
      autorestart: true,
      watch: false, // Don't watch files in production
      max_memory_restart: "1G", // Restart if memory exceeds 1GB
      env: {
        NODE_ENV: "production",
        PORT: 3030,
        HOSTNAME: "0.0.0.0",
        ...localEnv,
      },
      env_staging: {
        NODE_ENV: "staging",
        PORT: 3031,
        HOSTNAME: "0.0.0.0",
        ...localEnv,
      },
      // Logging
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      merge_logs: true,
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 10000,
      // Restart strategies
      exp_backoff_restart_delay: 100, // Exponential backoff on restart
      max_restarts: 10, // Max restarts within min_uptime window
      min_uptime: "10s", // Min uptime to consider app started
    },
  ],
};

