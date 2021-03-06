const express = require('express');
const { claimByUser, claimById } = require('../controllers/claimController');


const router = express.Router();

router.get('/claim/:userAddress', claimByUser);
router.get('/claim/:projectAddress/:nftId', claimById);

module.exports = router;