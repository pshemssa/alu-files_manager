const crypto = require('crypto');
const dbClient = require('../utils/db');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if the email already exists in the database
    const userCollection = dbClient.db.collection('users');
    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password using SHA1
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    // Insert new user into the database
    const newUser = { email, password: hashedPassword };
    const result = await userCollection.insertOne(newUser);

    // Return the new user's ID and email
    return res.status(201).json({ id: result.insertedId, email });
  }
}

module.exports = UsersController;
