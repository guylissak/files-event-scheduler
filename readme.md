Before running

- run npm install at the root of the project
- run redis-server at the root of the project
- create a local dir and set it in config.dev.json at folderPath, you can use the default (/tmp/vanti)
- in the config.dev.json file you may edit the customer ID list, the scheduler polling interval and max alert time. OPTIONAL.

Start the package

- run npm start

Package modules

- filesWatcher: handle the file events and update timestamp in redis
- scheduler: executes in interval according to the configuration file in /config and validate the status of each customer ID + log messages
- index.js - driver code, consumes both modules and run them as the main thread.
