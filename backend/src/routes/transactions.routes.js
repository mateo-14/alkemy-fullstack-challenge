const Router = require('express').Router;
const router = Router();
const transactionsController = require('../controllers/transactions.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, transactionsController.get);
router.post('/', authMiddleware, transactionsController.create);
router.patch('/:id', authMiddleware, transactionsController.update);
router.delete('/:id', authMiddleware, transactionsController.delete);
router.get('/balance', authMiddleware, transactionsController.getBalance);

module.exports = router;
