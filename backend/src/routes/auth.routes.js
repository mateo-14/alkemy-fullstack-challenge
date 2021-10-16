const Router = require('express').Router;
const router = Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/', authMiddleware, authController.get);

module.exports = router;
