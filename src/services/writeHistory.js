//
//  Utilities
//
import rowCrud from './../utilities/rowCrud'

//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
//
// Debug Settings
//
const debugLog = debugSettings()

const functionName = 'writeHistory'
//===================================================================================
export default function writeHistory() {
  //
  //  Answers
  //
  const r_ans = JSON.parse(sessionStorage.getItem('Pg_Qz_Answers'))
  const r_questions = r_ans.length
  //
  //  If no questions answered, do not write history
  //
  if (r_questions === 0) return
  //
  //  Get User
  //
  const User_Set_User = JSON.parse(sessionStorage.getItem('User_Set_User'))
  //
  //  Key
  //
  const r_uid = User_Set_User.u_id
  const r_datetime = new Date()
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
  const Pg_Qz_Questions_Quiz = JSON.parse(sessionStorage.getItem('Pg_Qz_Questions_Quiz'))
  Pg_Qz_Questions_Quiz.forEach(row => {
    count++
    if (count <= r_questions) {
      r_qid.push(row.qid)
      //
      //  Points for each answer (start at 0 not 1)
      //
      const i = count - 1
      const p = r_ans[i] - 1
      if (debugLog) console.log('i ', i)
      if (debugLog) console.log('p ', p)
      if (debugLog) console.log('row ', row)
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
  if (debugLog) console.log('sqlRow ', sqlRow)
  //
  //  Build Props
  //
  const props = {
    sqlCaller: functionName,
    axiosMethod: 'post',
    sqlAction: 'INSERT',
    sqlTable: 'usershistory',
    sqlRow: sqlRow
  }
  //
  //  Process promise
  //
  if (debugLog) console.log('rowCrud')
  const myPromiseInsert = rowCrud(props)
  //
  //  Resolve Status
  //
  myPromiseInsert.then(function (rtnObj) {
    if (debugLog) console.log('rtnObj ', rtnObj)
    //
    //  No data returned
    //
    if (!rtnObj.rtnValue) return
    //
    //  Data
    //
    const data = rtnObj.rtnRows
    const rtn_r_id = data[0].r_id
    if (debugLog) console.log(`Row (${rtn_r_id}) UPSERTED in Database`)
    return
  })
  //
  //  Return Promise
  //
  return myPromiseInsert
}
