const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (err) => console.error(`Redis error: ${err}`));
  }

  isAlive() {
    return this.client.connected;
  }
}

module.exports = new RedisClient();
