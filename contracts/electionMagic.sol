pragma solidity ^0.5.0;

contract electionMagic {
    enum States { SETUP, IN_PROGRESS, COMPLETE }

    struct Candidate {
        string name;
        uint voteCount;
    }

    mapping(address => bool) public voters;
    mapping(uint => Candidate) public candidates;
    uint public candidateCount;
    States currentState;
    address administrator;

    event votedEvent (uint indexed _candidateId);

    constructor () public {
        currentState = States.SETUP;
        administrator = msg.sender;
    }

    modifier onlySetup() {
        require (currentState == States.SETUP, "This action can only be completed during election setup.");
        _;
    }

    modifier onlyInProgress() {
        require (currentState == States.IN_PROGRESS, "This action can only be completed while the election is in progress.");
        _;
    }

    modifier onlyAdministrator() {
        require (msg.sender == administrator, "Only the administrator can perform this action.");
        _;
    }

    function addCandidate (string calldata _name) external onlySetup onlyAdministrator {
        candidateCount++;
        candidates[candidateCount] = Candidate(_name, 0);
    }

    function finishSetup () public onlySetup onlyAdministrator {
        require(candidateCount >= 2, "Election must have at least two candidates.");
        currentState = States.IN_PROGRESS;
    }

    function vote (uint _candidateId) public onlyInProgress {
        require(!voters[msg.sender], "You can only vote once.");
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate.");

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit votedEvent(_candidateId);
    }
}
