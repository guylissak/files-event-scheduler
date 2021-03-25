const chokidar = require("chokidar");

let redisClient = null;
let customerIdsWhiteList = [];
let watcher = null;

// Extracts file name + file path from a given path
const extractFileNameFromPath = (path) => {
  return path.split("/").pop();
};

// Ensure the type of the file is .batch
const ensureValidFileType = (fileName) => {
  const fileType = fileName.split(".")[1];
  return fileType === "batch";
};

// Extract customer ID from a given file
const extractCustomerId = (fileName) => {
  return fileName.split(".")[0];
};

// Handles file event, validate against the customer ID's list and update timestamp in redis
const handleFileEvent = async (path) => {
  const fileName = extractFileNameFromPath(path);
  if (ensureValidFileType(fileName)) {
    const customerId = extractCustomerId(fileName);
    if (customerIdsWhiteList.includes(customerId)) {
      const timestamp = Date.now();
      await redisClient.set(customerId, timestamp);
    }
  }
};

// Init module pre-requisites, accept redis client, list of whitelisted customers and dir path
module.exports.init = (rClient, customerIds, folderPath) => {
  redisClient = rClient;
  customerIdsWhiteList = customerIds;
  folderPath = folderPath;
  // Add watcher
  watcher = chokidar.watch(folderPath, { ignoreInitial: true });
};

// Register watch events
module.exports.registerWatcherEvents = () => {
  // for cases where the file is updated
  watcher.on("change", async (path) => await handleFileEvent(path));
  // for cases where the file is created
  watcher.on("add", async (path) => await handleFileEvent(path));
};
