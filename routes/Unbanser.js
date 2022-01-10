var express = require('express');
var router = express.Router();
const banController = require('../controller/banController');

router.get('/', banController.dsBanUser);
router.get('/:id',banController.unbanUser);
// router.get('/:id',banController.dsBanUser);

module.exports = router;