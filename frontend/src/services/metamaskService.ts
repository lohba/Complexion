1import detectEthereumProvider from "@metamask/detect-provider";
import {dispatch} from "../store/store";
import {setAddress, setChainId, setProvider, setWarn} from "../features/account/accountActions";
import AccountService from "./accountService";

export class MetamaskService {
  constructor() {
  }

  static async existProvider() {
    const provider = await detectEthereumProvider();
    if (provider && window.ethereum && provider === window.ethereum) {
      // If the provider returned by detectEthereumProvider is not the same as
      // window.ethereum, something is overwriting it, perhaps another wallet.
      console.log('Ethereum provider working => ', window.ethereum);
      dispatch(setProvider(window.ethereum))
      return "metamask";
      // Access the decentralized web!
    } else if (provider && provider !== window.ethereum) {
      // TODO: SHOW metamask warn
      console.error('Do you have multiple wallets installed?');
      return "multiple";
    } else {
      // TODO: SHOW metamask warn
      console.log('Please install MetaMask!');
      return null;
    }
  }

  static async checkAddress() {
    let address;
    const existProvider = await this.existProvider();
    if (existProvider !== "metamask") {
      return null;
    }

    if (!!window && window.ethereum) {
      address = window.ethereum.request({method: 'eth_chainId'});
    }

    return !!address ? address : null;
  }

  static onAccountChanged() {
    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]: any) => {
      // this._stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state
      console.log("ACCOUNT CHANGED => ", newAddress)
      if (newAddress === undefined) {
        dispatch(setAddress(undefined))
      }

      dispatch(setAddress(newAddress))
      AccountService._initialize(newAddress);
    });
  }

  static onNetworkChange() {
    // We reset the dapp state if the network is changed
    window.ethereum.on("networkChanged", ([networkId]: any) => {
      // this._stopPollingData();
      // this._resetState();
      console.log("NETWORK CHANGED => ", networkId)
      dispatch(setWarn('networkChanged ' + networkId))
    });
  }

  static onChainIdChange() {
    window.ethereum.on('chainChanged', (chainId: string) => {
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have good reason not to.
      console.log('NEW CHAIN CHANGED => ', chainId)
      dispatch(setChainId(chainId))

      window.location.reload();
    });
  }

  static async requestChainId() {
    return await window.ethereum.request({method: 'eth_chainId'});
  }

  // This method checks if Metamask selected network is Localhost:8545
  static _checkIfLocalNetwork() {
    console.log('CONECTION NETWORK => ',window.ethereum.networkVersion)
    if (window.ethereum.networkVersion === process.env.REACT_APP_HARDHAT_NETWORK_ID) {
      return true;
    }

    dispatch(setWarn('Please connect Metamask to Localhost:8545'))
    return false;
  }
}
