var SHA256 = require('crypto-js/sha256');
class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nounce = 0;
        this.hash = this.calculateHash();
    }
    calculateHash() {
        return SHA256(this.timestamp + this.previousHash + this.nounce + JSON.stringify(this.transactions)).toString();
    }
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nounce++;
            this.hash = this.calculateHash();
        }
        console.log("BlockMined: " + this.hash);
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
    createGenesisBlock() {
        return new Block("09/08/2019", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningrewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Transaction Succesfully mined");
        this.chain.push(block);
        this.pendingTransactions = new Transaction(null, miningrewardAddress, this.miningReward)
    }
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance=0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress==address){
                    balance-=trans.amount;
                }
                if(trans.toAddress==address){
                    balance+=trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            if (this.chain[i].hash != this.chain[i - 1].previousHash) {
                return false;
            }
            if (this.chain[i].hash != this.chain[i].calculateHash())
                return false;
        }
        return true;
    }
}


let SunCoins = new BlockChain();
// console.log("Mining Block 1.............")
// bitCoins.addBlock(new Block(1,"23/08/2019",{Amount : 354}));
// console.log("Mining Block 2.............")
// bitCoins.addBlock(new Block(2,"13/08/2019",{Amount : 100}));

// // console.log(JSON.stringify(bitCoins,null,4));
// bitCoins.chain[1].transactions={Amount: 200};
// console.log("mining.........");
// SunCoins.minePendingTransactions("address1");
// bitCoins.chain[1].hash=bitCoins.chain[1].mineBlock(4);
// console.log(bitCoins.isChainValid());
SunCoins.createTransaction(new Transaction(null,"address1",75600));
SunCoins.createTransaction(new Transaction("address1","address3",756));
SunCoins.createTransaction(new Transaction("address1","address2",23456));
SunCoins.createTransaction(new Transaction("address2","address3",8966));

console.log("mining.........");
SunCoins.minePendingTransactions("address1");

console.log("Balance of Customer1 ",SunCoins.getBalanceOfAddress("address1"));
console.log("Balance of Customer2 ",SunCoins.getBalanceOfAddress("address2"));
console.log("Balance of Customer3 ",SunCoins.getBalanceOfAddress("address3"));


