pragma solidity ^0.5.0;

contract Election {

    // Structures
    struct User {
        //address secAddress;
        bool votedProject;
        bool votedTeammates;
        uint projectId;
    }

    struct Candidate {
        // id
        string name;
        uint projectId;
        uint points;
    }

    struct Project {
        // id del projecto
        uint id;
        string name;
        uint points;
        uint count; // Number of people in a proyect
    }

    // Mappings
    mapping(address => User) public users;
    mapping(uint => Candidate) public candidates;
    mapping(uint => Project) public projects;

    // Variables
    address private admin;
    bool public appStarted;
    uint public userCount;
    uint public projectCount;

    // Events
    // event votedEvent (
    //     uint indexed _candidateId
    // );

    constructor(address adminAddress) public {
        admin = adminAddress;
        appStarted = false;
        userCount = 0;
        projectCount = 0;
    }

    function addProject(string memory name) public payable {
        require(msg.sender == admin);
        require(appStarted == false); 
        projectCount++;
        projects[projectCount] = Project(projectCount, name, 0, 0);
    }

    function addUser(address secAddress, uint projectId, string memory name) public payable {
        require(msg.sender == admin);
        require(appStarted == false);
        require(projects[projectId].id > 0);
        projects[projectId].count++;
        userCount++;
        users[secAddress] = User(false, false, projectId);
        candidates[userCount] = Candidate(name, projectId, 0);
    }

    function appStart() public payable {
        require(msg.sender == admin);
        require(appStarted == false);
        appStarted = true;
    }

}