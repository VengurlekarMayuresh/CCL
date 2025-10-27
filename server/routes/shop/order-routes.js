const express = require('express');
const app = express();
const  {createOrder,capturePayment,getAllOrders,getOrderDetails,postOrder} = require('../../controllers/shop/order-controller');
const router = express.Router();

router.post('/create', createOrder);
router.post('/capture', capturePayment);
router.get('/list/:userId', getAllOrders);
router.get('/details/:id', getOrderDetails);
router.post('/post', postOrder);

module.exports = router;
