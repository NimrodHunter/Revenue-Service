const BN = require('bn.js');

const standardDeviation = (vector) => {
    const count = new BN(vector.length);
    const avg = average(vector); 
    let sum = new BN(0);
    vector.map((value) => {
        let des = ((new BN(value)).sub(avg)).abs();
        sum.iadd(des.sqr());
    })
    console.log("sum: "+sum)
    const variance = sum.div(count);
    return sqrt(variance);
}

const average = (vector) => {
    const total = vector.reduce((partialSum, v) => (new BN(partialSum)).add(new BN(v)), 0)
    const count = new BN(vector.length);
    return total.div(count);
}

const sqrt = (bigNum) => {
    if(bigNum.lt(new BN(0))) {
        throw new Error("Sqrt only works on non-negtiave inputs")
    }
    if(bigNum.lt(new BN(2))) {
        return bigNum
    }

    const smallCand = sqrt(bigNum.shrn(2)).shln(1)
    const largeCand = smallCand.add(new BN(1))

    if (largeCand.mul(largeCand).gt(bigNum)) {
        return smallCand
    } else {
        return largeCand
    }
}

module.exports = { average, standardDeviation }


