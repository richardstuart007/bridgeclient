//
//  Services
//
import rowCrud from '../utilities/rowCrud'
import writeUsersSessions from '../services/writeUsersSessions'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'buildDataUser'
//
//  Global Variables
//
let User_Q = []
let User_Qid = []
let User_QidString = ''
let User_Bid = []
let User_Hands = []
const { DFT_TIMEOUT } = require('../services/constants.js')
//...................................................................................
//.  Main Line
//...................................................................................
export default function buildDataUser() {
  //
  //  Try
  //
  try {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
    //
    //  Allocate a new session
    //
    writeUsersSessions()
    //
    //  Reset the Data
    //
    sessionStorage.setItem('User_Q', JSON.stringify(User_Q))
    sessionStorage.setItem('User_Qid', JSON.stringify(User_Qid))
    sessionStorage.setItem('User_Bid', JSON.stringify(User_Bid))
    sessionStorage.setItem('User_Hands', JSON.stringify(User_Hands))
    //
    //  Load data
    //
    LoadServerQuestions()
  } catch (e) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
    console.log(e)
  }
  //...................................................................................
  //.  Load Server - Questions
  //...................................................................................
  function LoadServerQuestions() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'LoadServerQuestions'))
    //
    //  SqlString
    //
    const OwnersString = JSON.parse(sessionStorage.getItem('User_OwnersString'))
    const SqlString = `* from questions where qowner in (${OwnersString})`
    if (debugLog) console.log(consoleLogTime(debugModule, 'SqlString ', SqlString))
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'post',
      sqlCaller: debugModule,
      sqlTable: 'questions',
      sqlAction: 'SELECTSQL',
      sqlString: SqlString
    }
    const myPromiseQuestions = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseQuestions.then(function (rtnObj) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj '), rtnObj)
      //
      //  Catch Error
      //
      if (rtnObj.rtnCatch) {
        return
      }
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Data
      //
      User_Q = rtnObj.rtnRows
      //
      //  Session Storage
      //
      if (debugLog) console.log(consoleLogTime(debugModule, 'User_Q ', User_Q))
      sessionStorage.setItem('User_Q', JSON.stringify(User_Q))
      //
      //  No Questions
      //
      if (!User_Q[0]) {
        return
      }
      //
      //  Get Qids
      //
      getQid()
      //
      //  Load related
      //
      LoadServerBidding()
      LoadServerHands()
      return
    })

    return
  }
  //...................................................................................
  //.  Output User_Q
  //...................................................................................
  function getQid() {
    //
    //  Question IDs
    //
    User_Qid = []
    for (let i = 0; i < User_Q.length; i++) {
      User_Qid.push(User_Q[i].qid)
    }
    //
    //  Order by question id
    //
    User_Qid.sort()
    if (debugLog) console.log(consoleLogTime(debugModule, 'User_Qid ', User_Qid))
    //
    //  String version of ID
    //
    User_QidString = User_Qid.toString()
    if (debugLog) console.log(consoleLogTime(debugModule, 'User_QidString ', User_QidString))
    //
    //  Session Storage
    //
    sessionStorage.setItem('User_Qid', JSON.stringify(User_Qid))
  }
  //...................................................................................
  //.  Load Server - Bidding
  //...................................................................................
  function LoadServerBidding() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'LoadServerBidding'))
    //
    //  Selection
    //
    let sqlString = `* from bidding where bid in (${User_QidString})`
    if (debugLog) console.log(consoleLogTime(debugModule, 'sqlString', sqlString))
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'post',
      sqlCaller: debugModule,
      sqlTable: 'bidding',
      sqlAction: 'SELECTSQL',
      sqlString: sqlString
    }
    const myPromiseBidding = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseBidding.then(function (rtnObj) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj '), { ...rtnObj })
      //
      //  Catch Error
      //
      if (rtnObj.rtnCatch) {
        return
      }
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Data
      //
      User_Bid = rtnObj.rtnRows
      if (debugLog) console.log(consoleLogTime(debugModule, 'User_Bid '), [...User_Bid])
      User_Bid.sort()
      //
      //  Session Storage
      //
      if (debugLog) console.log(consoleLogTime(debugModule, 'User_Bid '), [...User_Bid])
      sessionStorage.setItem('User_Bid', JSON.stringify(User_Bid))
      return
    })
    return
  }
  //...................................................................................
  //.  Load Server - Hands
  //...................................................................................
  function LoadServerHands() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'LoadServerHands'))
    //
    //  Selection
    //
    let sqlString = `* from hands where hid in (${User_QidString})`
    if (debugLog) console.log(consoleLogTime(debugModule, 'sqlString', sqlString))
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'post',
      sqlCaller: debugModule,
      sqlTable: 'hands',
      sqlAction: 'SELECTSQL',
      sqlString: sqlString,
      timeout: DFT_TIMEOUT
    }
    const myPromiseHands = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseHands.then(function (rtnObj) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj '), { ...rtnObj })
      //
      //  Catch Error
      //
      if (rtnObj.rtnCatch) {
        return
      }
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Data
      //
      User_Hands = rtnObj.rtnRows
      if (debugLog) console.log(consoleLogTime(debugModule, 'User_Hands '), [...User_Hands])
      User_Hands.sort()
      //
      //  Session Storage
      //
      if (debugLog) console.log(consoleLogTime(debugModule, 'User_Hands '), [...User_Hands])
      sessionStorage.setItem('User_Hands', JSON.stringify(User_Hands))
      return
    })

    return
  }
}
