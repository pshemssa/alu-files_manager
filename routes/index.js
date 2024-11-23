
const express = require('express');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
import AuthController from '../controllers/AuthController';

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

router.post('/users', UsersController.postNew);
router.post("/users/me", UsersController.getMe);

router.post("/connect", AuthController.getConnect);
router.post("/disconnect", AuthController.getDisconnect);

module.exports = router;
