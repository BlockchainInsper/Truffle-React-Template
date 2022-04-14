import GovernanceFactory from '../abis/GovernanceFactory.json';

import Coin from '../abis/Coin.json';

import TokenGovernance from '../abis/TokenGovernance.json';

var Web3 = require('web3');


export const loadWeb3 = async () => {
    if(typeof window.ethereum!=='undefined'){
      return new Web3(window.ethereum)
    } else {
      window.alert('Please install MetaMask')
      window.location.assign("https://metamask.io/")
    }
}

export const loadAccount = async (web3) => {
    const accounts = await web3.eth.getAccounts()
    const account = await accounts[0]
    if(typeof account !== 'undefined'){
      return account
    } else {
      window.alert('Please login with MetaMask')
      return null
    }
}

export const loadFactory = async (web3, networkId) => {
    try {
      return new web3.eth.Contract(GovernanceFactory.abi, GovernanceFactory.networks[networkId].address)
    } catch (error) {
      console.log('Contract not deployed to the current network. Please select another network with Metamask.')
      return null
    }
}

export const loadCoin = async (web3, networkId, address) => {
  try {
    return new web3.eth.Contract(Coin.abi, address)
  } catch (error) {
    console.log('Contract not deployed to the current network. Please select another network with Metamask.')
    return null
  }
}

export const loadGovernance = async (web3, networkId, address) => {
  try {
    return new web3.eth.Contract(TokenGovernance.abi, address)
  } catch (error) {
    console.log(error)
    console.log('Contract not deployed to the current network. Please select another network with Metamask.')
    return null
  }
}