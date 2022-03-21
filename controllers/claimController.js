const ethers = require('ethers');
const toChecksum = require('../utils/toChecksum');
const projects = require('../utils/projects');

const claimByUser = async (req, res) => {
    const userddress = toChecksum(req.params.userAddress);
    if (!ethers.utils.isAddress(address)) {s
        res.status(400).send({ error: 'invalid address' });
    } else {
        const nfts = await addressNFTs(address);
        const claims = await 
        if (nfts instanceof Error) res.status(500).send({ error: blockNfts.nfts.message });
        res.status(200).json({ nfts });
    }
};


module.exports = { claimByUser, claimById };