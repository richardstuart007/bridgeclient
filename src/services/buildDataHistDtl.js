//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'buildDataHistDtl'
//
//  Global Variables
//
let Pg_Qz_Q_Flt_qqid = []
let Pg_Qz_Bid = []
let Pg_Qz_Hands = []
//...................................................................................
//.  Main Line
//...................................................................................
export default function buildDataHistDtl(row) {
  //
  //  Try
  //
  try {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
    //
    //  Reset the Data
    //
    sessionStorage.setItem('Pg_Qz_CatchMessage', '')
    sessionStorage.setItem('Pg_Qz_Q_Flt', [])
    sessionStorage.setItem('Pg_Qz_Bid', [])
    sessionStorage.setItem('Pg_Qz_Hands', [])
    //
    //  Question Data
    //
    const User_Q = JSON.parse(sessionStorage.getItem('User_Q'))
    //
    //  Filter QIDs
    //
    const p_qqid = row.r_qid
    const Pg_Qz_Q_Flt = User_Q.filter(x => p_qqid.includes(x.qqid))
    //
    //  Question IDs
    //
    Pg_Qz_Q_Flt_qqid = []
    for (let i = 0; i < Pg_Qz_Q_Flt.length; i++) {
      Pg_Qz_Q_Flt_qqid.push(Pg_Qz_Q_Flt[i].qqid)
    }
    //
    //  Load related Bids
    //
    const User_Bid = JSON.parse(sessionStorage.getItem('User_Bid'))
    Pg_Qz_Bid = User_Bid.filter(x => Pg_Qz_Q_Flt_qqid.includes(x.bqid))
    sessionStorage.setItem('Pg_Qz_Bid', JSON.stringify(Pg_Qz_Bid))
    //
    //  Load related Hands
    //
    const User_Hands = JSON.parse(sessionStorage.getItem('User_Hands'))
    Pg_Qz_Hands = User_Hands.filter(x => Pg_Qz_Q_Flt_qqid.includes(x.hqid))
    sessionStorage.setItem('Pg_Qz_Hands', JSON.stringify(Pg_Qz_Hands))
    //
    //  Completion
    //
    sessionStorage.setItem('Pg_Qz_Q_Flt', JSON.stringify(Pg_Qz_Q_Flt))
    sessionStorage.setItem('Pg_Qz_Bid', JSON.stringify(Pg_Qz_Bid))
    sessionStorage.setItem('Pg_Qz_Hands', JSON.stringify(Pg_Qz_Hands))
  } catch (e) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
    console.log(e)
  }
}