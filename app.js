var SHA256=require('crypto-js/sha256');

class Block{
    constructor(index,timestamp,data,previousHash=''){
        this.index=index;
        this.timestamp = timestamp;
        this.data =data;
        this.previousHash= previousHash;
        this.hash =this.calculateHash();
    }
    calculateHash(){
        return SHA256(this.index+this.timestamp+this.previousHash+JSON.stringify(this.data));
    }
}

class BlockChain{
    constructor(){
        this.chain=[this.createGenesisBlock()];
    }
    createGenesisBlock(){
        return new Block(0,"09/08/2019","Genesis Block","0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock){
        newBlock.previousHash= this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i=1;i<this.chain.length;i++){
          if(this.chain[i].hash !=this.chain[i-1].previousHash ){
              return false;
          }
          if(this.chain[i].hash != this.chain[i].calculateHash())
            return false;
        }
    return true;
    }
}


let bitCoins =new BlockChain();
bitCoins.addBlock(new Block(1,"23/08/2019",{Amount : 4}));
bitCoins.addBlock(new Block(2,"13/08/2019",{Amount : 100}));

// console.log(JSON.stringify(bitCoins,null,4));
bitCoins.chain[1].data={Amount: 200};
bitCoins.chain[1].hash=bitCoins.chain[1].calculateHash();
console.log(bitCoins.isChainValid());

