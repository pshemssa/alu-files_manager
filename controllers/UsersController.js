const crypto = require('crypto');
const { MongoClient } = require('mongodb');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Check for missing email or password
    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    try {
      // Connect to the database
      const client = new MongoClient('mongodb://localhost:27017');
      await client.connect();
      const db = client.db('file_manager');

      // Check if email already exists
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        await client.close();
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash the password
      const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

      // Insert the new user
      const result = await db.collection('users').insertOne({ email, password: hashedPassword });

      await client.close();

      // Return the created user
      return res.status(201).json({ id: result.insertedId, email });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = UsersController;
