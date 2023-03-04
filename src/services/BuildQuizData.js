//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
//
//  Services
//
import rowCrud from './../utilities/rowCrud'
import randomSort from './../utilities/randomSort'
//
//  Constants
//
const functionName = 'BuildQuizData'
//
// Debug Settings
//
const debugLog = debugSettings()
const debugModule = 'BuildQuizData'
//...................................................................................
//.  Main Line
//...................................................................................
export default function BuildQuizData(props) {
  if (debugLog) console.log(debugModule)
  //
  //  Signed in User
  //
  const User_Set_User = JSON.parse(sessionStorage.getItem('User_Set_User'))
  const MaxQuestions = User_Set_User.u_dftmaxquestions
  //
  //  Function Variables
  //
  let Pg_Qz_Questions_Quiz = []
  let Pg_Qz_Questions_qid = []
  let Pg_Qz_Questions_qidString = ''
  //
  //  Deconstruct props
  //
  if (debugLog) console.log('props', props)
  const { SqlString_Q } = props
  //
  //  Reset the Data
  //
  sessionStorage.setItem('Pg_Qz_Reset', true)
  sessionStorage.setItem('Pg_Qz_Questions_R', false)
  sessionStorage.setItem('Pg_Qz_Bidding_R', false)
  sessionStorage.setItem('Pg_Qz_Hands_R', false)
  sessionStorage.setItem('Pg_Qz_All_R', false)

  sessionStorage.setItem('Pg_Qz_Questions', [])
  sessionStorage.setItem('Pg_Qz_Bidding', [])
  sessionStorage.setItem('Pg_Qz_Hands', [])

  sessionStorage.setItem('Pg_Qz_Questions_Quiz', [])
  sessionStorage.setItem('Pg_Qz_Questions_Quiz_Count', 0)
  sessionStorage.setItem('Pg_Qz_Questions_qid', [])
  //
  //  Load data
  //
  LoadServerQuestions()
  //...................................................................................
  //.  Load Server - Questions
  //...................................................................................
  function LoadServerQuestions() {
    if (debugLog) console.log('LoadServerQuestions')
    //
    //  Selection
    //
    let sqlString = SqlString_Q
    if (debugLog) console.log('sqlString ', sqlString)
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'post',
      sqlCaller: functionName,
      sqlTable: 'questions',
      sqlAction: 'SELECTSQL',
      sqlString: sqlString
    }
    const myPromiseQuestions = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseQuestions.then(function (rtnObj) {
      if (debugLog) console.log('rtnObj ', rtnObj)
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Data
      //
      const Pg_Qz_Questions = rtnObj.rtnRows
      //
      //  Session Storage
      //
      if (debugLog) console.log('Pg_Qz_Questions ', Pg_Qz_Questions)
      sessionStorage.setItem('Pg_Qz_Questions', JSON.stringify(Pg_Qz_Questions))
      sessionStorage.setItem('Pg_Qz_Questions_R', true)
      //
      //  No Questions
      //
      if (!Pg_Qz_Questions[0]) {
        sessionStorage.setItem('Pg_Qz_All_R', true)
        return
      }
      //
      //  Store Owner/group
      //
      const row1 = Pg_Qz_Questions[0]
      sessionStorage.setItem('Pg_Qz_Owner', JSON.stringify(row1.qowner))
      sessionStorage.setItem('Pg_Qz_OwnerGroup', JSON.stringify(row1.qgroup))
      //
      //  Output Pg_Qz_Questions_Quiz
      //
      QuestionsSortMax(Pg_Qz_Questions)
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
  //.  Output Pg_Qz_Questions_Quiz
  //...................................................................................
  function QuestionsSortMax(Pg_Qz_Questions) {
    if (debugLog) console.log('QuestionsSortMax')
    //
    //  Random sort questions
    //
    const SortQuestions = User_Set_User.u_sortquestions
    SortQuestions
      ? (Pg_Qz_Questions_Quiz = randomSort(Pg_Qz_Questions))
      : (Pg_Qz_Questions_Quiz = Pg_Qz_Questions)
    //
    //  Apply max number
    //
    if (Pg_Qz_Questions_Quiz.length > MaxQuestions) {
      let i = Pg_Qz_Questions_Quiz.length - 1
      for (i; i >= MaxQuestions; i--) {
        Pg_Qz_Questions_Quiz.pop()
      }
    }
    //
    //  Question IDs & Refs
    //
    if (debugLog) console.log('Pg_Qz_Questions_Quiz ', Pg_Qz_Questions_Quiz)
    for (let i = 0; i < Pg_Qz_Questions_Quiz.length; i++) {
      Pg_Qz_Questions_qid.push(Pg_Qz_Questions_Quiz[i].qid)
    }
    if (debugLog) console.log('Pg_Qz_Questions_qid ', Pg_Qz_Questions_qid)
    //
    //  String version of ID
    //
    Pg_Qz_Questions_qidString = Pg_Qz_Questions_qid.toString()
    if (debugLog) console.log('Pg_Qz_Questions_qidString ', Pg_Qz_Questions_qidString)
    //
    //  Session Storage
    //
    sessionStorage.setItem('Pg_Qz_Questions_Quiz', JSON.stringify(Pg_Qz_Questions_Quiz))
    sessionStorage.setItem(
      'Pg_Qz_Questions_Quiz_Count',
      JSON.stringify(Pg_Qz_Questions_Quiz.length)
    )
    sessionStorage.setItem('Pg_Qz_Questions_qid', JSON.stringify(Pg_Qz_Questions_qid))
  }
  //...................................................................................
  //.  Load Server - Bidding
  //...................................................................................
  function LoadServerBidding() {
    if (debugLog) console.log('LoadServerBidding')
    //
    //  Selection
    //
    let sqlString = `* from bidding where bid in (${Pg_Qz_Questions_qidString}) order by bid`
    if (debugLog) console.log('sqlString', sqlString)
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'post',
      sqlCaller: functionName,
      sqlTable: 'bidding',
      sqlAction: 'SELECTSQL',
      sqlString: sqlString
    }
    const myPromiseBidding = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseBidding.then(function (rtnObj) {
      if (debugLog) console.log('rtnObj ', rtnObj)
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Data
      //
      const Pg_Qz_Bidding = rtnObj.rtnRows
      //
      //  Session Storage
      //
      if (debugLog) console.log('Pg_Qz_Bidding ', Pg_Qz_Bidding)
      sessionStorage.setItem('Pg_Qz_Bidding', JSON.stringify(Pg_Qz_Bidding))
      sessionStorage.setItem('Pg_Qz_Bidding_R', true)
      //
      //  All Data Received ?
      //
      CheckAllData()
      return
    })

    return
  }
  //...................................................................................
  //.  Load Server - Hands
  //...................................................................................
  function LoadServerHands() {
    if (debugLog) console.log('LoadServerHands')
    //
    //  Selection
    //
    let sqlString = `* from hands where hid in (${Pg_Qz_Questions_qidString}) order by hid`
    if (debugLog) console.log('sqlString', sqlString)
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'post',
      sqlCaller: functionName,
      sqlTable: 'hands',
      sqlAction: 'SELECTSQL',
      sqlString: sqlString
    }
    const myPromiseHands = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseHands.then(function (rtnObj) {
      if (debugLog) console.log('rtnObj ', rtnObj)
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
      if (debugLog) console.log('Pg_Qz_Hands ', Pg_Qz_Hands)
      sessionStorage.setItem('Pg_Qz_Hands', JSON.stringify(Pg_Qz_Hands))
      sessionStorage.setItem('Pg_Qz_Hands_R', true)
      //
      //  All Data Received ?
      //
      CheckAllData()
      return
    })

    return
  }
  //...................................................................................
  //.  All Data Received ?
  //...................................................................................
  function CheckAllData() {
    if (debugLog) console.log('CheckAllData')
    //
    //  Data received, end wait
    //
    const Pg_Qz_Questions_R = JSON.parse(sessionStorage.getItem('Pg_Qz_Questions_R'))
    const Pg_Qz_Bidding_R = JSON.parse(sessionStorage.getItem('Pg_Qz_Bidding_R'))
    const Pg_Qz_Hands_R = JSON.parse(sessionStorage.getItem('Pg_Qz_Hands_R'))
    //
    //  All data received
    //
    if (Pg_Qz_Questions_R && Pg_Qz_Bidding_R && Pg_Qz_Hands_R) {
      if (debugLog) console.log('All DATA received')
      sessionStorage.setItem('Pg_Qz_All_R', true)
    }
  }
  //...................................................................................
}
