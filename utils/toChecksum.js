const createKeccakHash = require('keccak')

function toChecksum (address) {
  address = address.toLowerCase().replace('0x', '');
  var hash = createKeccakHash('keccak256').update(address).digest('hex');
  var ret = '0x';

  for (var i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }

  return ret
}

module.exports = toChecksum