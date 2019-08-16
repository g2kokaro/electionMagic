let ethers = require('ethers')
let utils = ethers.utils
let ABI = require('./electionMagic.json').abi

let RPC_SERVER_DEV = 'http://127.0.0.1:8545'
let CONTRACT_ADDRESS_DEV = '0xEaDf5fC997a9aefCfDe79A18dF51215c77C00740'

class contractFunctions {
  constructor() {
    this.provider = ""
    this.contractAddress = ""
    this.contract = ""
  }

  valueToNumber(v){
    let bigNum = new utils.BigNumber(v._hex)
    return bigNum.toNumber();
  }

  async initialize() {
    if (process.env.NODE_ENV === "development") {
      this.contractAddress = CONTRACT_ADDRESS_DEV
      this.provider = new ethers.providers.JsonRpcProvider(RPC_SERVER_DEV);
    } else {
      // TODO add contract address and web3 provider once contract is deployed
      // this.contractAddress = ""
      this.provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
    }
    this.contract = new ethers.Contract(this.contractAddress, ABI, this.provider.getSigner())
  }

  async getNumberOfCandidates() {
    let v =  await this.contract.candidateCount()
    return this.valueToNumber(v)
  }

  async getCandidate(candidateId) {
    return this.contract.candidates(candidateId);
  }

  async getAllCandidates() {
    let candidateCount = await this.getNumberOfCandidates();
    let candidates = []
    for (let i = 1; i <= candidateCount; i++){
      let obj = await this.getCandidate(i)
      candidates.push({
        id: i,
        name: obj.name,
        voteCount: this.valueToNumber(obj.voteCount)
      })
    }
    return candidates
  }
}

export default contractFunctions
