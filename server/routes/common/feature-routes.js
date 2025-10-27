const express = require('express');
const { addFeatureImage, getFeatureImage, deleteFeatureImage} = require('../../controllers/common/feature-controller');

const router = express.Router();

router.post('/add', addFeatureImage);
router.get('/get', getFeatureImage);
router.delete('/delete/:id', deleteFeatureImage);


module.exports = router;
