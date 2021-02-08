pragma solidity >=0.7.0 <0.8.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract is Initializable {

    event SetPurpose(address sender, string purpose);

    string public purpose;

    function initialize(string memory _purpose) public initializer {
        purpose = _purpose;
    }

    function setPurpose(string memory newPurpose) public {
        purpose = newPurpose;
        console.log(msg.sender,"set purpose to",purpose);
        emit SetPurpose(msg.sender, purpose);
    }

    function getPurpose() public view returns(string memory) {
        return purpose;
    }

}
