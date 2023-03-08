//
//  Utilities
//
import apiAxios from './apiAxios'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'rowCrud'
//
// Constants
//
const { URL_TABLES } = require('../services/constants.js')
//
//  Global Variables
//
let rtnObj = {
  rtnValue: false,
  rtnMessage: '',
  rtnSqlFunction: debugModule,
  rtnCatchFunction: '',
  rtnCatch: false,
  rtnCatchMsg: '',
  rtnRows: []
}
//--------------------------------------------------------------------
//-  Main Line
//--------------------------------------------------------------------
export default async function rowCrud(props) {
  //
  //  Try
  //
  try {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
    //
    //  Deconstruct
    //
    const {
      sqlCaller,
      axiosMethod = 'post',
      sqlAction = 'SELECT',
      sqlTable,
      sqlString,
      sqlWhere,
      sqlRow,
      sqlKeyName,
      sqlOrderBy,
      sqlOrderByRaw
    } = props
    if (debugLog) console.log(consoleLogTime(debugModule, 'Props'), props)
    const sqlClient = `${debugModule}/${sqlCaller}`
    //
    //  Validate the parameters
    //
    const valid = validateProps(sqlAction, sqlString, sqlTable)
    if (!valid) {
      console.log(
        consoleLogTime(
          `sqlClient(${sqlClient}) Action(${sqlAction}) Table(${sqlTable}) Error(${rtnObj.rtnMessage})`
        )
      )
      return rtnObj
    }
    //
    // Fetch the data
    //
    const rtnObjServer = sqlDatabase(
      sqlClient,
      sqlTable,
      sqlAction,
      sqlString,
      sqlWhere,
      sqlRow,
      sqlKeyName,
      sqlOrderBy,
      sqlOrderByRaw,
      axiosMethod
    )
    //
    //  Server Returned null
    //
    if (!rtnObjServer) {
      rtnObj.rtnMessage = `Server rejected request: sqlClient(${sqlClient}) Action(${sqlAction}) Table(${sqlTable}) `
      console.log(consoleLogTime(debugModule, rtnObj.rtnMessage))
      return rtnObj
    }
    //
    //  Server returned no data
    //
    if (!rtnObjServer.rtnValue)
      if (debugLog)
        console.log(
          consoleLogTime(
            debugModule,
            `No data received: sqlClient(${sqlClient}) Action(${sqlAction}) Table(${sqlTable}) `
          )
        )

    //
    //  Return value from Server
    //
    if (debugLog) console.log(consoleLogTime(debugModule, 'Server Object '), rtnObjServer)
    return rtnObjServer
  } catch (e) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
    console.log(e)
  } finally {
    if (debugLog) console.log(consoleLogTime(debugModule, 'End'))
  }
  //--------------------------------------------------------------------
  //  Validate the parameters
  //--------------------------------------------------------------------
  function validateProps(sqlAction, sqlString, sqlTable) {
    //
    // Check values sent
    //
    if (!sqlAction) {
      rtnObj.rtnMessage = `SqlAction parameter not passed`
      return false
    }
    //
    //  Validate sqlAction type
    //
    if (
      sqlAction !== 'DELETE' &&
      sqlAction !== 'EXIST' &&
      sqlAction !== 'SELECTSQL' &&
      sqlAction !== 'SELECT' &&
      sqlAction !== 'INSERT' &&
      sqlAction !== 'UPDATE' &&
      sqlAction !== 'UPSERT'
    ) {
      rtnObj.rtnMessage = `SqlAction ${sqlAction}: SqlAction not valid`
      return false
    }
    //
    //  SELECTSQL needs sqlString
    //
    if (sqlAction === 'SELECTSQL' && !sqlString) {
      rtnObj.rtnMessage = `SqlAction ${sqlAction}: sqlString not passed`
      return false
    }
    //
    //  not SELECTSQL needs table
    //
    if (sqlAction !== 'SELECTSQL' && !sqlTable) {
      rtnObj.rtnMessage = `SqlAction ${sqlAction}: sqlTable not passed`
      return false
    }
    //
    //  Valid
    //
    return true
  }
  //--------------------------------------------------------------------
  //  Database SQL
  //--------------------------------------------------------------------
  async function sqlDatabase(
    sqlClient,
    sqlTable,
    sqlAction,
    sqlString,
    sqlWhere,
    sqlRow,
    sqlKeyName,
    sqlOrderBy,
    sqlOrderByRaw,
    axiosMethod
  ) {
    try {
      //
      //  Body
      //
      const body = {
        sqlClient: sqlClient,
        sqlTable: sqlTable,
        sqlAction: sqlAction,
        sqlString: sqlString,
        sqlWhere: sqlWhere,
        sqlRow: sqlRow,
        sqlKeyName: sqlKeyName,
        sqlOrderBy: sqlOrderBy,
        sqlOrderByRaw: sqlOrderByRaw
      }
      //
      //  Base URL
      //
      const App_Set_URL = JSON.parse(sessionStorage.getItem('App_Set_URL'))
      if (debugLog) console.log(consoleLogTime(debugModule, 'App_Set_URL'), App_Set_URL)
      //
      //  Full URL
      //
      const URL = App_Set_URL + URL_TABLES
      if (debugLog) console.log(consoleLogTime(debugModule, 'URL'), URL)
      if (debugLog)
        console.log(
          consoleLogTime(`sqlClient(${sqlClient}) Action(${sqlAction}) Table(${sqlTable})`)
        )
      //
      //  Timeout
      //
      let timeout = 2000
      //
      //  Info
      //
      const info = `sqlClient(${sqlClient}) Action(${sqlAction}) Table(${sqlTable})`
      //
      //  SQL database
      //
      const rtnObjServer = await apiAxios(axiosMethod, URL, body, timeout, info)
      if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObjServer'), rtnObjServer)
      return rtnObjServer
      //
      // Errors
      //
    } catch (err) {
      console.log(err)
      return []
    }
  }
}
