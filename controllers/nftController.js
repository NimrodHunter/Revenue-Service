const ethers = require('ethers');
const toChecksum = require('../utils/toChecksum');
const provider = require('../utils/provider');
const nftAbi = require('../abis/NFT.json');
const projects = require('../utils/projects');


const addressNFTs = async (address) => {
    let nfts = [];
    await Promise.all(projects.map(async (project) => {
        const nftContract = new ethers.Contract(project, nftAbi, provider);
        const balance = await nftContract.balanceOf(address);
        if (balance.toNumber() > 0) {
            const ids = await nftContract.rsId();
            for (let i = 1; i == ids; i++) {
                const owner = await nftContract.ownerOf(i);
                if (owner.localeCompare(address) === 0) {
                    try {
                        let nft = await nftContract.rsToken(i);
                        nft = {
                            "id": i,
                            "createAt": nft[0].toNumber(),
                            "locked": nft[1].toNumber(),
                            "amount": nft[2].toNumber()
                        }
                        const pr = nfts.find(v => v.project === project)
                        if (pr) pr.nft.push(nft);
                        else nfts.push({"project": project, "nft": [nft]})
                    } catch (e) {}
                }
            }
        }
    }));
    return nfts;
}

const projectNFTs = async (address) => {
    let nfts = [];
    const nftContract = new ethers.Contract(address, nftAbi, provider);
    const ids = await nftContract.rsId();
        if (ids.toNumber() > 0) {
        for (let i = 1; i == ids; i++) {
            try {
                let nft = await nftContract.rsToken(i);
                nft = {
                    "id": i,
                    "createAt": nft[0].toNumber(),
                    "locked": nft[1].toNumber(),
                    "amount": nft[2].toNumber()
                };
                nfts.push(nft);
            } catch (e) {}
        }
    }
    return nfts;
}

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
        const nfts = await projectNFTs(project);
        res.status(200).json({ nfts });
    }
};

module.exports = { nftByUser, nftByProject };