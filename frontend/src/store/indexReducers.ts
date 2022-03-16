import {combineReducers} from 'redux'
import {accountReducer} from '../features/account/';
import {contractReducer} from "../features/contract";
import {pixelsReducer} from "../features/pixels";
import { transactionReducer } from '../features/transaction';

const rootState = {
  accountReducer,
  contractReducer,
  transactionReducer,
  pixelsReducer
}

const rootReducer = combineReducers(rootState)

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;

console.log('REDUCERS LOADED')
