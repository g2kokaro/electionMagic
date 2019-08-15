var electionMagic = artifacts.require("./electionMagic.sol");

contract("electionMagic", function (accounts) {
  var electionInstance;

  it("Contract deploys correctly", function () {
    return electionMagic.deployed().then(function (instance) {
      return instance.candidateCount();
    }).then(function (count) {
      assert.equal(count, 0);
    });
  });

  it("Administrator can add candidates with the correct values", function () {
    let electionInstance;
    return electionMagic.deployed().then(function (instance) {
      electionInstance = instance;
      electionInstance.addCandidate("Donald Trump", { from: accounts[0] });
      electionInstance.addCandidate("Vladimir Putin", { from: accounts[0] });
      return electionInstance.candidates(1);
    }).then(function (candidate) {
      assert.equal(candidate[0], "Donald Trump", "contains the correct name");
      assert.equal(candidate[1], 0, "contains the correct votes count");
      return electionInstance.candidates(2);
    }).then(function (candidate) {
      assert.equal(candidate[0], "Vladimir Putin", "contains the correct name");
      assert.equal(candidate[1], 0, "contains the correct votes count");
    });
  });

  it("Non-administrators cannot add candidates", function () {
    return electionMagic.deployed().then(function (instance) {
      return instance.addCandidate("Donald Trump", { from: accounts[9] });
    }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('revert') >= 0, "This should revert");
    });
  })

  // it("allows a voter to cast a vote", function() {
  //   return electionMagic.deployed().then(function(instance) {
  //     electionInstance = instance;
  //     candidateId = 1;
  //     return electionInstance.vote(candidateId, { from: accounts[0] });
  //   }).then(function(receipt) {
  //     assert.equal(receipt.logs.length, 1, "an event was triggered");
  //     assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
  //     assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
  //     return electionInstance.voters(accounts[0]);
  //   }).then(function(voted) {
  //     assert(voted, "the voter was marked as voted");
  //     return electionInstance.candidates(candidateId);
  //   }).then(function(candidate) {
  //     var voteCount = candidate[1];
  //     assert.equal(voteCount, 1, "increments the candidate's vote count");
  //   })
  // });

  // it("throws an exception for invalid candiates", function() {
  //   return electionMagic.deployed().then(function(instance) {
  //     electionInstance = instance;
  //     return electionInstance.vote(99, { from: accounts[1] })
  //   }).then(assert.fail).catch(function(error) {
  //     assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
  //     return electionInstance.candidates(1);
  //   }).then(function(candidate1) {
  //     var voteCount = candidate1[1];
  //     assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
  //     return electionInstance.candidates(2);
  //   }).then(function(candidate2) {
  //     var voteCount = candidate2[1];
  //     assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
  //   });
  // });

  // it("throws an exception for double voting", function() {
  //   return electionMagic.deployed().then(function(instance) {
  //     electionInstance = instance;
  //     candidateId = 2;
  //     electionInstance.vote(candidateId, { from: accounts[1] });
  //     return electionInstance.candidates(candidateId);
  //   }).then(function(candidate) {
  //     var voteCount = candidate[1];
  //     assert.equal(voteCount, 1, "accepts first vote");
  //     // Try to vote again
  //     return electionInstance.vote(candidateId, { from: accounts[1] });
  //   }).then(assert.fail).catch(function(error) {
  //     assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
  //     return electionInstance.candidates(1);
  //   }).then(function(candidate1) {
  //     var voteCount = candidate1[1];
  //     assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
  //     return electionInstance.candidates(2);
  //   }).then(function(candidate2) {
  //     var voteCount = candidate2[1];
  //     assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
  //   });
  // });
});
