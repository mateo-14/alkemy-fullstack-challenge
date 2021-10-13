const Router = require('express').Router;
const router = Router();
const transactionsController = require('../controllers/transactions.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, transactionsController.getAll);
router.post('/', authMiddleware, transactionsController.create);
router.put('/:id', authMiddleware, transactionsController.update);
router.delete('/:id', authMiddleware, transactionsController.delete);

module.exports = router;
