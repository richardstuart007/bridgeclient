//
//  Services
//
import randomSort from '../utilities/randomSort'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
const debugLog = debugSettings(true)
const debugModule = 'buildQuizData'
//
//  Global Variables
//
let User_User
let MaxQuestions
let Pg_Qz_Q_Flt = []
let Pg_Qz_Q_Flt_qid = []
let Pg_Qz_Bid
let Pg_Qz_Hands
//...................................................................................
//.  Main Line
//...................................................................................
export default function buildQuizData(props) {
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
    const { p_owner, p_group } = props
    //
    //  Store Owner/group
    //
    sessionStorage.setItem('Pg_Qz_Owner', JSON.stringify(p_owner))
    sessionStorage.setItem('Pg_Qz_OwnerGroup', JSON.stringify(p_group))
    //
    //  Reset the Data
    //
    sessionStorage.setItem('Pg_Qz_CatchMessage', '')
    sessionStorage.setItem('Pg_Qz_Reset', true)
    sessionStorage.setItem('Pg_Qz_Bid', [])
    sessionStorage.setItem('Pg_Qz_Hands', [])
    sessionStorage.setItem('Pg_Qz_Q_Flt', [])
    sessionStorage.setItem('Pg_Qz_Q_Flt_Cnt', 0)
    sessionStorage.setItem('Pg_Qz_Q_Flt_qid', [])
    //
    //  Load data
    //
    LoadServerQuestions(p_owner, p_group)
  } catch (e) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
    console.log(e)
  }
  //...................................................................................
  //.  Load Server - Questions
  //...................................................................................
  function LoadServerQuestions(p_owner, p_group) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'LoadServerQuestions'))
    //
    //  Question Data
    //
    const User_Q = JSON.parse(sessionStorage.getItem('User_Q'))
    //
    //  Filter Owner/group
    //
    const User_Q_Flt = User_Q.filter(x => x.qowner === p_owner && x.qgroup === p_group)
    //
    //  Output Pg_Qz_Q_Flt
    //
    QuestionsSortMax(User_Q_Flt)
    //
    //  Load related Bids
    //
    const User_Bid = JSON.parse(sessionStorage.getItem('User_Bid'))
    Pg_Qz_Bid = User_Bid.filter(x => Pg_Qz_Q_Flt_qid.includes(x.bid))
    sessionStorage.setItem('Pg_Qz_Bid', JSON.stringify(Pg_Qz_Bid))
    //
    //  Load related Hands
    //
    const User_Hands = JSON.parse(sessionStorage.getItem('User_Hands'))
    Pg_Qz_Hands = User_Hands.filter(x => Pg_Qz_Q_Flt_qid.includes(x.hid))
    sessionStorage.setItem('Pg_Qz_Hands', JSON.stringify(Pg_Qz_Hands))
  }
  //...................................................................................
  //.  Output Pg_Qz_Q_Flt
  //...................................................................................
  function QuestionsSortMax(User_Q_Flt) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'QuestionsSortMax'))
    //
    //  Random sort questions
    //
    const SortQuestions = User_User.u_sortquestions
    SortQuestions ? (Pg_Qz_Q_Flt = randomSort(User_Q_Flt)) : (Pg_Qz_Q_Flt = User_Q_Flt)
    //
    //  Apply max number
    //
    if (Pg_Qz_Q_Flt.length > MaxQuestions) {
      let i = Pg_Qz_Q_Flt.length - 1
      for (i; i >= MaxQuestions; i--) {
        Pg_Qz_Q_Flt.pop()
      }
    }
    //
    //  Question IDs
    //
    if (debugLog) console.log(consoleLogTime(debugModule, 'Pg_Qz_Q_Flt '), Pg_Qz_Q_Flt)
    Pg_Qz_Q_Flt_qid = []
    for (let i = 0; i < Pg_Qz_Q_Flt.length; i++) {
      Pg_Qz_Q_Flt_qid.push(Pg_Qz_Q_Flt[i].qid)
    }
    //
    //  Order by question id
    //
    Pg_Qz_Q_Flt_qid.sort()
    if (debugLog) console.log(consoleLogTime(debugModule, 'Pg_Qz_Q_Flt_qid '), Pg_Qz_Q_Flt_qid)
    //
    //  Session Storage
    //
    sessionStorage.setItem('Pg_Qz_Q_Flt', JSON.stringify(Pg_Qz_Q_Flt))
    sessionStorage.setItem('Pg_Qz_Q_Flt_Cnt', JSON.stringify(Pg_Qz_Q_Flt.length))
    sessionStorage.setItem('Pg_Qz_Q_Flt_qid', JSON.stringify(Pg_Qz_Q_Flt_qid))
  }
  //...................................................................................
}
