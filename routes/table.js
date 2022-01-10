var express = require('express');
var router = express.Router();
const productController = require('../controller/productController');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('table', { title: 'Express' });
});

router.post('/',productController.findSearch);

module.exports = router;