import { useState } from "react";
import { ethers } from "ethers";
// Import ABI Code to interact with smart contract
import cctAbi from "./contracts/CrossChainToken.json";

// The contract address
const sepoliaContractAddress = "0x98fF74B788aaddf98f3af977960eC50fE0aA2831";
const goerliContractAddress = "0xF726e94AfA1603a2f9917004F4515E2903b0fede";

function App() {
  const [balance, setBalance] = useState(0)
  const [contractAddress, setContractAddress] = useState(goerliContractAddress)

  // Requests access to the user's Meta Mask Account
  // https://metamask.io/
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // Fetches account balance
  async function fetchBalance() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        cctAbi,
        provider
      );
      const account = (await provider.getSigner().getAddress()).toString();
      console.log("Account: ", account);
      try {
        const data = (await contract.balanceOf(account)).toString();
        console.log("data: ", data);
        setBalance(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  // Cross chain transfer of a certain amount of tokens
  async function transfer(amount) {
    if (!amount) return;

    console.log("Transfer amount: ", amount);

    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(contractAddress, cctAbi, signer);
      const transaction = await contract.bridge(amount, {value: ethers.utils.parseUnits("12345678", "gwei")});

      await transaction.wait();
      fetchBalance();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    await transfer(event.target.amountInput.value)
    event.target.amountInput.value = ""
  }

  function handleChange(event) {
    console.log("contractAddress: ", event.target.value)
    setContractAddress(event.target.value)
    setBalance(0)
  }

  return (
    <div className="w-full max-w-lg container">
      <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4">
        <div className="text-gray-600 font-bold text-lg mb-2">
          <select onChange={event => handleChange(event)}>
              <option value={goerliContractAddress}>Goerli</option>
              <option value={sepoliaContractAddress}>Sepolia</option>
          </select>
        </div>
        <div className="w-full border-4 p-2 mb-4 rounded border-gray-400">
          <div className="text-gray-600 font-bold text-md mb-2">
            Fetch Account Balance From Smart Contract
          </div>
          <div className="flex ">
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={fetchBalance}
              >Fetch balance</button>
          </div>
        </div>
        <div className="w-full border-4 p-2 mb-4 rounded border-gray-400">
          <div className="text-gray-600 font-bold text-md mb-2">
            Cross Chain Transfer
          </div>
          <form 
            className="flex items-center justify-between"
            onSubmit={event=>handleSubmit(event)}
          >
            <input
             className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none"
             name="amountInput"
              />
              <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Transfer</button>
          </form>
        </div>
        <div className="w-full border-4 p-2 mb-4 rounded border-gray-400 bg-gray-100">
          <div className="text-gray-600 font-bold text-md mb-2">
            Account balance
          </div>
          <p>
            {balance}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
