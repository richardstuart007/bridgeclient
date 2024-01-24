//
//  Utilities
//
import rowCrud from '../utilities/rowCrud'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
let debugLog
const debugModule = 'writeUsersowner'
//===================================================================================
export default function writeUsersowner(params) {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Debug Settings
  //
  debugLog = debugSettings()
  //
  //  Unpack
  //
  const { uouid, uouser, uoowner } = params
  //
  //  Build row
  //
  const AxRow = {
    uouid: uouid,
    uouser: uouser,
    uoowner: uoowner,
  }
  if (debugLog) console.log(consoleLogTime(debugModule, 'AxRow'), { ...AxRow })
  //
  //  Build Props
  //
  const props = {
    AxCaller: debugModule,
    AxMethod: 'post',
    AxAction: 'INSERT',
    AxTable: 'usersowner',
    AxRow: AxRow,
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
      console.log(consoleLogTime(debugModule, `Row (${newRow.uouid}) INSERTED in Database`))
    return
  })
  //
  //  Return Promise
  //
  return myPromiseInsert
}
