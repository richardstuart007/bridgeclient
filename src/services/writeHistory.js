//
//  Libraries
//
import { format, parseISO } from 'date-fns'
//
//  Utilities
//
import rowCrud from './../utilities/rowCrud'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'writeHistory'
//===================================================================================
export default function writeHistory() {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Answers
  //
  const r_ans = JSON.parse(sessionStorage.getItem('Pg_Qz_A'))
  const r_questions = r_ans.length
  //
  //  If no questions answered, do not write history
  //
  if (r_questions === 0) return
  //
  //  Get User
  //
  const User_User = JSON.parse(sessionStorage.getItem('User_User'))
  //
  //  Get History data
  //
  const Pg_Qh_Data = JSON.parse(sessionStorage.getItem('Pg_Qh_Data'))
  //
  //  Get group title
  //
  const Pg_Qz_ogtitle = JSON.parse(sessionStorage.getItem('Pg_Qz_ogtitle'))
  //
  //  Key
  //
  const r_uid = User_User.u_id
  const r_datetime = new Date().toJSON()
  const yymmdd = format(parseISO(r_datetime), 'yy-MM-dd')
  //
  //  Selection Data
  //
  const r_owner = JSON.parse(sessionStorage.getItem('Pg_Qz_Owner'))
  const r_group = JSON.parse(sessionStorage.getItem('Pg_Qz_OwnerGroup'))
  //
  //  Question IDs of Answered questions
  //
  let r_qid = []
  let r_points = []
  let count = 0
  let r_totalpoints = 0
  let r_maxpoints = 0
  let r_correctpercent = 0
  const Pg_Qz_Q_All = JSON.parse(sessionStorage.getItem('Pg_Qz_Q_All'))
  Pg_Qz_Q_All.forEach(row => {
    count++
    if (count <= r_questions) {
      r_qid.push(row.qid)
      //
      //  Points for each answer (start at 0 not 1)
      //
      const i = count - 1
      const p = r_ans[i] - 1
      const points = row.qpoints[p]
      r_points.push(points)
      //
      //  Total points
      //
      r_totalpoints = r_totalpoints + points
      //
      //  Max points
      //
      r_maxpoints = r_maxpoints + Math.max(...row.qpoints)
    }
  })
  //
  //  Percentage correct
  //
  if (r_maxpoints !== 0) r_correctpercent = Math.ceil((r_totalpoints * 100) / r_maxpoints)
  //
  //  Build row
  //
  const sqlRow = {
    r_uid: r_uid,
    r_datetime: r_datetime,
    r_owner: r_owner,
    r_group: r_group,
    r_questions: r_questions,
    r_qid: r_qid,
    r_ans: r_ans,
    r_points: r_points,
    r_maxpoints: r_maxpoints,
    r_totalpoints: r_totalpoints,
    r_correctpercent: r_correctpercent
  }
  if (debugLog) console.log(consoleLogTime(debugModule, 'sqlRow'), sqlRow)
  //
  //  Add record to storage (if history already exists)
  //
  if (Pg_Qh_Data) {
    const template = Pg_Qh_Data[0]
    const newQH = { ...template, ...sqlRow }
    newQH.r_id = 0
    newQH.ogtitle = Pg_Qz_ogtitle
    newQH.yymmdd = yymmdd
    if (debugLog) console.log(consoleLogTime(debugModule, 'newQH'), newQH)

    Pg_Qh_Data.unshift(newQH)
    sessionStorage.setItem('Pg_Qh_Data', JSON.stringify(Pg_Qh_Data))
    if (debugLog) console.log(consoleLogTime(debugModule, 'Pg_Qh_Data'), Pg_Qh_Data)
  }
  //
  //  Build Props
  //
  const props = {
    sqlCaller: debugModule,
    axiosMethod: 'post',
    sqlAction: 'INSERT',
    sqlTable: 'usershistory',
    sqlRow: sqlRow
  }
  //
  //  Process promise
  //
  const myPromiseInsert = rowCrud(props)
  //
  //  Resolve Status
  //
  myPromiseInsert.then(function (rtnObj) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj'), rtnObj)
    //
    //  No data returned
    //
    if (!rtnObj.rtnValue) return
    //
    //  Data
    //
    const data = rtnObj.rtnRows
    const newRow = data[0]
    if (debugLog)
      console.log(consoleLogTime(debugModule, `Row (${newRow.r_id}) INSERTED in Database`))
    //
    //  Update storage with r_id
    //
    if (Pg_Qh_Data) {
      Pg_Qh_Data[0].r_id = newRow.r_id
      sessionStorage.setItem('Pg_Qh_Data', JSON.stringify(Pg_Qh_Data))
      if (debugLog) console.log(consoleLogTime(debugModule, 'Pg_Qh_Data'), Pg_Qh_Data)
    }
    return
  })
  //
  //  Return Promise
  //
  return myPromiseInsert
}
