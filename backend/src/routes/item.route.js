const express = require('express');
const itemcontroller = require('../controllers/item.Controller');
const auth = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/', auth, itemcontroller.getItems);
router.get('/:id', auth, itemcontroller.getItemById);
router.post('/', auth, itemcontroller.createItem);
router.put('/:id', auth, itemcontroller.updateItem);
router.delete('/:id', auth, itemcontroller.deleteItem);

module.exports = router;
