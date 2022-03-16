import {combineEpics, Epic} from 'redux-observable'

const rootEpic = combineEpics(
)

console.log('EPICS LOADED');
export default rootEpic
