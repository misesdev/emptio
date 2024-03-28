const bit84 = require("bip84")
// import "bip84"
const bitcore = require("bitcore-lib")
// import "bitcore-lib"

export const bitcoreGetAddress = () => {

    const root = new bit84.fromMnemonic("mystery nice seconde control twin weather river rocket chest lunar basic mouse")

    var child0 = root.deriveAccount(0);

    var account0 = new bit84.fromZPrv(child0)


    const bitcoinPrivateKey = account0.getPrivateKey(0);
    const bitcoinAddress = account0.getAddress(0);

    console.log(bitcoinAddress)
}




