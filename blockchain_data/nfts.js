const provider = require('../utils/provider');
const ethers = require('ethers');
const projects = require('../utils/projects');
const nftAbi = require('../abis/NFT.json');

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
    const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber);
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
                if (nft.createAt < block.timestamp) nfts.push(nft);
            } catch (e) {}
        }
    }
    return {"block": blockNumber, "timestamp": block.timestamp, nfts};
}

module.exports = { addressNFTs, projectNFTs }