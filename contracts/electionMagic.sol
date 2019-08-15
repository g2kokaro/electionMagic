pragma solidity ^0.5.0;

contract electionMagic {
    struct Candidate {
        string name;
        uint voteCount;
    }

    mapping(address => bool) public voters;
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;

    event votedEvent (uint indexed _candidateId);

    constructor () public {
        addCandidate("Donald Trump");
        addCandidate("Vladimir Putin");
    }

    function addCandidate (string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(_name, 0);
    }

    function vote (uint _candidateId) public {
        require(!voters[msg.sender], "You can only vote once.");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate.");

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;

        emit votedEvent(_candidateId);
    }
}
