const provider = require('../utils/provider');
const ethers = require('ethers');
const projects = require('../utils/projects');
const nftAbi = require('../abis/NFT.json');

const nftData = async (project, id) => {
    let nft;
    const nftContract = new ethers.Contract(project, nftAbi, provider);
    try {
        const owner = await nftContract.ownerOf(id);
        nft = await nftContract.rsToken(id);
        nft = {
            "owner": owner,
            "id": id.toString(),
            "createAt": nft[0].toString(),
            "locked": nft[1].toString(),
            "amount": nft[2].toString()
        }
    } catch (e) {
        console.log(e.code)
        nft = e;
    }
    return nft;
}

const addressNFTs = async (address) => {
    let nfts = [];
    await Promise.all(projects.map(async (project) => {
        const nftContract = new ethers.Contract(project, nftAbi, provider);
        try {
            const balance = await nftContract.balanceOf(address);
            if (balance.toNumber() > 0) {
                let ids = await nftContract.rsId();
                ids = ids.toNumber();
                for (let i = 1; i <= ids; i++) {
                    const owner = await nftContract.ownerOf(i);
                    if (owner.localeCompare(address) === 0) {
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
                    }
                }
            }
        } catch (e) {
            console.log(e.code)
            nfts = e;
        }
    }));
    return nfts;
}

const projectNFTs = async (address) => {
    let blockNumber;
    let timestamp = "";
    let nfts = [];
    const nftContract = new ethers.Contract(address, nftAbi, provider);
    try {
        let ids = await nftContract.rsId();
        ids = ids.toNumber();
        blockNumber = await provider.getBlockNumber()
        const block = await provider.getBlock(parseInt(blockNumber));
        timestamp = parseInt(block.timestamp);
        if (ids > 0) {
            for (let i = 1; i <= ids; i++) {
                let nft = await nftContract.rsToken(i);
                nft = {
                    "id": i.toString(),
                    "createAt": nft[0].toString(),
                    "locked": nft[1].toString(),
                    "amount": nft[2].toString()
                };
                if (ethers.BigNumber.from(nft.createAt).lte(block.timestamp)) nfts.push(nft);
            }
        }
    } catch (e) {
        console.log(e.code)
        nfts = e;
    }
    return { blockNumber, timestamp, nfts };
}

const projectNFTsByBlock = async (address, blockNumber) => {
    let timestamp = "";
    let nfts = [];
    const nftContract = new ethers.Contract(address, nftAbi, provider);
    try {
        let ids = await nftContract.rsId();
        ids = ids.toNumber();
        const block = await provider.getBlock(parseInt(blockNumber));
        timestamp = parseInt(block.timestamp);
        if (ids > 0) {
            for (let i = 1; i <= ids; i++) {
                let nft = await nftContract.rsToken(i);
                nft = {
                    "id": i.toString(),
                    "createAt": nft[0].toString(),
                    "locked": nft[1].toString(),
                    "amount": nft[2].toString()
                };
                if (ethers.BigNumber.from(nft.createAt).lte(block.timestamp)) nfts.push(nft);
            }
        }
    } catch (e) {
        console.log(e.code)
        nfts = e;
    }
    return { blockNumber, timestamp, nfts };
}

module.exports = { addressNFTs, projectNFTs, projectNFTsByBlock, nftData }