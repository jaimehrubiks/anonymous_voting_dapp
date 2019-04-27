App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    projectId: 0,

    main: async function() {
        try {
            // Get Provider
            await App.initWeb3();

            // Load Smart Contract
            let electionContract = await App.initContract();
            App.contracts.Election = TruffleContract(electionContract);
            App.contracts.Election.setProvider(App.web3Provider);
            
            //Render Page
            await App.render();

        } catch (err) {
            console.log(err);
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
    },

    initContract: function() {
        return $.getJSON("Election.json", function () { });
    },

    render: async function() {
        App.displayContent(false);
        App.displayAccount();
        await App.renderTeamRanking();
        App.displayContent(true);
    },

    displayContent: function(display) {
        let loader = $("#loader");
        let content = $("#content");
        if (display) {
            loader.hide();
            content.show();
        } else {
            loader.show();
            content.hide();
        }
    },

    displayAccount: async function(){
        // Load account data
        web3.eth.getCoinbase(function(err, account) {
          if (err === null) {
            App.account = account;
            $("#accountAddress").html(account);
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

    renderTeamRanking: async function() {
        let instance = await App.contracts.Election.deployed();
        let appStarted = await instance.appStarted();

        if (appStarted) {
            let numProjects = await instance.projectCount();
            let user = await instance.users(App.account);
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
                let message = "There aren't teams to vote";
                $("#content").append("<div class=\"alert alert-info\">"+message+"</div>");
            }
        } else {
            let message = "The voting app is still not available. The administrator must start it."
            $("#content").html("<div class=\"alert alert-danger\">"+ message +"</div>")
        }
    },

    voteProject: async function(votes) {
        let instance = await App.contracts.Election.deployed();
        try {
        //    await instance.voteProject(projectId,votes);.
            await instance.voteProject(votes, {from:App.account});
        //  console.log("Lets render again");
            await App.render();
            
        } catch (err) { 
            console.log(err); 
            let message = "There was an error while voting. Please refresh the screen and try to vote again."
            $("#content").html("<div class=\"alert alert-danger\">"+ message +"</div>");
        }
    }
}

function vote(elem) {
    var votes = [];
  
    $("#rankingResults").children().each(function(i){
        let res = 0;
        if (i+1 != App.projectId) {
        
            $(this).children('td').children('input').each(function(val){
             res += parseInt($(this)[0].value);
             });
        }
        votes.push(res);
    });
    console.log(votes);

    App.voteProject(votes);
    /*$(elem).siblings('table').children('input').each(function(i){
      votes[i] = parseInt($(this)[0].value);
    });
    console.log(votes);
    console.log(projectId);
    App.voteProject(projectId, votes);*/
}

$(function() {
    $(window).load(function() {
      App.main();
    });
});