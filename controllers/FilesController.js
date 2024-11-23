import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import dbClient from '../utils/db';
import AuthUtils from '../utils/AuthUtils';

const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

class FilesController {
  static async postUpload(req, res) {
    try {
      // Retrieve and validate user based on token
      const token = req.headers['x-token'];
      const user = await AuthUtils.getUserFromToken(token);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });

      const { name, type, parentId = 0, isPublic = false, data } = req.body;

      // Validate required fields
      if (!name) return res.status(400).json({ error: 'Missing name' });
      if (!['folder', 'file', 'image'].includes(type)) {
        return res.status(400).json({ error: 'Missing type' });
      }
      if (type !== 'folder' && !data) {
        return res.status(400).json({ error: 'Missing data' });
      }

      // Validate parentId
      if (parentId !== 0) {
        const parentFile = await dbClient.collection('files').findOne({ _id: parentId });
        if (!parentFile) return res.status(400).json({ error: 'Parent not found' });
        if (parentFile.type !== 'folder') {
          return res.status(400).json({ error: 'Parent is not a folder' });
        }
      }

      // Ensure folder path exists
      if (!fs.existsSync(FOLDER_PATH)) fs.mkdirSync(FOLDER_PATH, { recursive: true });

      const fileDocument = {
        userId: user._id,
        name,
        type,
        isPublic,
        parentId,
      };

      // Handle files and images
      if (type !== 'folder') {
        const localPath = path.join(FOLDER_PATH, uuidv4());
        const fileData = Buffer.from(data, 'base64');
        fs.writeFileSync(localPath, fileData);
        fileDocument.localPath = localPath;
      }

      // Save file document to DB
      const result = await dbClient.collection('files').insertOne(fileDocument);
      fileDocument._id = result.insertedId;

      // Return the newly created file
      res.status(201).json(fileDocument);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default FilesController;
