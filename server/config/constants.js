const defaultConfig = {
  PORT: process.env.PORT || 8000
};

function getEnv(env) {
  if (env === "development") {
    return require("./dev-constants")[env];
  }

  if (env === "production") {
    return require("./prod-constants")[env];
  }
  return defaultConfig;
}

export default {
  ...defaultConfig,
  ...getEnv(process.env.NODE_ENV)
};
