import React, { useState, useEffect } from "react";
import cx from "classnames";
import styles from "./core.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { cleanTxState, submitPayableTx } from "../../features/transaction/transactionActions";
import { ethers } from "ethers";
import { getGameLogicContractProvider } from "../../features/contract/contractReducers";

type ICoreProps = {}

const defaultProps = {};


type teamData = {
  color: number
  mintPrice: string
  oldSupply: number
}

const Core: React.FC<ICoreProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const gameLogicContract = useSelector(getGameLogicContractProvider);

  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    getTeamsData();
  }, [gameLogicContract]);

  const getTeamsData = async () => {
    if (!gameLogicContract) {
      return;
    }
    // red = 1
    // blue = 2
    // green = 3
    // yellow = 4
    let teams = [];
    const indexes = [1,2,3,4]
    for (const index of indexes) {
      const teamData = await gameLogicContract.colorToNFT(index);
      console.log('TEAM INDEX => ',index, teamData);

      const team = {
        color: parseInt(teamData.color.toString()),
        mintPrice: ethers.utils.formatEther(teamData.mintPrice.toString()),
        oldSupply: parseInt(teamData.oldSupply.toString())
      };
      teams.push(team);
    }
    console.log(teams);
    setTeams(teams);
  };

  const vote = (color, price) => {
    dispatch(cleanTxState());
    dispatch(submitPayableTx(
      {
        functionName: "voteForColor",
        valueArgs: [
          color
        ],
        overrides: {
          // the value could be a number, or a
          value: ethers.utils.parseEther(price)
        },
        name: "Vote",
        contract: gameLogicContract
      }
    ));
  };

  const teamStack = (data: teamData, index: number) => {
    const list = Array.from(Array(data.oldSupply).keys());
    return <div key={index} className={"relative flex flex-col h-32 w-36"}>
      {Array.from(Array(data.oldSupply).keys()).map((red, i) => {
        return (
          <section key={data.oldSupply}>
            <div
              style={{
                bottom: 30 * i,
                backgroundColor: index === 0 ? "#F16161" :
                  index === 1 ? "#66B1DC" :
                    index === 2 ? "#7FEFAC" :
                      index === 3 ? "#F9E958" :
                        "white"
              }}
              className={cx("flex items-center justify-center shadow absolute h-32 w-32 rounded", styles.layer)}
            >
              <h2 className={"text-4xl"}>
                {data.oldSupply}
              </h2>
            </div>
          </section>);
      })}

      <button
        onClick={() => {
          vote(index + 1, data.mintPrice);
        }}
        className={"hover:shadow border text-grey-400 tracking-wide border-8 rounded-lg bg-white absolute -bottom-28 w-32 h-12 items-center flex justify-center"}>
        <h2 className={"text-gray-400 hover:text-gray-800"}>Join team</h2>
      </button>
    </div>;
  };

  return (
    <section className={"relative flex justify-center items-center h-screen w-screen bg-slate-200"}>
      <div className="max-w-screen-md w-full flex items-center justify-between">
        {teams.map((team, i) => teamStack(team, i))}
      </div>
    </section>
  );
};

Core.defaultProps = defaultProps;

export default Core;
