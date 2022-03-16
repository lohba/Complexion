import {ethers} from "ethers";
import contractAddresses from "../contracts/old-contracts-address.json";
import contractAddressesV2 from "../contracts/contracts-address.json";
import ColorsArtifactV1 from "../contracts/ColorsV1.json";
import ColorsArtifact from "../contracts/Colors.json";
import RentArtifact from "../contracts/Rent.json";
import NFTArtifact from "../contracts/Nft.json";
import PricesArtifact from "../contracts/Prices.json";
import getStore, {dispatch} from "../store/store";
import {setAddress, setWarn} from "../features/account/accountActions";
import {MetamaskService} from "./metamaskService";
import {
  setColorsContractProvider, setContractProvider,
  setContractProvider_Prices, setContractProvider_Rent,
  setEthersProvider
} from "../features/contract/contractActions";
import {IEthersWritePayable} from "../models/ethersTypes";
import {contractReducer} from "../features/contract";

export default class AccountService {

  constructor() {
  }


  static async initializeWallet() {

    const existProvider = await MetamaskService.existProvider();
    if (!existProvider) {
      return;
    }
    const ethereum = window.ethereum;
    console.log('ETHEREUM => ', ethereum);

    /**********************************************************/
    /* Handle chain (network) and chainChanged (per EIP-1193) */
    /**********************************************************/

    if (ethereum) {
      const chainId = await MetamaskService.requestChainId()
      console.log('CHAIN ID => ', chainId);
      handleChainChanged(chainId);
      ethereum.on('chainChanged', handleChainChanged);
    }

    function handleChainChanged(_chainId: string) {
      // We recommend reloading the page, unless you must do otherwise
      window.location.reload();
    }
  }

  static _initialize(userAddress: string) {

  }

  static async _intializeInyectedProvider() {
    // We first initialize ethers by creating a provider using window.ethereum
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // When, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    console.log("ETHERS: PROVIDER => ", provider);
    console.log("ETHERS: LAST BLOCK => ", await provider.getBlock('latest'));

    dispatch(setEthersProvider(provider))
  }

  static async _initializeEthersContract(provider: any) {
    // COLORS V1 CONTRACT
    const colorsV1 = new ethers.Contract(
      contractAddresses.Colors,
      ColorsArtifactV1.abi,
      provider.getSigner(0)
    );

    console.log("ETHERS: COLORS V1 CONTRACT PROVIDER => ", colorsV1);
    dispatch(setContractProvider(colorsV1, 'colorsV1Contract'));

    // COLORS v2 CONTRACT
    const colorsV2 = new ethers.Contract(
      contractAddressesV2.Colors,
      ColorsArtifact.abi,
      provider.getSigner(0)
    );

    console.log("ETHERS: COLORS CONTRACT PROVIDER => ", colorsV2);
    dispatch(setColorsContractProvider(colorsV2));


    // PRICES CONTRACT
    const prices = new ethers.Contract(
      contractAddresses.Prices,
      PricesArtifact.abi,
      provider.getSigner(0)
    );

    console.log("ETHERS: PRICES CONTRACT PROVIDER => ", prices);
    dispatch(setContractProvider_Prices(prices));


    // RENT CONTRACT
    const rent = new ethers.Contract(
      contractAddressesV2.Rent,
      RentArtifact.abi,
      provider.getSigner(0)
    );

    console.log("ETHERS: RENT CONTRACT PROVIDER => ", rent);
    dispatch(setContractProvider_Rent(rent));

    // FLASH CONTRACT
/*    const flash = new ethers.Contract(
      contractAddresses.Flash,
      FlashArtifact.abi,
      provider.getSigner(0)
    );

    console.log("ETHERS: FLASH CONTRACT PROVIDER => ", rent);
    dispatch(setContractProvider(flash, 'flashContract'));*/


    // NFT AUCTION
    const nftAuctionAddrr = "0x438626ba0a4776CF5d27581bDFB03B9633DC0A92";
    const nft = new ethers.Contract(
      ethers.utils.getAddress(nftAuctionAddrr),
      NFTArtifact.abi,
      provider
    );

    console.log("ETHERS: NFT CONTRACT PROVIDER => ", nft);
    dispatch(setContractProvider(nft, 'nftContract'));
  }


  static async _connectWallet() {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.enable();
    console.log('_connectWallet ADDRESS => ', selectedAddress);

    // Once we have the address, we can initialize the application.

    // First we check the network
/*
    if (!MetamaskService._checkIfLocalNetwork()) {
      return;
    }
*/

    // This method initializes the dapp

    // We first store the user's address in the component's state
    dispatch(setAddress(selectedAddress))

    // Then, we initialize ethers, fetch the token's data, and start polling
    // for the user's balance.

    // Fetching the token data and the user's balance are specific to this
    // sample project, but you can reuse the same initialization pattern.
    // await this._intializeInyectedProvider();
    // await this._initializeEthersContract();

    // MetamaskService.onAccountChanged()
    // MetamaskService.onChainIdChange()
    // MetamaskService.onNetworkChange()
  }

  // Ethers payable tx
  // https://docs.ethers.io/v5/api/contract/contract/#Contract--write
  static async doPayableTransaction(
    {
      functionName: functionName,
      contract: contract,
      valueArgs: valueArgs,
      overrides: overrides
    }: IEthersWritePayable
  ) {

    if (!contract) {
      throw new Error('Not available contract ethers')
    }
    console.log(contract);
    // We send the transaction, and save its hash in the Dapp's state. This
    // way we can indicate that we are waiting for it to be mined.

    console.log("PAYABLE TRANSACTION NAME", functionName);
    console.log("PAYABLE TRANSACTION VALUES", valueArgs);
    console.log("PAYABLE TRANSACTION OVERRIDES", overrides);

    let options = {
      from: window.ethereum.selectedAddress,
      value: overrides.value,
    };

    let elements;
    if (overrides) {
      elements = [...valueArgs, overrides]
    } else {
      elements = [...valueArgs]
    }

/*    console.log("DATA", ...elements);

    const gasPrice = await contract.estimateGas[functionName](...elements);
    console.log("ESTIMATED GAS => ", gasPrice);*/

    // To send an specific ammount you have to add the overrides to the function calling the contract.
    const tx = await contract[functionName](
      ...elements
    );

    console.log("TRANSACTION_METADA => ", tx);

    return tx;
  }
}
