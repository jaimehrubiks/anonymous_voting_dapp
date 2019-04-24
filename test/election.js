var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {
  var electionInstance;

  it("create first project", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.addProject("Voting App", { from: accounts[0] });
    }).then(function(res) {
      return electionInstance.projectCount();
    }).then(function(count){
      assert.equal(count, 1);
    });
  });

  it("create project when user is not admin", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.addProject("test project", { from: accounts[1] });
      }).then(assert.fail).catch(function(error) {
      return electionInstance.projectCount();
    }).then(function(count){
      assert.equal(count, 1);
    });
  });


  it("create second project", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.addProject("supply chain", { from: accounts[0] });
    }).then(function(res) {
      return electionInstance.projectCount();
    }).then(function(count){
      assert.equal(count, 2);
    });
  });

  it("create user", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.addUser(accounts[1], 1, "jaime", { from: accounts[0] });
    }).then(function(res) {
      return electionInstance.userCount();
    }).then(function(count){
      assert.equal(count, 1);
      return 
    });
  });

  it("create second user", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.addUser(accounts[2], 1, "salva", { from: accounts[0] });
    }).then(function(res) {
      return electionInstance.userCount();
    }).then(function(count){
      assert.equal(count, 2);
      return 
    });
  });



  it("create user when the project does not exist", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.addUser("0x3BB400280Dc3b0761a554c370Bf42BfA5c54Fa70", 5, "jon snow", { from: accounts[0] });
    }).then(assert.fail).catch(function(error) {
      return electionInstance.userCount();
    }).then(function(count){
      assert.equal(count, 2);
      return 
    });
  });

  it("app starts correctly", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.appStart({ from: accounts[0] });
    }).then(function(res) {
      return;
    });
  });

  it("user jaime (1), tries to vote his own project", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.voteProject([1,0], { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      return electionInstance.projects(2);
    }).then(function(project2){
      assert.equal(project2.points, 0)
      return 
    });
  });

  it("user jaime (1), votes candidates", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.voteProject([0,1], { from: accounts[1] });
    }).then(function(res) {
      return electionInstance.projects(2);
    }).then(function(project2){
      assert.equal(project2.points, 1)
      return 
    });
  });

  it("user jaime (1), tries to vote again", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.voteProject([0,1], { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      return electionInstance.projects(2);
    }).then(function(project2){
      assert.equal(project2.points, 1)
      return electionInstance.users(accounts[1])
    }).then(function(user){
      assert.equal(user.votedProject, true);
      return 
    });
  });

  it("user jaime (1), votes his teammates", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.voteTeammates([2,1],{ from: accounts[1] });
    }).then(function(res){
      return electionInstance.users(accounts[1]);
    }).then(function(user){
      assert.equal(user.votedTeammates, true)
      return electionInstance.candidates(1)
    }).then(cand=>{
      assert.equal(cand.points, 2);
      return electionInstance.candidates(2)
    }).then(cand=>{
      assert.equal(cand.points, 1);
    })
    });


    it("user jaime (1), tries to vote twice to his teammates", function() {
      return Election.deployed().then(function(instance) {
        electionInstance = instance;
        return electionInstance.voteTeammates([2,1],{ from: accounts[1] });
      }).then(assert.fail).catch(function(error) {
        return electionInstance.candidates(1)
      }).then(cand=>{
        assert.equal(cand.points, 2);
        return electionInstance.candidates(2)
      }).then(cand=>{
        assert.equal(cand.points, 1);
      })
    });

  });


  // it("it initializes the candidates with the correct values", function() {
  //   return Election.deployed().then(function(instance) {
  //     electionInstance = instance;
  //     return electionInstance.candidates(1);
  //   }).then(function(candidate) {
  //     assert.equal(candidate[0], 1, "contains the correct id");
  //     assert.equal(candidate[1], "Candidate 1", "contains the correct name");
  //     assert.equal(candidate[2], 0, "contains the correct votes count");
  //     return electionInstance.candidates(2);
  //   }).then(function(candidate) {
  //     assert.equal(candidate[0], 2, "contains the correct id");
  //     assert.equal(candidate[1], "Candidate 2", "contains the correct name");
  //     assert.equal(candidate[2], 0, "contains the correct votes count");
  //   });
  // });

  // it("allows a voter to cast a vote", function() {
  //   return Election.deployed().then(function(instance) {
  //     electionInstance = instance;
  //     candidateId = 1;
  //     return electionInstance.vote(candidateId, { from: accounts[0] });
  //   }).then(function(receipt) {
  //     return electionInstance.voters(accounts[0]);
  //   }).then(function(voted) {
  //     assert(voted, "the voter was marked as voted");
  //     return electionInstance.candidates(candidateId);
  //   }).then(function(candidate) {
  //     var voteCount = candidate[2];
  //     assert.equal(voteCount, 1, "increments the candidate's vote count");
  //   })
  // });

  // it("throws an exception for invalid candidates", function() {
  //   return Election.deployed().then(function(instance) {
  //     electionInstance = instance;
  //     return electionInstance.vote(99, { from: accounts[1] })
  //   }).then(assert.fail).catch(function(error) {
  //     assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
  //     return electionInstance.candidates(1);
  //   }).then(function(candidate1) {
  //     var voteCount = candidate1[2];
  //     assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
  //     return electionInstance.candidates(2);
  //   }).then(function(candidate2) {
  //     var voteCount = candidate2[2];
  //     assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
  //   });
  // });

  // it("throws an exception for double voting", function() {
  //   return Election.deployed().then(function(instance) {
  //     electionInstance = instance;
  //     candidateId = 2;
  //     electionInstance.vote(candidateId, { from: accounts[1] });
  //     return electionInstance.candidates(candidateId);
  //   }).then(function(candidate) {
  //     var voteCount = candidate[2];
  //     assert.equal(voteCount, 1, "accepts first vote");
  //     // Try to vote again
  //     return electionInstance.vote(candidateId, { from: accounts[1] });
  //   }).then(assert.fail).catch(function(error) {
  //     assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
  //     return electionInstance.candidates(1);
  //   }).then(function(candidate1) {
  //     var voteCount = candidate1[2];
  //     assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
  //     return electionInstance.candidates(2);
  //   }).then(function(candidate2) {
  //     var voteCount = candidate2[2];
  //     assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
  //   });
  // });

  // it("allows a voter to cast a vote", function() {
  //   return Election.deployed().then(function(instance) {
  //     electionInstance = instance;
  //     candidateId = 1;
  //     return electionInstance.vote(candidateId, { from: accounts[2] });
  //   }).then(function(receipt) {
  //     assert.equal(receipt.logs.length, 1, "an event was triggered");
  //     assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
  //     assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
  //     return electionInstance.voters(accounts[2]);
  //   }).then(function(voted) {
  //     assert(voted, "the voter was marked as voted");
  //     return electionInstance.candidates(candidateId);
  //   }).then(function(candidate) {
  //     var voteCount = candidate[2];
  //     assert.equal(voteCount, 2, "increments the candidate's vote count");
  //   })
  // });

// });