const { getConfigurations } = require("./config");
const redis = require("async-redis");
const scheduler = require("./scheduler");
const filesWatcher = require("./filesWatcher");

const redisClient = redis.createClient();
exports.redisClient = redisClient;

redisClient.on("error", function (err) {
  console.log("Error " + err);
});

// Driver code
const configs = getConfigurations();
// Init files-watcher module
filesWatcher.init(redisClient, configs.customerIds, configs.folderPath);
// Register watcher events (add, updated)
filesWatcher.registerWatcherEvents();
// Start scheduler
scheduler.start(configs.customerIds, redisClient);
