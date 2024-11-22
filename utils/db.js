const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';

    const uri = `mongodb://${host}:${port}/${database}`;
    this.client = new MongoClient(uri, { useUnifiedTopology: true });
    this.client.connect()
      .then(() => {
        this.db = this.client.db(database);
        this.usersCollection = this.db.collection('users');
        console.log('Connected to MongoDB');
      })
      .catch((err) => console.error('MongoDB connection error:', err));
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
