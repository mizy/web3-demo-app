// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract NFT is ERC721, Ownable{
    address payable public owner;
    uint256 private _nextTokenId = 1;

    constructor() ERC721("NFT", "MNFT") payable {
        owner = payable(msg.sender);
    }

    function mint(address to) public onlyOwner {
        _safeMint(to, _nextTokenId);
        _nextTokenId++;
    }

    function transfer(address to, uint256 tokenId) public {
        require(msg.sender == owner, "You aren't the owner");
        _safeTransfer(owner, to, tokenId, "");
    }
    
    function name() public pure returns (string memory) {
        return "NFT";
    }

    function getbalance() public view returns (uint) {
        return address(this).balance;
    }
  
}
