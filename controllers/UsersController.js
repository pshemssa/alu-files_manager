const sha1 = require('sha1');
const Queue = require('bull');
const dbClient = require('../utils/db');

const userQueue = new Queue('userQueue');

class UsersController {
  // static async postNew(req, res) {
  //   const { email, password } = req.body;

  //   // Check for missing email
  //   if (!email) {
  //     return res.status(400).json({ error: 'Missing email' });
  //   }

  //   // Check for missing password
  //   if (!password) {
  //     return res.status(400).json({ error: 'Missing password' });
  //   }

  //   try {
  //     // Check if the user already exists
  //     const userExists = await dbClient.usersCollection.findOne({ email });
  //     if (userExists) {
  //       return res.status(400).json({ error: 'Already exist' });
  //     }

  //     // Hash the password
  //     const hashedPassword = sha1(password);

  //     // Create the new user
  //     const result = await dbClient.usersCollection.insertOne({
  //       email,
  //       password: hashedPassword,
  //     });

  //     // Respond with the newly created user
  //     const newUser = {
  //       id: result.insertedId,
  //       email,
  //     };
  //     return res.status(201).json(newUser);
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // }

  static async postNew(request, response) {
    const { email, password } = request.body;

    if (!email) return response.status(400).send({ error: 'Missing email' });

    if (!password) { return response.status(400).send({ error: 'Missing password' }); }

    const emailExists = await dbClient.usersCollection.findOne({ email });

    if (emailExists) { return response.status(400).send({ error: 'Already exist' }); }

    const sha1Password = sha1(password);

    let result;
    try {
      result = await dbClient.usersCollection.insertOne({
        email,
        password: sha1Password,
      });
    } catch (err) {
      await userQueue.add({});
      return response.status(500).send({ error: 'Error creating user.' });
    }

    const user = {
      id: result.insertedId,
      email,
    };

    await userQueue.add({
      userId: result.insertedId.toString(),
    });

    return response.status(201).send(user);
  }
}

module.exports = UsersController;
