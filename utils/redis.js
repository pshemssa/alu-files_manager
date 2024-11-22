const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (err) => console.error('Redis error:', err));
    this.get = promisify(this.client.get).bind(this);
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return this.get(key);
  }
}

module.exports = new RedisClient();
