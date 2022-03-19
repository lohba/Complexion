//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";
import "hardhat/console.sol";


interface IRed {
    function mintWinner(address) external;
}
interface IBlue {
    function mintWinner(address) external;
}
interface IGreen {
    function mintWinner(address) external;
}
interface IYellow {
    function mintWinner(address) external;
}

contract GameLogic is PullPayment, ReentrancyGuard{
    uint256 public roundNumber = 1;
    uint256 public winningColor;
    uint256 public winningRound;
    uint256 public currentRoundPool;
    address public sidePotPool;
    uint256 public resetTime;
    uint256 public votersInRound;

    mapping(uint256 => NFT) public colorToNFT;
    //mapping(uint256 => bool) public winnerRound;
    //mapping(string => bool) public winnerColor;

    mapping(address => mapping(uint => Voter)) public roundToVoter; // address => round => Voter struct

    event Voted(address voter, uint256 price, uint256 roundNumber, uint256 color);

    constructor (
        address _red,
        address _blue,
        address _green,
        address _yellow
    ) {
        // _red = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
        // _blue = 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512;
        // _green = 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9;
        // _yellow = 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0;
        
        // references to other contracts
        redContract = IRed(_red);        
        blueContract = IBlue(_blue);
        greenContract = IGreen(_green);
        yellowContract = IYellow(_yellow);

        colorToNFT[1] = red;
        colorToNFT[2] = blue;
        colorToNFT[3] = green;
        colorToNFT[4] = yellow;
    }

    struct NFT {
        uint256 mintPrice;
        uint256 oldSupply;
        uint256 color;
        // address nftAddress;
    }

    NFT public red = NFT(0.1 ether, 0, 1);
    NFT public blue = NFT(0.1 ether, 0, 2);
    NFT public green = NFT(0.1 ether, 0, 3);
    NFT public yellow = NFT(0.1 ether, 0, 4);
    
    IRed public redContract;
    IBlue public blueContract;
    IGreen public greenContract;
    IYellow public yellowContract;

    struct Voter {
        bool voted;
        uint256 color;
        uint256 mintPrice;
        bool minted;
        bool claimedReward;
    }

    struct WinnerRound {
        Voter winner;
        NFT roundRedStatus;
        NFT roundBlueStatus;
        NFT roundGreenStatus;
        NFT roundYellowStatus;
    }

    // WinnerRound[] winners;
    // query give me winnerRound[1]

    function setPrice() internal pure {
        return;
    }

    // red = 1
    // blue = 2
    // green = 3
    // yellow = 4

    function voteForColor(uint256 _color) public payable {
        NFT storage currentNFT = colorToNFT[_color];

        // require timechecking based on reset time;
        require(roundToVoter[msg.sender][roundNumber].voted == false, "Already voted this round"); // check player hasn't voted this round);
        // update NFT supply
        currentNFT.oldSupply += 1;
        // assign color
        currentNFT.color = _color;
        // asign color to voter
        roundToVoter[msg.sender][roundNumber].color = _color;

        // get price
        uint256 price = (currentNFT.oldSupply <= 4) ? currentNFT.mintPrice
            : (currentNFT.oldSupply <= 7) ? currentNFT.mintPrice + 0.1 ether
            : (currentNFT.oldSupply  <= 9) ? currentNFT.mintPrice + 0.2 ether
            : currentNFT.mintPrice + 0.3 ether;

        // check value being sent for vote
        require(msg.value == price, "Insufficient amount");
        // assign price to mintPrice in struct
        currentNFT.mintPrice == price;
        roundToVoter[msg.sender][roundNumber].mintPrice = price;

        console.log("Price is ", price);
        console.log("Supply is ", currentNFT.oldSupply);
        console.log("Supply round number is ", roundNumber);

        // Calcualte distribution and send ETH to currentPool and sidePoool using PullPayment
        
        uint256 valueSentWhenVoting = msg.value * 90 / 100;
         _asyncTransfer(msg.sender, valueSentWhenVoting);
        // _asyncTransfer(sidePotPool, msg.value * 9 / 100);
        currentRoundPool += msg.value;
        // if the 10th NFT is minted there is a winning color
        if(currentNFT.oldSupply == 3) {
            winningRound = roundNumber;
            winningColor = currentNFT.color;
        }

        // update voted to true
        roundToVoter[msg.sender][roundNumber].voted = true;
        // count total voters for this round
        votersInRound += 1;
        // reset timer
        resetTime = block.timestamp + 86400;

        emit Voted(msg.sender, currentNFT.mintPrice, roundNumber, _color);
    }

    function redeemAll() public {
        withdrawPayments(payable (msg.sender));
    }

    // Winners from the round can claim round reward or mint NFT
    function claimReward() external payable nonReentrant {
        require(roundToVoter[msg.sender][winningRound].voted == true, "have to vote");
        require(roundToVoter[msg.sender][winningRound].color == winningColor, "have to be winning color");
        require(roundToVoter[msg.sender][winningRound].claimedReward == false, "Already claimed reward for this round");
        require(roundToVoter[msg.sender][winningRound].minted == false, "Already minted this round");
        // calculation for prize pool per voter based on voters in round
        console.log("currentRoundPool ", currentRoundPool);
        console.log("votersInRound ", votersInRound);
        console.log("amount ", (currentRoundPool - ((currentRoundPool / votersInRound) * 10))/10);
        _asyncTransfer(msg.sender, (currentRoundPool - ((currentRoundPool / votersInRound) * 10))/10);

        redeemAll();
        console.log("balance after redeemAll", msg.sender.balance);
        roundToVoter[msg.sender][winningRound].claimedReward = true;
    }

    function mintWinner() external payable nonReentrant {
        require(roundToVoter[msg.sender][winningRound].voted == true, "have to vote");
        require(roundToVoter[msg.sender][winningRound].color == winningColor, "have to be winning color");
        require(roundToVoter[msg.sender][winningRound].claimedReward == false, "Already claimed reward for this round");
        require(roundToVoter[msg.sender][winningRound].minted == false, "Already minted this round");
        
        roundToVoter[msg.sender][winningRound].color == 1 ? redContract.mintWinner(msg.sender) 
        : roundToVoter[msg.sender][winningRound].color == 2 ? blueContract.mintWinner(msg.sender) 
        : roundToVoter[msg.sender][winningRound].color == 3 ? greenContract.mintWinner(msg.sender) 
        : yellowContract.mintWinner(msg.sender);

        // have to know the amount sent
        // have to calculate the pool prize        
        roundToVoter[msg.sender][winningRound].minted = true;
    }

function reset() external {
        require(block.timestamp > resetTime, "Not yet ready");

        // WinnerRound[roundNumber] = (

        // );

        roundNumber += 1;
        // reset structs for all colors
        red.oldSupply = 0;
        red.mintPrice = 0.1 ether;
        blue.oldSupply = 0;
        blue.mintPrice = 0.1 ether;
        yellow.oldSupply = 0;
        yellow.mintPrice = 0.1 ether;
        green.oldSupply = 0;
        green.mintPrice = 0.1 ether;
    }
}




