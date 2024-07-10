const express = require('express');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');
const crypto = require('crypto');
const app = express();
const cors = require('cors');
app.use(cors());

app.use(bodyParser.json());

const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/ieKltUTO99WB-tFYz6IlH6odf_t8pei5');
const tokenizationContractAddress = '0x6C29753bD2FF6c058E460cBB90BeFd8B3c88A33c';
const tokenizationABI = [
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "token",
                "type": "bytes32"
            }
        ],
        "name": "getData",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "tokenizeData",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Create a signer using a private key (you should keep this key secure)
const privateKey = '6a9e9bb1f9cc6ae80a7bb6d89c88ccf85dccf7c7ac41a3863a35ca7adba90170';
const wallet = new ethers.Wallet(privateKey, provider);
const tokenizationContract = new ethers.Contract(tokenizationContractAddress, tokenizationABI, wallet);

app.post('/tokenize', async (req, res) => {
    const { data } = req.body;
    const token = crypto.createHash('sha256').update(data + Date.now().toString()).digest('hex');
    const encodedData = ethers.hexlify(ethers.toUtf8Bytes(data));

    try {
        const tx = await tokenizationContract.tokenizeData(encodedData);
        await tx.wait();
        res.send({ token });
    } catch (error) {
        console.error('Error tokenizing data:', error);
        res.status(500).send({ error: 'Failed to tokenize data' });
    }
});

app.post('/verifyZKP', (req, res) => {
    const { proof, token } = req.body;
    // Implement ZKP verification logic
    // This is a placeholder, replace with actual ZKP verification logic
    const isValid = true;
    res.send({ isValid });
});

app.listen(4000, () => {
    console.log('Server running on port 3000');
});
