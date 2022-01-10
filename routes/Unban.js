var express = require('express');
var router = express.Router();
const banController = require('../controller/banController');

router.get('/', banController.dsBan);
// router.get('/:id',banController.dsBan);
router.get('/:id',banController.unban);

module.exports = router;