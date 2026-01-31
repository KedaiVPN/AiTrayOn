module.exports = {
  apps : [{
    name: "ai-outfit-studio",
    script: "./server/index.js",
    watch: false,
    env: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
}
