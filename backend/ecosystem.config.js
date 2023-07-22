const path = require('node:path');

function buildOptions(script, options) {
  return {
    cwd: __dirname,
    script: path.join(__dirname, 'src', script),
    node_args: '--trace-warnings --unhandled-rejections=strict',
    env: {
      ...(options.env || {}),
      NODE_ENV: 'production',
    },
    watch: false,
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    exec_mode:
      !options.instances || options.instances === 1 ? 'fork' : 'cluster',
    ...options,
  };
}

module.exports = {
  apps: [
    buildOptions('http.js', {
      name: 'events-app:http',
      instances: -1,
    }),
    // buildOptions('jobs.js', {
    //   name: 'events-app:jobs',
    //   instances: 1,
    // }),
  ],
};
