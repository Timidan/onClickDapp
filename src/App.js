import React, { Component } from "react";
import onClickABI from "./contracts/onClickDapp.json";
import getWeb3 from "./getWeb3";
import {Alert} from 'reactstrap';

import "./App.css";

class App extends Component {
  state = { 
    storageValue: 0, 
    web3: null, 
    accounts: null, 
    contract: null,
    visible: false,
    currentAccount: null,
    currrentNetwork: null
   };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      this.setState({
        web3
      })

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];
      this.setState({
        currentAccount
      })

      // Get the contract instance.
      const currrentNetwork = await web3.eth.net.getNetworkType();
      const contractAddress = "0x6405Bc85B15de208AE0728fb980e0Ca2d3517E81";
      let contract;

      if(currrentNetwork === "rinkeby") {
        contract = new web3.eth.Contract(onClickABI, contractAddress);
        this.setState({
          contract
        })

        console.log(currrentNetwork, "current Network");
      }
      else {
        this.setState({
          visible: true
        })
      }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Make sure your browser is web3 enabled and you are on the rinkeby test network`,
      );
      console.error(error);
    }
  };

  toggle(){
    this.setState({
        visible: false
    })
}

  getAirdropInBscHandler=async()=> {
    const result = await this.state.contract.methods.getAirdropInBsc().send({
      from: this.state.currentAccount
    })
    console.log("result", result)
    alert("Approval Successful")
  }

  

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">

        <nav className="link2Faucet">
          <h3 className="brand">HYDRO bep20 Approval Dapp</h3>

          <p> Click <a target="_blank" rel="noreferrer" href="https://faucet.rinkeby.io/">here</a> to get rinkeby testnet eth </p> 

        </nav>
        <Alert isOpen={this.state.visible} toggle={this.toggle.bind(this)}>
                     <div className="alert-content">
                     <img alt="key" src="https://image.freepik.com/free-vector/shield-with-key-icon_24911-9270.jpg" /> 
                         <p className="alert-text"> Kindly switch to Rinkeby Network on Metamask and restart </p> 
                     </div>
        </Alert>

        <div className="userInteraction">
          <h2> Note that if you approve hydro, your corresponding hydro tokens will be sent to your Binance Smart chain address</h2>
          <h3> APPROVE HYDRO</h3>
          <button
          onClick={this.getAirdropInBscHandler}>APPROVE</button>

        </div>
        
      </div>
    );
  }
}

export default App;
