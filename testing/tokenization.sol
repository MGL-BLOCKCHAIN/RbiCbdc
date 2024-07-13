// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AES256EncryptionZKP {
    struct EncryptedData {
        bytes encryptedAmount;
        bytes32 zkpHash;
    }

    mapping(address => EncryptedData) private encryptedDataMap;

    function storeEncryptedAmount(bytes memory encryptedAmount, bytes32 zkpHash) public {
        encryptedDataMap[msg.sender] = EncryptedData(encryptedAmount, zkpHash);
    }

    function getEncryptedAmount() public view returns (bytes memory, bytes32) {
        EncryptedData memory data = encryptedDataMap[msg.sender];
        return (data.encryptedAmount, data.zkpHash);
    }
}
