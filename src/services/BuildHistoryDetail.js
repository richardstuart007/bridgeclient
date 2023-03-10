//
//  Services
//
import rowCrud from './../utilities/rowCrud'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'BuildHistoryDetail'
//...................................................................................
//.  Main Line
//...................................................................................
export default function BuildHistoryDetail(row) {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Load data
  //
  LoadServerQuestions()
  //...................................................................................
  //.  Load Server - Questions
  //...................................................................................
  function LoadServerQuestions() {
    //
    //  Reset the Data
    //
    sessionStorage.setItem('Pg_Qz_CatchMessage', '')
    sessionStorage.setItem('Pg_Qd_Join_Rcv', false)
    sessionStorage.setItem('Pg_Qd_Join', [])
    sessionStorage.setItem('Pg_Qz_Q_All', [])
    sessionStorage.setItem('Pg_Qz_Bid', [])
    sessionStorage.setItem('Pg_Qz_Hands', [])
    //
    //  Load Pg_Qd_Join
    //
    let sqlString = ''
    sqlString =
      sqlString +
      `r_id, r_qid, r_ans, qid, qowner, qseq, qdetail, qans, qpoints, qgroup, hnorth, heast, hsouth, hwest, brounds`
    sqlString = sqlString + ' from usershistory'
    sqlString = sqlString + ' FULL OUTER JOIN questions on qid = ANY (r_qid)'
    sqlString = sqlString + ' FULL OUTER JOIN bidding on bid = qid'
    sqlString = sqlString + ' FULL OUTER JOIN hands on hid = qid'
    sqlString = sqlString + ` where r_id = ${row.r_id}`
    sqlString = sqlString + ' group by'
    sqlString =
      sqlString +
      ' r_id, r_qid, r_ans, qid, qowner, qseq, qdetail, qans, qpoints, qgroup, hnorth, heast, hsouth, hwest, brounds'
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
      const Pg_Qd_Join = rtnObj.rtnRows
      //
      //  Session Storage
      //
      sessionStorage.setItem('Pg_Qd_Join', JSON.stringify(Pg_Qd_Join))
      //
      //  Store separately
      //
      let Pg_Qz_Q_All = []
      let Pg_Qz_Bid = []
      let Pg_Qz_Hands = []

      Pg_Qd_Join.forEach(row => {
        const {
          qid,
          qowner,
          qseq,
          qdetail,
          qans,
          qpoints,
          qgroup,
          brounds,
          hnorth,
          heast,
          hsouth,
          hwest
        } = row
        //
        //  Questions
        //
        const rowQuestion = {
          qid: qid,
          qowner: qowner,
          qseq: qseq,
          qdetail: qdetail,
          qans: qans,
          qpoints: qpoints,
          qgroup: qgroup
        }
        Pg_Qz_Q_All.push(rowQuestion)
        //
        //  Bidding
        //
        if (brounds !== null) {
          const rowBidding = {
            bid: qid,
            brounds: brounds
          }
          Pg_Qz_Bid.push(rowBidding)
        }
        //
        //  Hands
        //
        if (hnorth !== null || heast !== null || hsouth !== null || hwest !== null) {
          const rowHands = {
            hid: qid,
            hnorth: hnorth,
            heast: heast,
            hsouth: hsouth,
            hwest: hwest
          }
          Pg_Qz_Hands.push(rowHands)
        }
      })
      //
      //  Completion
      //
      sessionStorage.setItem('Pg_Qz_Q_All', JSON.stringify(Pg_Qz_Q_All))
      sessionStorage.setItem('Pg_Qz_Bid', JSON.stringify(Pg_Qz_Bid))
      sessionStorage.setItem('Pg_Qz_Hands', JSON.stringify(Pg_Qz_Hands))
      sessionStorage.setItem('Pg_Qd_Join_Rcv', true)
    })

    return
  }
}
