const ethers = require('ethers');
const toChecksum = require('../utils/toChecksum');
const projects = require('../utils/projects');

const { addressNFTs, projectNFTs, nftData } = require('../blockchain_data/nfts');

const nftByUser = async (req, res) => {
    const address = toChecksum(req.params.userAddress);
    if (!ethers.utils.isAddress(address)) {
        res.status(400).send({ error: 'invalid address' });
    } else {
        const nfts = await addressNFTs(address);
        if (nfts instanceof Error) res.status(500).send({ error: "provider error...try again" });
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
        if (blockNfts.nfts instanceof Error) res.status(500).send({ error: "provider error...try again" });
        res.status(200).json({ blockNfts });
    }
};

const nftDataController = async (req, res) => {
    const project = toChecksum(req.params.projectAddress);
    const id = parseInt(req.params.id);
    const validProject = projects.find(pr => pr.localeCompare(project) === 0);
    if (!ethers.utils.isAddress(project) || validProject === undefined) {
        res.status(400).send({ error: 'invalid project address' });
    } else {
        const nft = await nftData(project, id);
        if (nft instanceof Error) res.status(500).send({ error: "provider error...try again" });
        res.status(200).json({ nft });
    }
};

module.exports = { nftByUser, nftByProject, nftDataController };