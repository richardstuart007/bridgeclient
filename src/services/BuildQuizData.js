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
const debugFunStart = false
const debugModule = 'BuildQuizData'
//...................................................................................
//.  Main Line
//...................................................................................
export default function BuildQuizData(props) {
  if (debugFunStart) console.log(debugModule)
  //
  //  Signed in User
  //
  const User_Data_User = JSON.parse(sessionStorage.getItem('User_Data_User'))
  const MaxQuestions = User_Data_User.u_dftmaxquestions
  //
  //  Function Variables
  //
  let Pages_Quiz_Questions_Quiz = []
  let Pages_Quiz_Questions_qid = []
  let Pages_Quiz_Questions_qidString = ''
  //
  //  Deconstruct props
  //
  if (debugLog) console.log('props', props)
  const { SqlString_Q } = props
  //
  //  Reset the Data
  //
  sessionStorage.setItem('Pages_Quiz_Questions_Received', false)
  sessionStorage.setItem('Pages_Quiz_Bidding_Received', false)
  sessionStorage.setItem('Pages_Quiz_Hands_Received', false)
  sessionStorage.setItem('BuildQuizData_Received', false)

  sessionStorage.setItem('Pages_Quiz_Questions', [])
  sessionStorage.setItem('Pages_Quiz_Bidding', [])
  sessionStorage.setItem('Pages_Quiz_Hands', [])

  sessionStorage.setItem('Pages_Quiz_Questions_Quiz', [])
  sessionStorage.setItem('Pages_Quiz_Questions_Quiz_Count', 0)
  sessionStorage.setItem('Pages_Quiz_Questions_qid', [])
  //
  //  Load data
  //
  LoadServerQuestions()
  //...................................................................................
  //.  Load Server - Questions
  //...................................................................................
  function LoadServerQuestions() {
    if (debugFunStart) console.log('LoadServerQuestions')
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
      const Pages_Quiz_Questions = rtnObj.rtnRows
      //
      //  Session Storage
      //
      if (debugLog) console.log('Pages_Quiz_Questions ', Pages_Quiz_Questions)
      sessionStorage.setItem('Pages_Quiz_Questions', JSON.stringify(Pages_Quiz_Questions))
      sessionStorage.setItem('Pages_Quiz_Questions_Received', true)
      //
      //  No Questions
      //
      if (!Pages_Quiz_Questions[0]) {
        sessionStorage.setItem('BuildQuizData_Received', true)
        return
      }
      //
      //  Store Owner/group
      //
      const row1 = Pages_Quiz_Questions[0]
      sessionStorage.setItem('Pages_Quiz_Owner', JSON.stringify(row1.qowner))
      sessionStorage.setItem('Pages_Quiz_OwnerGroup', JSON.stringify(row1.qgroup))
      //
      //  Output Pages_Quiz_Questions_Quiz
      //
      QuestionsSortMax(Pages_Quiz_Questions)
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
  //.  Output Pages_Quiz_Questions_Quiz
  //...................................................................................
  function QuestionsSortMax(Pages_Quiz_Questions) {
    if (debugFunStart) console.log('QuestionsSortMax')
    //
    //  Random sort questions
    //
    const SortQuestions = User_Data_User.u_sortquestions
    SortQuestions
      ? (Pages_Quiz_Questions_Quiz = randomSort(Pages_Quiz_Questions))
      : (Pages_Quiz_Questions_Quiz = Pages_Quiz_Questions)
    //
    //  Apply max number
    //
    if (Pages_Quiz_Questions_Quiz.length > MaxQuestions) {
      let i = Pages_Quiz_Questions_Quiz.length - 1
      for (i; i >= MaxQuestions; i--) {
        Pages_Quiz_Questions_Quiz.pop()
      }
    }
    //
    //  Question IDs & Refs
    //
    if (debugLog) console.log('Pages_Quiz_Questions_Quiz ', Pages_Quiz_Questions_Quiz)
    for (let i = 0; i < Pages_Quiz_Questions_Quiz.length; i++) {
      Pages_Quiz_Questions_qid.push(Pages_Quiz_Questions_Quiz[i].qid)
    }
    if (debugLog) console.log('Pages_Quiz_Questions_qid ', Pages_Quiz_Questions_qid)
    //
    //  String version of ID
    //
    Pages_Quiz_Questions_qidString = Pages_Quiz_Questions_qid.toString()
    if (debugLog) console.log('Pages_Quiz_Questions_qidString ', Pages_Quiz_Questions_qidString)
    //
    //  Session Storage
    //
    sessionStorage.setItem('Pages_Quiz_Questions_Quiz', JSON.stringify(Pages_Quiz_Questions_Quiz))
    sessionStorage.setItem(
      'Pages_Quiz_Questions_Quiz_Count',
      JSON.stringify(Pages_Quiz_Questions_Quiz.length)
    )
    sessionStorage.setItem('Pages_Quiz_Questions_qid', JSON.stringify(Pages_Quiz_Questions_qid))
  }
  //...................................................................................
  //.  Load Server - Bidding
  //...................................................................................
  function LoadServerBidding() {
    if (debugFunStart) console.log('LoadServerBidding')
    //
    //  Selection
    //
    let sqlString = `* from bidding where bid in (${Pages_Quiz_Questions_qidString}) order by bid`
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
      const Pages_Quiz_Bidding = rtnObj.rtnRows
      //
      //  Session Storage
      //
      if (debugLog) console.log('Pages_Quiz_Bidding ', Pages_Quiz_Bidding)
      sessionStorage.setItem('Pages_Quiz_Bidding', JSON.stringify(Pages_Quiz_Bidding))
      sessionStorage.setItem('Pages_Quiz_Bidding_Received', true)
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
    if (debugFunStart) console.log('LoadServerHands')
    //
    //  Selection
    //
    let sqlString = `* from hands where hid in (${Pages_Quiz_Questions_qidString}) order by hid`
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
      const Pages_Quiz_Hands = rtnObj.rtnRows
      //
      //  Session Storage
      //
      if (debugLog) console.log('Pages_Quiz_Hands ', Pages_Quiz_Hands)
      sessionStorage.setItem('Pages_Quiz_Hands', JSON.stringify(Pages_Quiz_Hands))
      sessionStorage.setItem('Pages_Quiz_Hands_Received', true)
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
    if (debugFunStart) console.log('CheckAllData')
    //
    //  Data received, end wait
    //
    const Pages_Quiz_Questions_Received = JSON.parse(
      sessionStorage.getItem('Pages_Quiz_Questions_Received')
    )
    const Pages_Quiz_Bidding_Received = JSON.parse(
      sessionStorage.getItem('Pages_Quiz_Bidding_Received')
    )
    const Pages_Quiz_Hands_Received = JSON.parse(
      sessionStorage.getItem('Pages_Quiz_Hands_Received')
    )
    //
    //  All data received
    //
    if (Pages_Quiz_Questions_Received && Pages_Quiz_Bidding_Received && Pages_Quiz_Hands_Received) {
      if (debugLog) console.log('All DATA received')
      sessionStorage.setItem('BuildQuizData_Received', true)
    }
  }
  //...................................................................................
}
