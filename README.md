# Revenue Service

Service to get data from Revenue Share Smart Contracts & to build Merkle Trees to Claim Revenues

## NFT's

###  Get User NFT's

Used to get all the user revenues NFT's.

**URL** : `http://3.83.53.59:3000/user/:userAddress`

**Method**: `GET`

#### Success response

**Code** : `200`

**Content example** :
```json
{
	"nfts": [
		{
			"project": "0x59fCcFbE3511B0f1286D54935258cB93AcC18E81",
			"nft": [
				{
					"id": "4",
					"createAt": "1647633060",
					"locked": "60",
					"amount": "3000000000000000000000000"
				}
			]
		}
	]
}
```

###  Get Project NFT's

Used to get all the project revenues NFT's.

**URL** : `http://3.83.53.59:3000/user/:projectAddress`

**Method**: `GET`

#### Success response

**Code** : `200`

**Content example** :
```json
{
	"blockNfts": {
		"blockNumber": 30529544,
		"timestamp": 1647836916,
		"nfts": [
			{
				"id": "1",
				"createAt": "1647028940",
				"locked": "150",
				"amount": "500"
			},
			{
				"id": "2",
				"createAt": "1647173964",
				"locked": "90",
				"amount": "900000000000000000000"
			}
		]
	}
}
```

###  Get one Project NFT Data.

Used to get one project revenue NFT data.

**URL** : `http://3.83.53.59:3000/nft/:projectAddress/:id`

**Method**: `GET`

#### Success response

**Code** : `200`

**Content example** :
```json
{
	"nft": {
		"owner": "0x3771eEf3E76329ac4c17962A158A895545795C0d",
		"id": "1",
		"createAt": "1647028940",
		"locked": "150",
		"amount": "500"
	}
}
```

## Merkle Tree
Leaf: [tokendID, Reward]

###  Create Merkle Tree

Used to create a merkle tree for a project revenue.

**URL** : `http://3.83.53.59:3000/merkle/:projectAddress`

**Method**: `GET`

#### Success response

**Code** : `200`

**Content example** :
```json
{
	"timestamp": 1647834356,
	"root": "0xf64c714407751dc53d46721368a1eea28a4a5f743dcf950c1f89d37abef03951"
}
```

###  Create Merkle Tree with Fixed Block

Used to create a merkle tree for a project revenue with a fixed block number.

**URL** : `http://3.83.53.59:3000/merkle/:projectAddress/:block`

**Method**: `GET`

#### Success response

**Code** : `200`

**Content example** :
```json
{
	"timestamp": 1647283048,
	"root": "0xf7ef633174b85e75057540eb3327f2e8ac96f14c500afbec1cd7591140f45a95"
}
```

###  Get The Proof to Claim your Reward

Used to get the proof for a NFT project and fixed block.

**URL** : `http://3.83.53.59:3000/merkle/:projectAddress/:block/:id`

**Method**: `GET`

#### Success response

**Code** : `200`

**Content example** :
```json
{
	"nftProof": {
		"reward": "637499",
		"leaf": "0x8517960fc9af703a8bad67f2976faaecc8092fc1d5e5f86f46c9864f14bb4061",
		"proof": [
			"0x92114cfccd49adb565db81acdc74b0b85e505c9d4343012202f038e9794d7598",
			"0xb88b53f8c0d46c7bd6b218967eff96a38c35b3f1025e3678ec9e044abb61c740"
		]
	}
}
```
## Claim Rewards

###  Get all the Rewards ready to Claim for ab User

Used to get the proof for a NFT project and fixed block.

**URL** : `http://3.83.53.59:3000/claim/:userAddress`

**Method**: `GET`

#### Success response

**Code** : `200`

**Content example** :
```json
{
	"claims": [
		{
			"project": "0x59fCcFbE3511B0f1286D54935258cB93AcC18E81",
			"nftId": "1",
			"revenues": [
				{
					"contract": "0x78A808Cf328CF313b97e1f3eB0A8b7514Df7704e",
					"blockNumber": 30480688,
					"token": {
						"symbol": "AAVE",
						"revenue": "400000000000000000000000"
					}
				}
			]
		}
	]
}
```

###  Get all the Rewards ready to Claim for one NFT

Used to get the proof for a NFT project and fixed block.

**URL** : `http://3.83.53.59:3000/claim/:projectAddress/:nftId`

**Method**: `GET`

#### Success response

**Code** : `200`

**Content example** :
```json
{
	"claims": [
		{
			"contract": "0x78A808Cf328CF313b97e1f3eB0A8b7514Df7704e",
			"blockNumber": 30480688,
			"token": {
				"symbol": "AAVE",
				"revenue": "400000000000000000000000"
			}
		}
	]
}
```