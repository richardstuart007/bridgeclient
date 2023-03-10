//
//  Services
//
import rowCrud from './../utilities/rowCrud'
import randomSort from './../utilities/randomSort'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'BuildQuizData'
//
//  Global Variables
//
let MaxQuestions
let Pg_Qz_Q_All = []
let Pg_Qz_Q_qid = []
let Pg_Qz_Q_qidString = ''
let SqlString_Q
let User_User
//...................................................................................
//.  Main Line
//...................................................................................
export default function BuildQuizData(props) {
  //
  //  Try
  //
  try {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
    //
    //  Signed in User
    //
    User_User = JSON.parse(sessionStorage.getItem('User_User'))
    MaxQuestions = User_User.u_dftmaxquestions
    //
    //  Deconstruct props
    //
    if (debugLog) console.log(consoleLogTime(debugModule, 'props'), props)
    SqlString_Q = props.SqlString_Q
    //
    //  Reset the Data
    //
    sessionStorage.setItem('Pg_Qz_CatchMessage', '')
    sessionStorage.setItem('Pg_Qz_Reset', true)
    sessionStorage.setItem('Pg_Qz_Q_R', false)
    sessionStorage.setItem('Pg_Qz_Bid_Rcv', false)
    sessionStorage.setItem('Pg_Qz_Hands_Rcv', false)
    sessionStorage.setItem('Pg_Qz_All_Rcv', false)

    sessionStorage.setItem('Pg_Qz_Q', [])
    sessionStorage.setItem('Pg_Qz_Bid', [])
    sessionStorage.setItem('Pg_Qz_Hands', [])

    sessionStorage.setItem('Pg_Qz_Q_All', [])
    sessionStorage.setItem('Pg_Qz_Q_All_Cnt', 0)
    sessionStorage.setItem('Pg_Qz_Q_qid', [])
    //
    //  Load data
    //
    LoadServerQuestions()
  } catch (e) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))

    console.log(e)
  } finally {
    if (debugLog) console.log(consoleLogTime(debugModule, 'End'))
  }
  //...................................................................................
  //.  Load Server - Questions
  //...................................................................................
  function LoadServerQuestions() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'LoadServerQuestions'))
    //
    //  Selection
    //
    let sqlString = SqlString_Q
    if (debugLog) console.log(consoleLogTime(debugModule, 'sqlString ', sqlString))
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'post',
      sqlCaller: debugModule,
      sqlTable: 'questions',
      sqlAction: 'SELECTSQL',
      sqlString: sqlString
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
        const rtnCatchMsg = rtnObj.rtnCatchMsg
        sessionStorage.setItem('Pg_Qz_CatchMessage', JSON.stringify(rtnCatchMsg))
        return
      }
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Data
      //
      const Pg_Qz_Q = rtnObj.rtnRows
      //
      //  Session Storage
      //
      if (debugLog) console.log(consoleLogTime(debugModule, 'Pg_Qz_Q ', Pg_Qz_Q))
      sessionStorage.setItem('Pg_Qz_Q', JSON.stringify(Pg_Qz_Q))
      sessionStorage.setItem('Pg_Qz_Q_R', true)
      //
      //  No Questions
      //
      if (!Pg_Qz_Q[0]) {
        sessionStorage.setItem('Pg_Qz_All_Rcv', true)
        return
      }
      //
      //  Store Owner/group
      //
      const row1 = Pg_Qz_Q[0]
      sessionStorage.setItem('Pg_Qz_Owner', JSON.stringify(row1.qowner))
      sessionStorage.setItem('Pg_Qz_OwnerGroup', JSON.stringify(row1.qgroup))
      //
      //  Output Pg_Qz_Q_All
      //
      QuestionsSortMax(Pg_Qz_Q)
      //
      //  Load related
      //
      LoadServerBidding()
      LoadServerHands()
      return
    })

    return myPromiseQuestions
  }
  //...................................................................................
  //.  Output Pg_Qz_Q_All
  //...................................................................................
  function QuestionsSortMax(Pg_Qz_Q) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'QuestionsSortMax'))
    //
    //  Random sort questions
    //
    const SortQuestions = User_User.u_sortquestions
    SortQuestions ? (Pg_Qz_Q_All = randomSort(Pg_Qz_Q)) : (Pg_Qz_Q_All = Pg_Qz_Q)
    //
    //  Apply max number
    //
    if (Pg_Qz_Q_All.length > MaxQuestions) {
      let i = Pg_Qz_Q_All.length - 1
      for (i; i >= MaxQuestions; i--) {
        Pg_Qz_Q_All.pop()
      }
    }
    //
    //  Question IDs & Refs
    //
    if (debugLog) console.log(consoleLogTime(debugModule, 'Pg_Qz_Q_All ', Pg_Qz_Q_All))
    Pg_Qz_Q_qid = []
    for (let i = 0; i < Pg_Qz_Q_All.length; i++) {
      Pg_Qz_Q_qid.push(Pg_Qz_Q_All[i].qid)
    }
    //
    //  Order by question id
    //
    Pg_Qz_Q_qid.sort()
    if (debugLog) console.log(consoleLogTime(debugModule, 'Pg_Qz_Q_qid ', Pg_Qz_Q_qid))
    //
    //  String version of ID
    //
    Pg_Qz_Q_qidString = Pg_Qz_Q_qid.toString()
    if (debugLog) console.log(consoleLogTime(debugModule, 'Pg_Qz_Q_qidString ', Pg_Qz_Q_qidString))
    //
    //  Session Storage
    //
    sessionStorage.setItem('Pg_Qz_Q_All', JSON.stringify(Pg_Qz_Q_All))
    sessionStorage.setItem('Pg_Qz_Q_All_Cnt', JSON.stringify(Pg_Qz_Q_All.length))
    sessionStorage.setItem('Pg_Qz_Q_qid', JSON.stringify(Pg_Qz_Q_qid))
  }
  //...................................................................................
  //.  Load Server - Bidding
  //...................................................................................
  function LoadServerBidding() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'LoadServerBidding'))
    //
    //  Selection
    //
    let sqlString = `* from bidding where bid in (${Pg_Qz_Q_qidString})`
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
      if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj '), rtnObj)
      //
      //  Catch Error
      //
      if (rtnObj.rtnCatch) {
        const rtnCatchMsg = rtnObj.rtnCatchMsg
        sessionStorage.setItem('Pg_Qz_CatchMessage', JSON.stringify(rtnCatchMsg))
        return
      }
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Data
      //
      const Pg_Qz_Bid = rtnObj.rtnRows
      //
      //  Session Storage
      //
      if (debugLog) console.log(consoleLogTime(debugModule, 'Pg_Qz_Bid ', Pg_Qz_Bid))
      sessionStorage.setItem('Pg_Qz_Bid', JSON.stringify(Pg_Qz_Bid))
      sessionStorage.setItem('Pg_Qz_Bid_Rcv', true)
      //
      //  All Data Received ?
      //
      CheckAllData()
      return
    })
    return myPromiseBidding
  }
  //...................................................................................
  //.  Load Server - Hands
  //...................................................................................
  function LoadServerHands() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'LoadServerHands'))
    //
    //  Selection
    //
    let sqlString = `* from hands where hid in (${Pg_Qz_Q_qidString})`
    if (debugLog) console.log(consoleLogTime(debugModule, 'sqlString', sqlString))
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'post',
      sqlCaller: debugModule,
      sqlTable: 'hands',
      sqlAction: 'SELECTSQL',
      sqlString: sqlString
    }
    const myPromiseHands = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseHands.then(function (rtnObj) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj '), rtnObj)
      //
      //  Catch Error
      //
      if (rtnObj.rtnCatch) {
        const rtnCatchMsg = rtnObj.rtnCatchMsg
        sessionStorage.setItem('Pg_Qz_CatchMessage', JSON.stringify(rtnCatchMsg))
        return
      }
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Data
      //
      const Pg_Qz_Hands = rtnObj.rtnRows
      //
      //  Session Storage
      //
      if (debugLog) console.log(consoleLogTime(debugModule, 'Pg_Qz_Hands ', Pg_Qz_Hands))
      sessionStorage.setItem('Pg_Qz_Hands', JSON.stringify(Pg_Qz_Hands))
      sessionStorage.setItem('Pg_Qz_Hands_Rcv', true)
      //
      //  All Data Received ?
      //
      CheckAllData()
      return
    })

    return myPromiseHands
  }
  //...................................................................................
  //.  All Data Received ?
  //...................................................................................
  function CheckAllData() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'CheckAllData'))
    //
    //  Data received, end wait
    //
    const Pg_Qz_Q_R = JSON.parse(sessionStorage.getItem('Pg_Qz_Q_R'))
    const Pg_Qz_Bid_Rcv = JSON.parse(sessionStorage.getItem('Pg_Qz_Bid_Rcv'))
    const Pg_Qz_Hands_Rcv = JSON.parse(sessionStorage.getItem('Pg_Qz_Hands_Rcv'))
    //
    //  All data received
    //
    if (Pg_Qz_Q_R && Pg_Qz_Bid_Rcv && Pg_Qz_Hands_Rcv) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'All DATA received'))
      sessionStorage.setItem('Pg_Qz_All_Rcv', true)
    }
  }
  //...................................................................................
}
