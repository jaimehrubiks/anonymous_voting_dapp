pragma solidity ^0.5.0;

contract Election {

    // Structures
    struct User {
        //address secId;
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

    constructor() public {
        // addCandidate("Candidate 1");
        // addCandidate("Candidate 2");
    }

    function addCandidate (string memory _name) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record that voter has voted
        voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount ++;

        // trigger voted event
        emit votedEvent(_candidateId);
    }

}