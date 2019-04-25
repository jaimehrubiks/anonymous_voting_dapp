App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  main: async function(){
    try{
      
      // Get Provider
      await App.initWeb3();

      // Load Smart Contract Interface
      let electionContract = await App.initContract();
      console.log('test');
      console.log(electionContract);
      App.contracts.Election = TruffleContract(electionContract);
      App.contracts.Election.setProvider(App.web3Provider);
      // var CoursesContract = web3.eth.contract(electionContract);
      // App.contracts.Election = CoursesContract.at('0xa53c38a560C22e2Cc8c1D79De334e4897E1626e1');
      // App.contracts.Election = web3.eth.contract(electionContract ,"0xB6F7a38395FD40f8613279e092A15980D4BE77f0");
      // App.contracts.Election.setProvider(App.web3Provider);

      // Render Application View
      await App.render();
      // i=App.contracts.Election.methods.projectCount().call(a=>console.log(a));
      // App.contracts.Election.projectCount( e=> console.log(e) );
      // console.log(i)
      // App.displayContent(true)
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
    await App.renderProjectsList();
    App.displayContent(true);
  },

  renderProjectsList: async function() {
    instance = await App.contracts.Election.at("0xa53c38a560C22e2Cc8c1D79De334e4897E1626e1");
    projectCount = await instance.projectCount();
    var candidatesResults = $("#projectsList");
    candidatesResults.empty();

    for (var i = 1; i <= projectCount; i++) {
      project = await instance.projects(i);
      var id = project[0];
      var name = project[1];
      var voteCount = project[2];

      var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
      candidatesResults.append(candidateTemplate);

    }
  },

  displayAccount: function(){
    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
  },

  addProject: async function() {
    var projectName = $('#projectName').val();
    instance = await App.contracts.Election.deployed();
    try{
      await instance.addProject(projectName, { from: App.account });
      // Hide till event?
    } catch(err){ console.log(err); }
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