import './App.css'
import { Web3 } from 'web3';
import {  useCallback, useMemo, useState } from 'react';
import { createWeb3Modal, defaultConfig,useWeb3ModalAccount,useWeb3ModalProvider } from 'web3modal-web3js/react'
import Lock from '../artifacts/contracts/Lock.sol/Lock.json'

const web3Config = defaultConfig({
  metadata: {
    name: 'Web3Modal',
    description: 'Web3Modal Laboratory',
    url: 'https://web3modal.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  },
  defaultChainId: 1,
  rpcUrl: 'https://cloudflare-eth.com',
});
const chains = [
  {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com',
  },
  {
    chainId: 42161,
    name: 'Arbitrum',
    currency: 'ETH',
    explorerUrl: 'https://arbiscan.io',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
  },
  {
    chainId: 31337,
    name: 'ETH-LOCAL',
    currency: 'ETH-LOCAL',
    explorerUrl: 'https://127.0.0.1:8545',
    rpcUrl: 'http://127.0.0.1:8545',
  }
];
createWeb3Modal({
  web3Config,
  chains,
  projectId: '76804fd6127cc3b85f7d749c4e53700f'
});
function App() {
  const {  chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider(); 

  const [smartContractName, setSmartContractName] = useState(''); // useState to handle 
  const [balance,setBalance] = useState(0);
  const web3 = useMemo(() => {
    if (!walletProvider) {
      return null;
    }
    return new Web3({
      provider: walletProvider,
      config: { defaultNetworkId: chainId },
    });
  }, [walletProvider, chainId]);

  const contract = useMemo(() => {
    if (!web3) {
      return null;
    }
    return new web3.eth.Contract(Lock.abi,"0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");
  }, [web3]);

  const getContactInfo = useCallback( async () => {
    const name = (await contract.methods.name().call()) as string;
    setSmartContractName(name);
  }, [contract]);

  const getBalance = useCallback( async () => {
    const accounts = await web3.eth.getAccounts();
    console.log(accounts)
    const balance = (await contract.methods.getbalance().call()) as number;
    setBalance(balance);
  }, [contract]);

  return (
    <>
      {!isConnected && (
        <p> Please connect your wallet</p>
      )}
      <w3m-button />
      <div className="card"> 
        <button  onClick={getContactInfo}>
          getContactInfo
        </button> 
        <p> the contract name: {smartContractName} </p>
      </div>
      <div>
        <ul>
          <li>
            <button onClick={getBalance}>
              get now balance
            </button>
            <span> balance: 0 </span>
          </li>
          <li>
             <button>
              pay to another address
            </button>
            <input type="text" placeholder="address" />
          </li>
        </ul>
      </div>
    </>
  )
}

export default App
