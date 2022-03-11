const express = require('express');
const { nftByUser, nftByProject } = require('../controllers/nftController');


const router = express.Router();

router.get('/user/:userAddress', nftByUser);
router.get('/project/:projectAddress', nftByProject);

module.exports = router;