var electionMagic = artifacts.require("./electionMagic.sol");

module.exports = function(deployer) {
  deployer.deploy(electionMagic);
};
