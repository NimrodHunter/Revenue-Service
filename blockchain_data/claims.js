const provider = require('../utils/provider');
const ethers = require('ethers');
const factoryAddress = require('../utils/revenueFactory');
const factoryAbi = require('../abis/factory.json');
const rewardAbi = require('../abis/reward.json');
const tokenAbi = require('../abis/token.json');
const rewardImplementation = require('../utils/reward');
const { addressNFTs } = require('./nfts');

const projectClaims = async (project, id) => {
    let claims = [] ;
    const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, provider);
    let rewardContract = new ethers.Contract(rewardImplementation, rewardAbi, provider);
    try {
        const numOfRewards = await factoryContract.claimables();
        if (numOfRewards > 0) {
            for (let i = 1; i <= numOfRewards; i++) {
                const claimables = await factoryContract.revenuesAddress(i);
                rewardContract = rewardContract.attach(claimables);
                const nftAddress = await rewardContract.nft();
                if (nftAddress.localCompare(project) === 0) {
                    const claimed = await rewardContract.claimed(id);
                    if (!claimed) {
                        const rewardToken = await rewardContract.rewardToken();
                        const tokenContract = new ethers.Contract(rewardToken, tokenAbi, provider);
                        const symbol = await tokenContract.symbol();
                        const revenue = await rewardContract.revenue();
                        const blockNumber = await rewardContract.blockNumber();
                        claims.push({
                            token: {
                                address: rewardToken.address,
                                symbol: symbol,
                                revenue: revenue.toString()
                            },
                            blockNumber
                        })
                    }
                }
            }
        }
    } catch (e) {
        console.log(e.code)
        claims = e;
    }
    return claims;
}

const userClaims = async (user) => {
    let totalClaims = [] ;
    try {
        const nfts = await addressNFTs(user);
        await Promise.all(nfts.map(async (nft) => {
            const claims = await projectClaims(nft.project, parseInt(nft.nft.id))
            totalClaims.push({
                project: nft.project,
                nftId: nft.nft.id,
                claims: claims
            })
        }));
    } catch (e) {
        console.log(e.code)
        totalClaims = e;
    }
    return totalClaims;
}


module.exports = { projectClaims, userClaims }