import React, { useState, useEffect } from "react";
import cx from "classnames";
import styles from "./core.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { cleanTxState, submitPayableTx } from "../../features/transaction/transactionActions";
import { ethers } from "ethers";
import { getGameLogicContractProvider } from "../../features/contract/contractReducers";

type ICoreProps = {}

const defaultProps = {};

const Core: React.FC<ICoreProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const gameLogicContract = useSelector(getGameLogicContractProvider)

  const [red, setRed] = useState(4);
  const [blue, setBlue] = useState(2);
  const [yellow, setYellow] = useState(7);
  const [green, setGreen] = useState(9);
  const [teams, setTeams] = useState([red, blue, yellow, green]);

  useEffect(() => {

  }, []);

  const vote = (color) => {
    dispatch(cleanTxState());
    dispatch(submitPayableTx(
      {
        functionName: "voteForColor",
        valueArgs: [
          color
        ],
        overrides: {
          // the value could be a number, or a
          value: ethers.utils.parseEther(String(0.01))
        },
        name: "Vote",
        contract: gameLogicContract
      }
    ));
  };

  const teamStack = (data, index) => {
    return <div className={"relative flex flex-col h-32 w-36"}>
      {Array.from(Array(data).keys()).map((red, i) => {
        return (
          <section>
            <div
              style={{
                bottom: 30 * i,
                backgroundColor: index === 0 ? "#F16161" :
                  index === 1 ? "#7FEFAC" :
                    index === 2 ? "#66B1DC" :
                      index === 3 ? "#F9E958" :
                        "white"
              }}
              className={cx("shadow absolute h-32 w-32 rounded", styles.layer)}
            >
              {/*red*/}
            </div>
          </section>);
      })}

      <button
        onClick={() => {
          vote(index);
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
