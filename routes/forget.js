var express = require('express');
var router = express.Router();
const adminController = require('../controller/adminController');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('forget', { title: 'Express' });
});

router.post('/',adminController.forget);
router.get('/:email/:token',adminController.confirmEmail);

module.exports = router;