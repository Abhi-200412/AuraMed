#!/usr/bin/env node

/**
 * Development Server Startup Script
 * Starts the Next.js development server and the Python MONAI service
 */

const { spawn, execSync } = require('child_process');
const path = require('path');

console.log('Starting AuraMed development environment...');

// --- AUTO-CLEANUP: Kill Stale Processes on Ports 3000 & 8000 ---
if (process.platform === 'win32') {
  try {
    console.log('Cleaning up ports 3000 & 8000...');
    // PowerShell command to find processes on ports 3000/8000 and kill them
    execSync('powershell -Command "Get-NetTCPConnection -LocalPort 8000,3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | Sort-Object -Unique | ForEach-Object { Stop-Process -Id $_ -Force }"', { stdio: 'ignore' });
  } catch (e) {
    // Ignore errors (no processes found)
  }
}
// -------------------------------------------------------------

// Start Python MONAI Service
console.log('Starting MONAI AI Service (Python)...');

// Use the virtual environment python executable
const pythonCmd = process.platform === 'win32'
  ? '.venv_311\\Scripts\\python.exe'
  : '.venv_311/bin/python';

const pythonService = spawn(pythonCmd, ['src/services/monai/app.py'], {
  stdio: 'inherit',
  shell: true
});

// Start Next.js development server
console.log('Starting Next.js development server...');
const nextServer = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// Handle graceful shutdown
function shutdown() {
  console.log('Shutting down development environment...');

  if (nextServer) {
    try {
      nextServer.kill();
    } catch (e) {
      console.error('Error stopping Next.js server:', e);
    }
  }

  if (pythonService) {
    console.log('Stopping MONAI Service...');
    try {
      pythonService.kill();
    } catch (e) {
      console.error('Error stopping Python service:', e);
    }
  }

  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log('AuraMed development environment started successfully!');
console.log('Next.js server running on http://localhost:3000');
console.log('MONAI Service running on http://localhost:8000');