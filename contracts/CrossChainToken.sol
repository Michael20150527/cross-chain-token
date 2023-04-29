// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;

import "https://github.com/LayerZero-Labs/solidity-examples/blob/main/contracts/lzApp/NonblockingLzApp.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/*
    LayerZero Sepolia
      lzChainId:10161 lzEndpoint:0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1
      contract: 0x98fF74B788aaddf98f3af977960eC50fE0aA2831
    LayerZero Goerli
      lzChainId:10121 lzEndpoint:0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23
      contract: 0xF726e94AfA1603a2f9917004F4515E2903b0fede
*/

contract CrossChainToken is NonblockingLzApp, ERC20 {
    uint16 destChainId;
    
    // When just deploying, mint a certain number of tokens for the owner
    constructor(address _lzEndpoint) NonblockingLzApp(_lzEndpoint) ERC20("Cross Chain Token", "CCT") {
        if (_lzEndpoint == 0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1) destChainId = 10121;
        if (_lzEndpoint == 0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23) destChainId = 10161;
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // Contract receives transfer account and transfer amount on another testing chain
    // Add "toAddress" balance by amount token
    function _nonblockingLzReceive(uint16, bytes memory, uint64, bytes memory _payload) internal override {
       (address toAddress, uint amount) = abi.decode(_payload, (address,uint));
       _mint(toAddress, amount);
    }

    // Reduce balance by _amount token
    // Send transfer account and transfer amount to the contract on another testing chain
    function bridge(uint _amount) public payable {
        _burn(msg.sender, _amount);
        bytes memory payload = abi.encode(msg.sender, _amount);
        _lzSend(destChainId, payload, payable(msg.sender), address(0x0), bytes(""), msg.value);
    }

    // Set trusted address
    function trustAddress(address _remoteContract) public onlyOwner {
        trustedRemoteLookup[destChainId] = abi.encodePacked(_remoteContract, address(this));   
    }
}