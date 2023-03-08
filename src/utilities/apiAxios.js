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
//
//  Returned values
//
const rtnObj = {
  rtnValue: false,
  rtnMessage: '',
  rtnSqlFunction: '',
  rtnCatchFunction: debugModule,
  rtnCatch: true,
  rtnCatchMsg: '',
  rtnRows: []
}
//===================================================================================
//
// methods - post(get), post(update), delete(delete), post(upsert)
//
export default async function apiAxios(method, url, data, timeout = 2000, info = 'SqlDatabase') {
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
  //  Try
  //
  try {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Request...:'), data)
    const response = await axios({
      method: method,
      url: url,
      data: data,
      timeout: timeout
    })
    if (debugLog) console.log(consoleLogTime(debugModule, 'Response..:'), response)
    if (debugLog)
      console.log(
        consoleLogTime(debugModule, `Timing....: ${response.durationInMs} ${info} Success`)
      )
    //
    //  Errors
    //
    if (response.status < 200 || response.status >= 300)
      throw Error('Did not receive expected data')
    //
    //  Return rows
    //
    return response.data
    //
    //  Catch Error
    //
  } catch (error) {
    rtnObj.rtnCatchFunction = 'apiAxios'
    rtnObj.rtnValue = false
    rtnObj.rtnCatch = true
    if (error.response) {
      //
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      //
      console.log(consoleLogTime(debugModule, 'Catch - Error.message.data'), error.response.data)
      console.log(
        consoleLogTime(debugModule, 'Catch - Error.message.status'),
        error.response.status
      )
      console.log(
        consoleLogTime(debugModule, 'Catch - Error.message.headers'),
        error.response.headers
      )
      rtnObj.rtnCatchMsg = 'Catch - Error returned by server'
    } else if (error.request) {
      //
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js
      //
      console.log(consoleLogTime(debugModule, 'Catch - Error.request'), error.request)
      rtnObj.rtnCatchMsg = 'Catch - No response from Server'
    } else {
      //
      // Something happened in setting up the request that triggered an error
      //
      console.log(consoleLogTime(debugModule, 'Catch - Error.message'), error.message)
      rtnObj.rtnCatchMsg = 'Catch - Request setup error'
    }
    //
    //  Error logging - All
    //
    console.log(consoleLogTime(debugModule, 'Catch - Error.config'), error.config)
    if (debugLog)
      console.log(
        consoleLogTime(debugModule, `Timing....: ${error.durationInMs} ${info} Catch Error`)
      )
    return rtnObj
  }
}
