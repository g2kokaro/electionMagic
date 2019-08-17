
# Election Magic
A simple voting Dapp.

A list of candidates and eligible voters can be configured by the administrator (the account which deploys the contract). Once eligible voters and candidates have been registered, the administrator can begin the election.

All data is stored in the smart contract and the frontend interacts with it.

Visit http://18.218.60.210:5000/. Metamask is required, and the contract is currently deployed on Kovan.

https://kovan.etherscan.io/address/0xcb79866ab49160c9fcfbdc311e687de4e53a2806

## Dependencies
- NPM: https://nodejs.org
- Truffle: https://github.com/trufflesuite/truffle
- Ganache: http://truffleframework.com/ganache/
- Metamask: https://metamask.io/

## Running the project locally
Clone the project, then:
```
$ cd electionMagic
$ npm install
```
Start Ganache, then run:

```
$ truffle migrate
$ cd election-magic
$ npm start
```

Visit this URL in your browser: http://localhost:3000
