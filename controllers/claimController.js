const ethers = require('ethers');
const toChecksum = require('../utils/toChecksum');
const projects = require('../utils/projects');
const { projectClaims, userClaims } = require('../blockchain_data/claims');

const claimByUser = async (req, res) => {
    const userAddress = toChecksum(req.params.userAddress);
    if (!ethers.utils.isAddress(userAddress)) {
        res.status(400).send({ error: 'invalid address' });
    } else {
        const claims = await userClaims(userAddress);
        if (claims instanceof Error) res.status(500).send({ error: "network error" });
        else res.status(200).json({ claims });
    }
};

const claimById = async (req, res) => {
    const project = toChecksum(req.params.projectAddress);
    const id = parseInt(req.params.nftId);
    const validProject = projects.find(pr => pr.localeCompare(project) === 0);
    if (!ethers.utils.isAddress(project) || validProject === undefined) {
        res.status(400).send({ error: 'invalid project address' });
    } else {
        const claims = await projectClaims(project, id);
        if (claims instanceof Error) res.status(500).send({ error: "network error" });
        else res.status(200).json({ claims });
    }
};


module.exports = { claimByUser, claimById };