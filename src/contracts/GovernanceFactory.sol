// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TokenGovernance.sol";
import "./Coin.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GovernanceFactory {

    TokenGovernance public _activeGovernance;

    constructor() {
        ERC20 curToken = new Coin("teste", "tst", 0x88AcC3c7BFB23e6A58F2A80c1322a21cA7feF25e, 20000000000000000000);
        _activeGovernance = new TokenGovernance(curToken);
    }

    function changeActive() public {
        require(_activeGovernance.getStatus(), "vote not finalized");
        ERC20 curToken = new Coin("teste", "tst", 0x88AcC3c7BFB23e6A58F2A80c1322a21cA7feF25e, 20000000000000000000);
        changeGovernance(curToken);
    }
    
    function changeGovernance(ERC20 newToken) public {
        _activeGovernance = new TokenGovernance(newToken);
    }

    function getGovernance() public view returns(TokenGovernance) {
        return _activeGovernance;
    }

    function getGovernanceStatus() public view returns(bool) {
        return _activeGovernance.getStatus();
    }

    function getToken() public view returns(ERC20) {
        return _activeGovernance.getToken();
    }
}