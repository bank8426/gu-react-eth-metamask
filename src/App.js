import React, { Component } from 'react'
import Web3 from 'web3';
import {PublicAddress,Flex,Box, Button,Input,Field,MetaMaskButton,Form} from 'rimble-ui';
import ConnectionBanner from '@rimble/connection-banner';
import NetworkIndicator from '@rimble/network-indicator';

const tokenContractAddress='0x24C259595C0f6273eA7076309E71FEd529580F3d'
const ABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "delegate",
				"type": "address"
			},
			{
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "to",
				"type": "address"
			},
			{
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "owner",
				"type": "address"
			},
			{
				"name": "buyer",
				"type": "address"
			},
			{
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "totalSupply",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "owner",
				"type": "address"
			},
			{
				"name": "delegate",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "version",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]
class App extends Component {
  
  state = {
    contract:'',
    userAddress: '',
    userBalance:'',
    sendToAddress:'',
    sendAmount:0,
    currentNetworkId:0,
    requiredNetworkId: 4,
    isConnect: false,
    isMetaMaskInstalled:false,
    afterMount:false
  }

  async componentDidMount(){
    // console.log( window.ethereum)
    // console.log( window.web3)
    if (typeof window.ethereum !== 'undefined') {
      const isConnect = await window.ethereum._metamask.isUnlocked()
      const isMetaMaskInstalled = window.ethereum.isMetaMask

      this.setState({isConnect,isMetaMaskInstalled})

      if(isConnect){
        await this.connectMetaMask()
      }
    }
    else{
      console.log("not connect yet")
    }
    this.setState({afterMount : true})
  }

  async connectMetaMask() {
    await window.ethereum.enable();
    this.w3 = new Web3(window.ethereum)
    console.log(ABI)
    this.contract = new this.w3.eth.Contract(ABI,tokenContractAddress)
    const userAddress = (await this.w3.eth.getAccounts())[0]
    const userBalance = await this.contract.methods.balanceOf(userAddress).call()
    const currentNetworkId = await this.w3.eth.net.getId();
    const isConnect = await window.ethereum._metamask.isUnlocked()
    
    this.setState({userAddress,userBalance,currentNetworkId,isConnect})
  }

  onChangeReceiverAddress(e){
    this.setState({sendToAddress : e.target.value})
  }

  onChangeReceiverAmount(e){
    this.setState({sendAmount : e.target.value})
  }

  async onSendTransaction(e){
    e.preventDefault();
    const result = await this.contract.methods
      .transfer(this.state.sendToAddress,this.state.sendAmount)
      .send({from:this.state.userAddress})
    console.log(result)
  }

  render() {
    return (
      <div className="App">
        
        <Box px={30} pt={10} width={[1,1,0.5]} mx={'auto'}>
          { this.state.afterMount ?
            <ConnectionBanner currentNetwork={this.state.currentNetworkId} requiredNetwork={this.state.requiredNetworkId} onWeb3Fallback={!this.state.isMetaMaskInstalled}/>
            : <></> 
          }

          <Flex >
            <Box width={1/2}>
              <NetworkIndicator currentNetwork={this.state.currentNetworkId} requiredNetwork={this.state.requiredNetworkId} />
            </Box>
            <Box width={1/2}>
              {this.state.isMetaMaskInstalled && !this.state.isConnect ? 
                <MetaMaskButton width={1} onClick={() => {this.connectMetaMask()}}>Connect with Metamask</MetaMaskButton>
                : 
                <></> 
              }
            </Box>
          </Flex>

          <Flex pt={10}>
            <Box width={1/2}>
              <PublicAddress address={this.state.userAddress} label="Your address"/>  
            </Box>
            <Box width={1/2}>
              <Field label="Your Amount" width={1}>
                <Input type="text" value={this.state.userBalance} width={1} disabled required />  
              </Field>
            </Box>
          </Flex>

          <Form onSubmit={ (e) => { this.onSendTransaction(e)}}>
            <Form.Field label="To" width={1}>
              <Form.Input
                type="text" 
                required
                width={1}
                placeholder="e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A"
                onChange={(e) => this.onChangeReceiverAddress(e)}
              />
            </Form.Field>

            <Form.Field label="Amount" width={1}>
              <Form.Input
                type="number" 
                required
                width={1}
                placeholder="e.g. 123"
                onChange={(e) => this.onChangeReceiverAmount(e)}
                max={this.state.userBalance}
              />
            </Form.Field>
            
            <Button icon="Send" mr={3} type="submit" width={1}>Send</Button>
          </Form>
        </Box>
      </div>
    );
  }
}

export default App;
