const express = require('express');
const router = express.Router();
const { getAllOrdersOfAllUsers, updateOrderStatus, getOrderDetailsForAdmin} = require('../../controllers/admin/order-controller');

router.get('/get-all', getAllOrdersOfAllUsers);
router.get('/details/:id', getOrderDetailsForAdmin);
router.put('/update/:id', updateOrderStatus);

module.exports = router;