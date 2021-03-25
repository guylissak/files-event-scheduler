const nconf = require("nconf");
const path = require("path");

// Read Configurations
const configs = new nconf.Provider()
  .env({ lowerCase: true, separator: "." })
  .file({ file: path.join(__dirname, `./config.dev.json`) });

module.exports.getConfigurations = () => {
  const config = {
    customerIds: configs.get("customer_ids"),
    folderPath: configs.get("folder_path"),
    interval: configs.get("interval"),
    alertTime: configs.get("alert_time"),
  };

  return config;
};
