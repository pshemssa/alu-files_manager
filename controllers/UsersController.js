const crypto = require('crypto');
const sha1 = require('sha1');
const dbClient = require('../utils/db');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Check for missing email
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    // Check for missing password
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      // Check if the user already exists
      const userExists = await dbClient.usersCollection.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash the password
      const hashedPassword = sha1(password);

      // Create the new user
      const result = await dbClient.usersCollection.insertOne({
        email,
        password: hashedPassword,
      });

      // Respond with the newly created user
      const newUser = {
        id: result.insertedId,
        email,
      };
      return res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = UsersController;
