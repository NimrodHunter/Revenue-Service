const ethers = require('ethers');
const BN = require('ethers').BigNumber;
const utils = require('ethers').utils;
const toChecksum = require('../utils/toChecksum');
const projects = require('../utils/projects');
const { projectNFTs, projectNFTsByBlock, NFTs } = require('../blockchain_data/nfts');
const { MerkleTree } = require('merkletreejs');

const addLoyalAmounts = (nfts) => {
    if (nfts.length === 1) {
        nfts[0].reward = 1000000;
        return nfts;
    }
    nfts.sort((a, b) => {
        return a.locked - b.locked
    })

    const lockedVector = nfts.map((nft) => {
        return nft.locked;
    })

    const totalAmount = nfts.reduce((partialSum, nft) => BN.from(partialSum).add(BN.from(nft.amount)) , 0)
    const totalLocked = nfts.reduce((partialSum, nft) => BN.from(partialSum).add(BN.from(nft.locked)) , 0)

    nfts.map((nft) => {
        const amountPiece = BN.from(nft.amount).mul(1000000).div(totalAmount);
        const lockedPiece = BN.from(nft.locked).mul(1000000).div(totalLocked);
        nft.reward = amountPiece.mul(75).div(100).add(lockedPiece.mul(25).div(100)).toString()
    });

    return nfts;
}

const createMerkleTree = (blockNft) => {
    const leaves = blockNft.nfts.map((nft) => {
        return utils.solidityKeccak256(["uint256", "uint256"], [nft.id, nft.reward]);
    })
    const tree = new MerkleTree(leaves, utils.keccak256, { sort: true });
    return tree.getHexRoot();
}


const mProof = (blockNft, id) => {
    const nft = blockNft.nfts.find(nft => nft.id.localeCompare(id.toString()) === 0);
    const leaf = utils.solidityKeccak256(["uint256", "uint256"], [nft.id, nft.reward]);
    const leaves = blockNft.nfts.map((nft) => {
        return utils.solidityKeccak256(["uint256", "uint256"], [nft.id, nft.reward]);
    })
    const tree = new MerkleTree(leaves, utils.keccak256, { sort: true });
    const proof = tree.getHexProof(leaf)

    return { reward: nft.reward, leaf, proof };
}

const merkleByProject = async (req, res) => {
    const project = toChecksum(req.params.projectAddress);
    const validProject = projects.find(pr => pr.localeCompare(project) === 0);
    if (!ethers.utils.isAddress(project) || validProject === undefined) {
        res.status(400).send({ error: 'invalid project address' });
    } else {
        const blockNfts = await projectNFTs(project);
        if (!blockNfts.nfts.length) res.status(400).send({ error: 'project has not nfts minted yet' });
        blockNfts.nfts = addLoyalAmounts(blockNfts.nfts);
        if (blockNfts.nfts instanceof Error) res.status(500).send({ error: "provider error...try again" });
        const tree = createMerkleTree(blockNfts);
        res.status(200).json({ "block":blockNfts.block, "timestamp":blockNfts.timestamp, "root":tree });
    }
}

const merkleByProjectBlock = async (req, res) => {
    const project = toChecksum(req.params.projectAddress);
    const validProject = projects.find(pr => pr.localeCompare(project) === 0);
    if (!ethers.utils.isAddress(project) || validProject === undefined) {
        res.status(400).send({ error: 'invalid project address' });
    } else {
        const block = parseInt(req.params.block)
        const blockNfts = await projectNFTsByBlock(project, block);
        if (!blockNfts.nfts.length) res.status(400).send({ error: 'project has not nfts minted yet' });
        blockNfts.nfts = addLoyalAmounts(blockNfts.nfts);
        if (blockNfts.nfts instanceof Error) res.status(500).send({ error: "provider error...try again" });
        const tree = createMerkleTree(blockNfts);
        res.status(200).json({ "block":blockNfts.block, "timestamp":blockNfts.timestamp, "root":tree });
    }
}


const merkleProof = async (req, res) => {
    const project = toChecksum(req.params.projectAddress);
    const validProject = projects.find(pr => pr.localeCompare(project) === 0);
    if (!ethers.utils.isAddress(project) || validProject === undefined) {
        res.status(400).send({ error: 'invalid project address' });
    } else {
        const block = parseInt(req.params.block);
        const id = parseInt(req.params.id);
        const blockNfts = await projectNFTsByBlock(project, block);
        if (!blockNfts.nfts.length) res.status(400).send({ error: 'project has not nfts minted yet' });
        blockNfts.nfts = addLoyalAmounts(blockNfts.nfts);
        if (blockNfts.nfts instanceof Error) res.status(500).send({ error: "provider error...try again" });
        const result = mProof(blockNfts, id);
        res.status(200).json({ "nftProof": result });
    }
}

module.exports = { merkleByProject, merkleByProjectBlock, merkleProof };

