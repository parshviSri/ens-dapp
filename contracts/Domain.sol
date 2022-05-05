//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";
contract Domain is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenid;
    mapping(string=>address)domains;
    struct Record{
        string bio;
        uint start;
        uint period;
        string twitter;
        uint tokenId;
    }
    string tld;
    mapping( address => Record)records;
    constructor(string memory _tld) payable ERC721("Web3 Identity Service","WIS"){
        tld= _tld;

    }
    function price(string calldata name) public  pure returns(uint cost){
        require(bytes(name).length !=0,"You send a empty list!!");
        uint len = bytes(name).length;
        if(len <= 3){
            return 5 * 10**18 ;
        } else if(len >= 4){
            return 6 *10**18;
        }

    }
    function register(string calldata name, string memory tokenUri)public payable {
       

        require(msg.value == price(name),"Not enough matic!!");
       
        uint currentTokenId = _tokenid.current();
        _mint(msg.sender,currentTokenId);
        _setTokenURI(currentTokenId,tokenUri);
        domains[name] = msg.sender;

    }
    function getAddress(string calldata name) public view returns(address){
        require(domains[name] != address(0),"You don't have a registered domain");
        return domains[name];
    }

    function setRecords(string calldata name,string calldata bio, uint  period, string calldata twitter)public{
        require(domains[name] == msg.sender ,"You don't have authority to set the records");
                _tokenid.increment();
        Record memory record= Record({
            bio : bio,
            start : block.timestamp,
            period :period,
            twitter :twitter,
            tokenId: _tokenid.current()
        });

        records[msg.sender] = record;

    }

    function getRecords(string calldata name) public view returns(Record memory){
        address owner = domains[name];
        return records[owner];
    }
}