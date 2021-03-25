const { getConfigurations } = require("../config");

const INTERVAL = getConfigurations().interval;
const ALERT_TIME = getConfigurations().alertTime;

// An object that hold the current feed alert state
/*
{
    <customerId_X>: alert[boolean],
    <customerId_X>: alert[boolean]
    ...
}
*/
let feedAlertState = {};

const generateFeedState = (customerIds) => {
  customerIds.forEach((customerId) => {
    feedAlertState[customerId] = false;
  });
};

module.exports.start = (customerIds, redisClient) => {
  // Dynamically init alert feed state object before scheduler start
  generateFeedState(customerIds);

  setInterval(async () => {
    for (customerId of customerIds) {
      const currTimestamp = Date.now();
      const timestampFromDb = await redisClient.get(customerId);
      if (timestampFromDb && currTimestamp - timestampFromDb > ALERT_TIME) {
        // Alert is on and more than ALERT_TIME has passed since last feed, hence log a warning message and set alert state to true
        if (feedAlertState[customerId] === false) {
          console.log(`Warning - No feedback has been received from ${customerId} for over 1 minute`);
        }
        feedAlertState[customerId] = true;
      } else if (feedAlertState[customerId] === true) {
        // Feed has found, prev state of alert is on, hence disable alert and log a back to normal message
        console.log(`customer ${customerId} is back to normal!`);
        feedAlertState[customerId] = false;
      }
    }
  }, INTERVAL);
};
