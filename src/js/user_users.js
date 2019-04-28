App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  projectId: 0,

  main: async function(){
    try{
      
      // Get Provider
      await App.initWeb3();

      // Load Smart Contract 
      let electionContract = await App.initContract();
      App.contracts.Election = TruffleContract(electionContract);
      App.contracts.Election.setProvider(App.web3Provider);

      // Render Page
      await App.render();

    } catch(er){
      console.log(er);
    }
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    //return App.initContract();
  },

  initContract: function() {
    return $.getJSON("Election.json", function() { });
  },

  displayContent: function(display) {
    var loader = $("#loader");
    var content = $("#content");
    if(display){
      loader.hide();
      content.show()
    }else{
      loader.show();
      content.hide();
    }
  },

  render: async function() {
    App.displayContent(false);
    App.displayAccount(); // async
    await App.renderCandidateList();
    App.displayContent(true);
    App.renderTeammatesVoting();
  },

  renderCandidateList: async function(){

    let instance = await App.contracts.Election.deployed();
    let candidatesCount = await instance.userCount();

    let projects = await App.getProjects(instance);

    let candidateList = $("#candidatesList");
    candidateList.empty();

    for (var i = 1; i <= candidatesCount; i++){
      candidate = await instance.candidates(i);
      var candidateRow = `<tr><th>${candidate[0]}</th><td>${projects[candidate[1]-1][1]}</td><td>${candidate[2]}</td>`;
      candidateList.append(candidateRow);
    }

    var userProjectSelector = $('#userProject');
    userProjectSelector.empty();

    for (var i = 0; i < projects.length; i++){
      let project = projects[i];
      let projectOption = `<option value='${i+1}'>${project[1]}</option>`
      userProjectSelector.append(projectOption);
    }

  },

  getProjects: async function(instance) {
    let projectsCount = await instance.projectCount();
    let projects = [];

    for (let i = 1; i<= projectsCount; i++){
      let project = await instance.projects(i);
      projects.push(project);
    }
    return projects;
  },

  addUser: async function() {

    let instance = await App.contracts.Election.deployed();
    let userName = $("#userName").val();
    let userAddress = $("#userAddress").val();
    let userProject = $("#userProject").val();
    await instance.addUser(userAddress, userProject, userName, { from: App.account });

  },


  displayAccount: async function(){
    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    let instance = await App.contracts.Election.deployed();
    let user = await instance.users(App.account);
    let projectId = user[2];
    App.projectId = projectId;
    let project = await instance.projects(projectId);
    let projectName = project[1];

    $("#userinfo #username").html("<span style=\"color:red;\">Not supported</span>");
    $("#userinfo #userTeam").html(projectName);

  },

  renderTeammatesVoting: async function() {
    let instance = await App.contracts.Election.deployed();
    let appStarted = await instance.appStarted();

    if (appStarted) {
        let numProjects = await instance.projectCount();
        let user = await instance.users(App.account);
        console.log(user)
        let hasVoted = user[0];

        let rankingResults = $("#rankingResults")
        rankingResults.empty();

        if (numProjects > 0 && !hasVoted) {
            for (var idTeam = 1; idTeam <= numProjects; idTeam++) {
            
            //    if (idTeam != App.projectId) {
                let team = await instance.projects(idTeam);
                let id = team[0];
                var name = team[1];

                var input = "<td><input type=\"number\" class=\"form-control\" min=\"1\" max=\"5\" value=\"1\"/></td>"
                input = input.repeat(4);
                let voteButton = "";
                //var voteButton = "<td><button type=\"submit\" class=\"btn btn-primary\" onclick=\"vote(this)\">Vote</button></td>"
                var rankingTemplate = "<tr id=\""+ id +"\"><th>" + ($('#rankingResults tr').length + 1) + "</th><td>" + name + "</td>" + input + "</td>" +voteButton + "</tr>"
        
                rankingResults.append(rankingTemplate);
                }
            
        // }

            if ($("#rankingResults").parent().parent().children('button').length === 0) {
                let voteButton = "<button type=\"submit\" class=\"btn btn-primary\" onclick=\"vote(this)\">Vote</button>"
                $("#rankingResults").parent().parent().append(voteButton);
            }
        } else {
            let message = "You have already voted.";
            $("#content").append("<div class=\"alert alert-info\">"+message+"</div>");
        }
    } else {
        let message = "The voting app is still not available. The administrator must start it."
        $("#content").html("<div class=\"alert alert-danger\">"+ message +"</div>")
    }
},

  // listenForEvents: function() {
  //   App.contracts.Election.deployed().then(function(instance) {
  //     instance.votedEvent({}, {
  //       fromBlock: 'latest'
  //       // fromBlock: 0,
  //       // toBlock: 'latest'
  //     }).watch(function(error, event) {
  //       console.log("event triggered", event)
  //       // Reload when a new vote is recorded
  //       //App.render();
  //     });
  //   });
  // }

};

$(function() {
  $(window).load(function() {
    App.main();
  });
});