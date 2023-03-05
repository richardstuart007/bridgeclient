//
//  Services
//
import rowCrud from './../utilities/rowCrud'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
const debugLog = debugSettings()
const debugModule = 'BuildHistoryDetail'
//...................................................................................
//.  Main Line
//...................................................................................
export default function BuildHistoryDetail(row) {
  if (debugLog) console.log(debugModule)
  //
  //  Load data
  //
  LoadServerQuestions()
  LoadServerLibrary()
  //...................................................................................
  //.  Load Server - Questions
  //...................................................................................
  function LoadServerQuestions() {
    if (debugLog) console.log('LoadServerQuestions')
    //
    //  Initialise
    //
    sessionStorage.setItem('Pg_Qh_Data_R', false)
    sessionStorage.setItem('Pg_Qh_Data_Row_Join', [])
    sessionStorage.setItem('Pg_Qz_Q_All', [])
    sessionStorage.setItem('Pg_Qz_Bid', [])
    sessionStorage.setItem('Pg_Qz_Hands', [])
    //
    //  Load Pg_Qh_Data_Row_Join
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
    if (debugLog) console.log('sqlString', sqlString)
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
      if (debugLog) console.log('rtnObj ', rtnObj)
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Data
      //
      const Pg_Qh_Data_Row_Join = rtnObj.rtnRows
      //
      //  Session Storage
      //
      if (debugLog) console.log('Pg_Qh_Data_Row_Join RESOLVED', Pg_Qh_Data_Row_Join)
      sessionStorage.setItem('Pg_Qh_Data_Row_Join', JSON.stringify(Pg_Qh_Data_Row_Join))
      //
      //  Store separately
      //
      let Pg_Qz_Q_All = []
      let Pg_Qz_Bid = []
      let Pg_Qz_Hands = []

      Pg_Qh_Data_Row_Join.forEach(row => {
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
        if (debugLog) console.log('row ', row)
        //
        //  Index of current question
        //
        if (debugLog) console.log('row.r_qid.indexOf ', row.r_qid.indexOf(qid))
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
      sessionStorage.setItem('Pg_Qh_Data_R', true)
    })

    return
  }
  //...................................................................................
  //.  Load Server - Library
  //...................................................................................
  function LoadServerLibrary() {
    if (debugLog) console.log('LoadServerLibrary')
    //
    //  Initialise
    //
    sessionStorage.setItem('Pg_Lib_Data_R', false)
    sessionStorage.setItem('Pg_Lib_Data', [])
    //
    //  List of Questions in a string
    //
    let qidList = ''
    let firstElem = true
    row.r_qid.forEach(qid => {
      firstElem ? (qidList = qidList + `${qid}`) : (qidList = qidList + `, ${qid}`)
      firstElem = false
    })
    if (debugLog) console.log('qidList ', qidList)
    //
    //  Build SqlString
    //
    let sqlString = ''
    sqlString = sqlString + 'lrid, lrref, lrdesc, lrlink, lrwho, lrtype from library'
    sqlString = sqlString + ' JOIN questions on lrgroup = qgroup'
    sqlString = sqlString + ` where qid in (${qidList})`
    sqlString = sqlString + ` group by lrid, lrref, lrdesc, lrlink, lrwho, lrtype`
    sqlString = sqlString + ` order by lrid`
    if (debugLog) console.log('sqlString', sqlString)
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'post',
      sqlCaller: debugModule,
      sqlTable: 'library',
      sqlAction: 'SELECTSQL',
      sqlString: sqlString
    }
    const myPromiseLibrary = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseLibrary.then(function (rtnObj) {
      if (debugLog) console.log('rtnObj ', rtnObj)
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Data
      //
      const Pg_Lib_Data = rtnObj.rtnRows
      //
      //  Session Storage
      //
      if (debugLog) console.log('Pg_Lib_Data RESOLVED', Pg_Lib_Data)
      sessionStorage.setItem('Pg_Lib_Data', JSON.stringify(Pg_Lib_Data))
      sessionStorage.setItem('Pg_Lib_Data_R', true)

      return
    })

    return myPromiseLibrary
  }
  //...................................................................................
}
