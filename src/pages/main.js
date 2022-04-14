import React, { useEffect, useState } from 'react';
import Head from './Header';
import './main.css';
import {
    loadWeb3,
    loadAccount,
    loadFactory,
    loadCoin,
    loadGovernance
} from "../helpers/web3Functions";

const formatAddress = (address) => {
  return (address &&
    `${address.slice(0, 6)}...${address.slice(
      address.length - 4,
      address.length
    )}`)
}


const LandingPage = () => {
    const [account, setAccount] = useState("")

    const [address, setAddress] = useState("")
    const [ammount, setAmmount] = useState("")

    const [coinBalance, setCoinBalance] = useState(0)

    const [web3, setWeb3] = useState()

    //Contracts
    const [factory, setFactory] = useState("")
    const [Governance, setGovernance] = useState("")
    const [coin, setCoin] = useState("")


    const [status, setStatus] = useState(false)
    const [hasVoted, setVoted] = useState(false)
    const [currGovernance, setCurrGovernance] = useState("")

    const getCurrGovernance = async () => {
      const f = await factory.methods.getGovernance().call();
      setCurrGovernance(f)
    }

    const changeGovernance = async () => {
      await factory.methods.changeActive().send({from: account});
    }

    const transfer = async(receiver, ammount) => {
      coin.methods.transfer(receiver, web3.utils.toBN(ammount * 10 ** 18)).send({from: account});
    }

    const vote = async() => {
      const govern = await factory.methods.getGovernance().call();;
      const governance = await loadGovernance(web3, web3.eth.net.getId(), govern)
      governance.methods.vote().send({from : account});
    }

    const endVote = async() => {
      const govern = await factory.methods.getGovernance().call();;
      const governance = await loadGovernance(web3, web3.eth.net.getId(), govern)
      governance.methods.endVote().send({from : account});
    }

    const getStatus = async() => {
      const st = await factory.methods.getGovernanceStatus().call();
      setStatus(st)
    }

    const loadBlockchainData = async () => {
        var web3 = await loadWeb3();
        setWeb3(web3);
        const networkId = await web3.eth.net.getId()
        const acc = await loadAccount(web3);
        const factoryContract = await loadFactory(web3, networkId);
        if(!factoryContract) {
          window.alert('Smart contract not detected on the current network. Please select another network with Metamask.')
          return;
        }

        const governContractAddress = await factoryContract.methods.getGovernance().call();
        const governContract = await loadGovernance(web3, web3.eth.net.getId(), governContractAddress)
        if(!governContract) {
          window.alert('Smart contract not detected on the current network. Please select another network with Metamask.')
          return;
        }

        const voted = await governContract.methods.hasVoted(acc).call()
        setVoted(voted)

        const coinContractAddress = await factoryContract.methods.getToken().call();
        const currCointContract = await loadCoin(web3, web3.eth.net.getId(), coinContractAddress)
        if(!currCointContract) {
          window.alert('Smart contract not detected on the current network. Please select another network with Metamask.')
          return;
        }
        const bal = await currCointContract.methods.balanceOf(acc).call()
        setCoinBalance(bal)
       
        setAccount(acc);
        setFactory(factoryContract);
        setCoin(currCointContract);
      }
    useEffect(() => {
      loadBlockchainData();
    },[])

    return (
      <div>
        <Head />
        <body className='body'>
          <div className="center">
            <div className="col">
              <div className="row">
                <div>
                  <p className='title'>account:</p>
                  <div>{formatAddress(account)}</div>
                </div>
              </div>
              <div className="row">
                <div>
                  <p className='title'>Coin Balance</p>
                  <div>{parseInt(coinBalance)/10**18}</div>
                </div>
              </div>
                <div className="row">
                  <div>
                    <p className='title'>Contrato de votacao:</p> 
                    <div>{formatAddress(currGovernance)}</div>
                  </div>
                  <button className='btnGet' type='button' onClick={getCurrGovernance} >Get</button>
                </div>
                <div className="row">
                  <p className='title'> Trocar Votacao:</p>
                  <button className='btn' type="button" onClick={changeGovernance}>Submit</button>
                </div>
                <div className="row">
                  <p className='title'>Transfer</p>
                  <input placeholder='receiver' value={address} onChange = {(e) => setAddress(e.target.value)} />
                  <input placeholder='ammount' value={ammount} onChange = {(e) => setAmmount(e.target.value)} />
                  <button className='btn' type="button" onClick={() => transfer(address, ammount)}> transfer</button>
                </div>
                <div className="row">
                  <p className='title'> vote</p>
                  <div>{hasVoted ? "already voted" : "has not voted"}</div>
                  <button className='btn' type="button" onClick={vote}> vote</button>
                </div>
                <div className="row">
                  <p className='title'> vote status</p>
                  <p>status: {status ? "done" : "on going"}</p>
                  <button className='btn' type="button" onClick={getStatus}>get status</button>
                </div>

                <div className="row">
                  <p className='title'> end vote</p>
                  <button className='btn' type="button" onClick={endVote}>END</button>
                </div>
            </div>
          </div>
        </body>
      </div>
    )
}

export default LandingPage;