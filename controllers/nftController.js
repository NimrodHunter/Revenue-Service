const ethers = require('ethers');
const toChecksum = require('../utils/toChecksum');
const projects = require('../utils/projects');

const { addressNFTs, projectNFTs } = require('../blockchain_data/nfts');

const nftByUser = async (req, res) => {
    const address = toChecksum(req.params.userAddress);
    if (!ethers.utils.isAddress(address)) {s
        res.status(400).send({ error: 'invalid address' });
    } else {
        const nfts = await addressNFTs(address);
        res.status(200).json({ nfts });
    }
};

const nftByProject = async (req, res) => {
    const project = toChecksum(req.params.projectAddress);
    const validProject = projects.find(pr => pr.localeCompare(project) === 0);
    if (!ethers.utils.isAddress(project) || validProject === undefined) {
        res.status(400).send({ error: 'invalid project address' });
    } else {
        const blockNfts = await projectNFTs(project);
        res.status(200).json({ blockNfts });
    }
};

module.exports = { nftByUser, nftByProject };