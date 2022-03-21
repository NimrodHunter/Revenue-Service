const express = require('express');
const { merkleByProject, merkleByProjectBlock, merkleProof } = require('../controllers/merkleController');


const router = express.Router();

router.get('/merkle/:projectAddress', merkleByProject);
router.get('/merkle/:projectAddress/:block', merkleByProjectBlock);
router.get('/merkle/:projectAddress/:block/:id', merkleProof);

module.exports = router;