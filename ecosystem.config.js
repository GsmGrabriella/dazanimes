
module.exports = { apps: [{ name: 'backend', script: 'npm', args: 'run dev', cwd: './backend'
    },
    { name: 'frontend', script: 'npm', args: 'run start', cwd: './frontend'
    }
  ]
};
