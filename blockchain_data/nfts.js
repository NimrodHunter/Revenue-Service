const provider = require('../utils/provider');
const ethers = require('ethers');
const projects = require('../utils/projects');
const nftAbi = require('../abis/NFT.json');

const NFTs = async (address, id) => {
    const nftContract = new ethers.Contract(project, nftAbi, provider);
    try {
        const owner = await nftContract.ownerOf(id);
        let nft = await nftContract.rsToken(id);
        nft = {
            "owner": owner,
            "id": i.toString(),
            "createAt": nft[0].toString(),
            "locked": nft[1].toString(),
            "amount": nft[2].toString()
        }
        return nft;
    } catch (e) {
        console.log(e.code)
        if (e.code === "ETIMEDOUT" || e.code === "SERVER_ERROR" || e.code === "CALL_EXCEPTION")
            return new Error("Network Error");
    }
}

const addressNFTs = async (address) => {
    let nfts = [];
    await Promise.all(projects.map(async (project) => {
        const nftContract = new ethers.Contract(project, nftAbi, provider);
        const balance = await nftContract.balanceOf(address);
        if (balance.toNumber() > 0) {
            let ids = await nftContract.rsId();
            ids = ids.toNumber();
            for (let i = 1; i <= ids; i++) {
                const owner = await nftContract.ownerOf(i);
                if (owner.localeCompare(address) === 0) {
                    try {
                        let nft = await nftContract.rsToken(i);
                        nft = {
                            "id": i.toString(),
                            "createAt": nft[0].toString(),
                            "locked": nft[1].toString(),
                            "amount": nft[2].toString()
                        }
                        const pr = nfts.find(v => v.project === project)
                        if (pr) pr.nft.push(nft);
                        else nfts.push({"project": project, "nft": [nft]})
                    } catch (e) {
                        console.log(e.code)
                        if (e.code === "ETIMEDOUT" || e.code === "SERVER_ERROR" || e.code === "CALL_EXCEPTION")
                        return new Error("Network Error");
                    }
                }
            }
        }
    }));
    return nfts;
}

const projectNFTs = async (address) => {
    let nfts = [];
    const nftContract = new ethers.Contract(address, nftAbi, provider);
    let ids = await nftContract.rsId();
    ids = ids.toNumber();
    const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber);
        if (ids > 0) {
        for (let i = 1; i <= ids; i++) {
            try {
                let nft = await nftContract.rsToken(i);
                nft = {
                    "id": i.toString(),
                    "createAt": nft[0].toString(),
                    "locked": nft[1].toString(),
                    "amount": nft[2].toString()
                };
                if (ethers.BigNumber.from(nft.createAt).lte(block.timestamp)) nfts.push(nft);
            } catch (e) {
                console.log(e.code)
                if (e.code === "ETIMEDOUT" || e.code === "SERVER_ERROR" || e.code === "CALL_EXCEPTION")
                return new Error("Network Error");
            }
        }
    }
    return {"block": blockNumber, "timestamp": block.timestamp, nfts};
}

const projectNFTsByBlock = async (address, blockNumber) => {
    let nfts = [];
    const nftContract = new ethers.Contract(address, nftAbi, provider);
    let ids = await nftContract.rsId();
    ids = ids.toNumber();
    const block = await provider.getBlock(blockNumber);
        if (ids > 0) {
        for (let i = 1; i <= ids; i++) {
            try {
                let nft = await nftContract.rsToken(i);
                nft = {
                    "id": i.toString(),
                    "createAt": nft[0].toString(),
                    "locked": nft[1].toString(),
                    "amount": nft[2].toString()
                };
                if (ethers.BigNumber.from(nft.createAt).lte(block.timestamp)) nfts.push(nft);
            } catch (e) {
                console.log(e.code)
                if (e.code === "ETIMEDOUT" || e.code === "SERVER_ERROR" || e.code === "CALL_EXCEPTION")
                return new Error("Network Error");
            }
        }
    }
    return {"block": blockNumber, "timestamp": block.timestamp, nfts};
}

module.exports = { addressNFTs, projectNFTs, projectNFTsByBlock, NFTs }