//
//  Libraries
//
import axios from 'axios'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'apiAxios'

if (debugLog) console.log(consoleLogTime(debugModule, 'Start Global'))

//
//  Global
//
let g_AxId = 0
let g_Sess = 0
//===================================================================================
//
// methods - post(get), post(update), delete(delete), post(upsert)
//
export default async function apiAxios(props) {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  if (debugLog) console.log(consoleLogTime(debugModule, 'props'), { ...props })
  //
  //  Constants
  //
  const AppTimeout = JSON.parse(sessionStorage.getItem('App_Timeout'))
  if (debugLog) console.log(consoleLogTime(debugModule, 'AppTimeout'), AppTimeout)
  const {
    method,
    url,
    data,
    timeout = AppTimeout.timeout,
    info = 'SqlDatabase',
    retry = AppTimeout.retry,
    extra = AppTimeout.extra
  } = props
  if (debugLog) console.log(consoleLogTime(debugModule, 'timeout'), timeout)
  if (debugLog) console.log(consoleLogTime(debugModule, 'retry'), retry)
  if (debugLog) console.log(consoleLogTime(debugModule, 'extra'), extra)
  if (debugLog) console.log(consoleLogTime(debugModule, 'info'), info)
  //
  //  retry on Fail
  //
  let rtnObjtry
  rtnObjtry = await apiRetry(TryReq, retry)
  //
  //  Return values to caller
  //
  if (debugLog) console.log(consoleLogTime(debugModule, 'RETURN rtnObjtry'), { ...rtnObjtry })
  return rtnObjtry
  //--------------------------------------------------------------------------------------------
  // apiRetry
  //--------------------------------------------------------------------------------------------
  async function apiRetry(asyncFunction, retry) {
    let last_apiRetryRtn
    for (let AxTry = 1; AxTry < retry + 1; AxTry++) {
      try {
        if (debugLog) console.log(consoleLogTime(debugModule, 'timeout'), timeout)
        if (debugLog) console.log(consoleLogTime(debugModule, 'AxTry'), AxTry)
        if (debugLog) console.log(consoleLogTime(debugModule, 'extra'), extra)
        const timeoutAlt = timeout + (AxTry - 1) * extra
        if (debugLog) console.log(consoleLogTime(debugModule, 'timeoutAlt'), timeoutAlt)
        const apiRetryRtn = await asyncFunction(AxTry, timeoutAlt)
        if (debugLog)
          console.log(consoleLogTime(debugModule, 'RETURN apiRetryRtn'), { ...apiRetryRtn })
        //
        //  Return value
        //
        if (apiRetryRtn.rtnValue) return apiRetryRtn
        //
        //  No catch then return
        //
        if (!apiRetryRtn.rtnCatch) return apiRetryRtn
        //
        //  Update last return value
        //
        last_apiRetryRtn = apiRetryRtn
      } catch (error) {
        console.log(consoleLogTime(debugModule, 'CATCH Error'), error)
      }
    }
    //
    //  Return last error
    //
    return last_apiRetryRtn
  }
  //--------------------------------------------------------------------------------------------
  // Try request
  //--------------------------------------------------------------------------------------------
  async function TryReq(AxTry, timeoutAlt) {
    //
    //  Try
    //
    try {
      if (debugLog) console.log(consoleLogTime(debugModule, 'AxTry'), AxTry)
      if (debugLog) console.log(consoleLogTime(debugModule, 'timeoutAlt'), timeoutAlt)
      //
      //  Sess
      //
      const AppSessionJSON = sessionStorage.getItem('App_Session')
      if (AppSessionJSON) {
        const AppSession = JSON.parse(AppSessionJSON)
        g_Sess = AppSession.v_vid
      }
      if (debugLog) console.log(consoleLogTime(debugModule, 'g_Sess'), g_Sess)
      //
      //  Inceptor - req start time
      //
      axios.interceptors.request.use(req => {
        req.meta = req.meta || {}
        req.meta.requestStartedAt = new Date().getTime()
        return req
      })
      //
      //  Inceptor - res duration (response - start time)
      //
      axios.interceptors.response.use(
        res => {
          res.durationInMs = new Date().getTime() - res.config.meta.requestStartedAt
          return res
        },
        res => {
          res.durationInMs = new Date().getTime() - res.config.meta.requestStartedAt
          throw res
        }
      )
      //
      //  Store axios values - Request
      //
      StoreReq(AxTry, timeoutAlt)
      //
      //  Add id to body parms
      //
      const dataApiAxios = data
      dataApiAxios.Sess = g_Sess
      dataApiAxios.AxId = g_AxId
      dataApiAxios.AxTry = AxTry
      dataApiAxios.AxTimeout = timeoutAlt
      //
      //  Invoke Axios fetch
      //
      if (debugLog) console.log(consoleLogTime(debugModule, 'Request--->'), { ...dataApiAxios })
      const response = await axios({
        method: method,
        url: url,
        data: dataApiAxios,
        timeout: timeoutAlt
      })
      //
      //  Sucessful response
      //
      if (debugLog) console.log(consoleLogTime(debugModule, 'Response-->'), { ...response })
      if (debugLog)
        console.log(
          consoleLogTime(debugModule, `<--Timing-> ${response.durationInMs} ${info} SUCCESS`)
        )
      //
      //  Errors
      //
      if (response.status < 200 || response.status >= 300)
        throw Error('Did not receive expected data')
      //
      //  Update store - Return
      //
      const apiAxiosObj = Object.assign(response.data)
      apiAxiosObj.durationInMs = response.durationInMs
      StoreRes(apiAxiosObj)
      //
      //  Return Object
      //
      return apiAxiosObj
      //
      //  Catch Error
      //
    } catch (error) {
      //
      //  Returned values
      //
      const apiAxiosObj = {
        rtnBodyParms: '',
        rtnValue: false,
        rtnMessage: error.message,
        rtnSqlFunction: '',
        rtnCatchFunction: debugModule,
        rtnCatch: true,
        rtnCatchMsg: '',
        rtnRows: []
      }
      //
      //  Error logging - Error
      //
      console.log(consoleLogTime(debugModule, 'Catch - error'), error)
      //
      //  Update body parms
      //
      apiAxiosObj.rtnBodyParms = JSON.parse(error.config.data)
      //
      //  No response
      //
      if (!error.response) {
        error.request
          ? (apiAxiosObj.rtnCatchMsg = 'No response from Server')
          : (apiAxiosObj.rtnCatchMsg = 'Request setup error')
      }
      //
      //  Error logging - Timing
      //
      console.log(consoleLogTime(debugModule, `<--Timing-> ${error.durationInMs} ${info} ERROR`))
      //
      //  Update store
      //
      apiAxiosObj.durationInMs = error.durationInMs
      StoreRes(apiAxiosObj)
      return apiAxiosObj
    }
  }
  //--------------------------------------------------------------------------------------------
  // Store the request values
  //--------------------------------------------------------------------------------------------
  function StoreReq(AxTry, timeoutAlt) {
    //
    //  Allocate Id
    //
    updateId()
    //
    //  Get the store
    //
    let arrReq = []
    const tempJSON = sessionStorage.getItem('App_apiAxios_Req')
    if (tempJSON) arrReq = JSON.parse(tempJSON)
    if (debugLog) console.log(consoleLogTime(debugModule, 'arrReq'), [...arrReq])
    //
    //  Populate the store object
    //
    const objReq = {
      Sess: g_Sess,
      sqlTable: data.sqlTable,
      AxId: g_AxId,
      AxTry: AxTry,
      AxTimeout: timeoutAlt,
      sqlClient: data.sqlClient,
      info: info,
      data: data,
      url: url,
      method: method
    }
    if (debugLog) console.log(consoleLogTime(debugModule, 'objReq'), { ...objReq })
    //
    //  Save to array
    //
    arrReq.push(objReq)
    if (debugLog) console.log(consoleLogTime(debugModule, 'arrReq'), [...arrReq])
    //
    //  update the store
    //
    sessionStorage.setItem('App_apiAxios_Req', JSON.stringify(arrReq))
  }
  //--------------------------------------------------------------------------------------------
  // Store the Return values
  //--------------------------------------------------------------------------------------------
  function StoreRes(apiAxiosObj) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'apiAxiosObj'), { ...apiAxiosObj })
    //
    //  Get the store
    //
    let arrRes = []
    const tempJSON = sessionStorage.getItem('App_apiAxios_Res')
    if (tempJSON) arrRes = JSON.parse(tempJSON)
    if (debugLog) console.log(consoleLogTime(debugModule, 'arrRes'), [...arrRes])
    //
    //  Populate the store object
    //
    const objRes = {
      AxId: apiAxiosObj.rtnBodyParms.AxId,
      sqlTable: apiAxiosObj.rtnBodyParms.sqlTable,
      rtnSts: apiAxiosObj.rtnSts,
      rtnValue: apiAxiosObj.rtnValue,
      rtnMessage: apiAxiosObj.rtnMessage,
      AxTry: apiAxiosObj.rtnBodyParms.AxTry,
      AxTimeout: apiAxiosObj.rtnBodyParms.AxTimeout,
      sqlClient: apiAxiosObj.rtnBodyParms.sqlClient,
      apiAxiosObj: apiAxiosObj
    }
    if (debugLog) console.log(consoleLogTime(debugModule, 'objRes'), { ...objRes })
    //
    //  Save to array
    //
    arrRes.push(objRes)
    if (debugLog) console.log(consoleLogTime(debugModule, 'arrRes'), [...arrRes])
    //
    //  update the store
    //
    sessionStorage.setItem('App_apiAxios_Res', JSON.stringify(arrRes))
  }
  //--------------------------------------------------------------------------------------------
  // Update the transaction ID
  //--------------------------------------------------------------------------------------------
  function updateId() {
    //
    //  Get the store
    //
    const tempJSON = sessionStorage.getItem('App_apiAxios_Id')
    tempJSON ? (g_AxId = JSON.parse(tempJSON)) : (g_AxId = 0)
    g_AxId++
    //
    //  update the store
    //
    if (debugLog) console.log(consoleLogTime(debugModule, 'g_AxId'), g_AxId)
    sessionStorage.setItem('App_apiAxios_Id', JSON.stringify(g_AxId))
  }
}
