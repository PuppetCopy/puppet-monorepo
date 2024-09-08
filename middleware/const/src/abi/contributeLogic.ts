export default [{ "inputs": [{ "internalType": "contract IAuthority", "name": "_authority", "type": "address" }, { "internalType": "contract EventEmitter", "name": "_eventEmitter", "type": "address" }, { "internalType": "contract IERC20Mintable", "name": "_rewardToken", "type": "address" }, { "internalType": "contract ContributeStore", "name": "_store", "type": "address" }, { "components": [{ "internalType": "uint256", "name": "baselineEmissionRate", "type": "uint256" }], "internalType": "struct ContributeLogic.Config", "name": "_config", "type": "tuple" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "Auth_Unauthorized", "type": "error" }, { "inputs": [{ "internalType": "uint256", "name": "accruedReward", "type": "uint256" }], "name": "ContributeLogic__InsufficientClaimableReward", "type": "error" }, { "inputs": [], "name": "ContributeLogic__InvalidBuybackToken", "type": "error" }, { "inputs": [], "name": "InvalidShortString", "type": "error" }, { "inputs": [], "name": "MathOverflowedMulDiv", "type": "error" }, { "inputs": [{ "internalType": "string", "name": "str", "type": "string" }], "name": "StringTooLong", "type": "error" }, { "anonymous": false, "inputs": [], "name": "EIP712DomainChanged", "type": "event" }, { "inputs": [], "name": "authority", "outputs": [{ "internalType": "contract IAuthority", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "address", "name": "depositor", "type": "address" }, { "internalType": "address", "name": "receiver", "type": "address" }, { "internalType": "uint256", "name": "revenueAmount", "type": "uint256" }], "name": "buyback", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "signatureHash", "type": "bytes4" }, { "internalType": "address", "name": "user", "type": "address" }], "name": "canCall", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "contract IERC20[]", "name": "tokenList", "type": "address[]" }, { "internalType": "address", "name": "user", "type": "address" }, { "internalType": "address", "name": "receiver", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "claim", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "config", "outputs": [{ "internalType": "uint256", "name": "baselineEmissionRate", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "eip712Domain", "outputs": [{ "internalType": "bytes1", "name": "fields", "type": "bytes1" }, { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "version", "type": "string" }, { "internalType": "uint256", "name": "chainId", "type": "uint256" }, { "internalType": "address", "name": "verifyingContract", "type": "address" }, { "internalType": "bytes32", "name": "salt", "type": "bytes32" }, { "internalType": "uint256[]", "name": "extensions", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "contract IERC20[]", "name": "tokenList", "type": "address[]" }, { "internalType": "address", "name": "user", "type": "address" }], "name": "getClaimable", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "contract IERC20[]", "name": "tokenList", "type": "address[]" }, { "internalType": "address", "name": "user", "type": "address" }], "name": "getCursorRewardList", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "signatureHash", "type": "bytes4" }, { "internalType": "address", "name": "", "type": "address" }], "name": "permissionMap", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "functionSig", "type": "bytes4" }, { "internalType": "address", "name": "user", "type": "address" }], "name": "removePermission", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "rewardToken", "outputs": [{ "internalType": "contract IERC20Mintable", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "setBuybackQuote", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "uint256", "name": "baselineEmissionRate", "type": "uint256" }], "internalType": "struct ContributeLogic.Config", "name": "_config", "type": "tuple" }], "name": "setConfig", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "functionSig", "type": "bytes4" }, { "internalType": "address", "name": "user", "type": "address" }], "name": "setPermission", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "store", "outputs": [{ "internalType": "contract ContributeStore", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }] as const