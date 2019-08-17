let ethers = require('ethers')
let utils = ethers.utils
let ABI = require('./electionMagic.json').abi

const CONTRACT_ADDRESS_DEV = '0x7ddA67ca96CbCceC5AA56B72F5Bc10A8490EdF02'
const CONTRACT_ADDRESS_KOVAN = '0xcb79866ab49160c9fcfbdc311e687de4e53a2806'

class contractFunctions {
  constructor() {
    this.provider = ""
    this.contractAddress = ""
    this.contract = ""
  }

  valueToNumber(v) {
    let bigNum = new utils.BigNumber(v._hex)
    return bigNum.toNumber();
  }

  async initialize() {
    if (process.env.NODE_ENV === "development") {
      this.contractAddress = CONTRACT_ADDRESS_DEV
    } else {
      this.contractAddress = CONTRACT_ADDRESS_KOVAN
    }
    this.provider = new ethers.providers.Web3Provider(window.web3.currentProvider);
    this.contract = new ethers.Contract(this.contractAddress, ABI, this.provider.getSigner())
    this.adminAddress = await this.contract.administrator()
    this.electionState = await this.contract.currentState()
  }

  async getNumberOfCandidates() {
    let v = await this.contract.candidateCount()
    return this.valueToNumber(v)
  }

  async getCandidate(candidateId) {
    let obj = await this.contract.candidates(candidateId);
    return {
      id: candidateId,
      name: obj.name,
      voteCount: this.valueToNumber(obj.voteCount)
    }
  }

  async vote(candidateId) {
    if (this.electionState === 0) {
      return { alertType: "warning", message: "The election has not started yet." }
    }
    let voterState = await this.contract.voters(window.web3.eth.accounts[0])
    if (voterState === 0) {
      return { alertType: "warning", message: "You are not eligible to vote." }
    } else if (voterState === 2) {
      return { alertType: "warning", message: "You have already voted." }
    }
    await this.contract.vote(candidateId)
    return { alertType: "success", message: "Vote cast successfully." }
  }

  async getAllCandidates() {
    let candidateCount = await this.getNumberOfCandidates();
    let candidates = []
    for (let i = 1; i <= candidateCount; i++) {
      candidates.push(await this.getCandidate(i))
    }
    return candidates
  }
}

export default contractFunctions
