const express = require('express');
const { nftByUser, nftByProject, nftDataController } = require('../controllers/nftController');


const router = express.Router();

router.get('/user/:userAddress', nftByUser);
router.get('/project/:projectAddress', nftByProject);
router.get('/nft/:projectAddress/:id', nftDataController);

module.exports = router;