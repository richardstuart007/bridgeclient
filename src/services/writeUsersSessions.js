//
//  Utilities
//
import rowCrud from '../utilities/rowCrud'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'writeUsersSessions'
//===================================================================================
export default function writeUsersSessions() {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Get User
  //
  const User_User = JSON.parse(sessionStorage.getItem('User_User'))
  //
  //  Build row
  //
  const usuid = User_User.u_id
  const ususer = User_User.u_user
  const usdatetime = new Date().toJSON()
  const sqlRow = {
    usuid: usuid,
    usdatetime: usdatetime,
    ususer: ususer
  }
  if (debugLog) console.log(consoleLogTime(debugModule, 'sqlRow'), { ...sqlRow })
  //
  //  Build Props
  //
  const props = {
    sqlCaller: debugModule,
    axiosMethod: 'post',
    sqlAction: 'INSERT',
    sqlTable: 'userssessions',
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
    if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj'), { ...rtnObj })
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
      console.log(consoleLogTime(debugModule, `Row (${newRow.ruid}) INSERTED in Database`))
    //
    //  Update storage with new row
    //
    sessionStorage.setItem('User_Session', JSON.stringify(newRow))
    return
  })
  //
  //  Return Promise
  //
  return myPromiseInsert
}
