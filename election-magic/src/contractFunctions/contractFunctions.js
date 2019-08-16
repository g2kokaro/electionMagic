let ethers = require('ethers')
let ABI = require('./electionMagic.json').abi

let RPC_SERVER_DEV = 'http://127.0.0.1:8545'
let CONTRACT_ADDRESS_DEV = '0xEaDf5fC997a9aefCfDe79A18dF51215c77C00740'

class contractFunctions {
  constructor() {
    this.provider = ""
    this.contractAddress = ""
    this.contract = ""
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
    return this.contract.candidateCount()
  }
  async getCandidate(candidateId) {
    return this.contract.candidates(candidateId);
  }
}

export default contractFunctions
