var electionMagic = artifacts.require("./electionMagic.sol");

contract("electionMagic", function (accounts) {
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
      assert(error.message.indexOf('Only the administrator') >= 0, "This should revert");
    });
  })

  it("Votes can only be cast when the election is in progress", function () {
    return electionMagic.deployed().then(function (instance) {
      return instance.vote(1);
    }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf('election is in progress') >= 0, "This should revert");
    });
  })


  it("Allows an eligible voter to cast a vote", function() {
    let electionInstance;
    let candidateId = 1;
    return electionMagic.deployed().then(function(instance) {
      electionInstance = instance;
      electionInstance.addVoter(accounts[8], { from: accounts[0] });
      electionInstance.addVoter(accounts[9], { from: accounts[0] });
      electionInstance.finishSetup({ from: accounts[0] });
      return electionInstance.vote(candidateId, { from: accounts[9] });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "an event was triggered");
      assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
      assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
      return electionInstance.voters(accounts[9]);
    }).then(function(voted) {
      assert(voted == 2, "the voter was marked as voted");
      return electionInstance.candidates(candidateId);
    }).then(function(candidate) {
      var voteCount = candidate[1];
      assert.equal(voteCount, 1, "increments the candidate's vote count");
    })
  });

  it("Invalid votes are not accepted", async() => {
    let instance = await(electionMagic.deployed());
    try {
      await instance.vote(1,  { from: accounts[3] });
      assert(false, "This should have reverted.")
    } catch (error) {
      assert(error.message.indexOf('not eligible to vote') >= 0, "Ineligible voter - should revert");
    }
    try {
      await instance.vote(999,  { from: accounts[8] });
      assert(false, "This should have reverted.")
    } catch (error) {
      assert(error.message.indexOf('Invalid candidate') >= 0, "Vote cast for invalid candidate - should revert");
    }
  })

});
