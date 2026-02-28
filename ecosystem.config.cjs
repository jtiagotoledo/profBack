module.exports = {
  apps : [{
    name            : "profBack",
    script          : "server.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    },
    log_date_format : "YYYY-MM-DD HH:mm:ss",
    error_file      : "./logs/err.log",
    out_file        : "./logs/out.log",
    merge_logs      : true
  }]
};