//
//  Utilities
//
import apiAxios from '../../utilities/apiAxios'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
import consoleLogTime from '../../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'registerUser'
//
// Constants
//
const { URL_REGISTER } = require('../../services/constants.js')
const { DFT_TIMEOUT } = require('../../services/constants.js')
//--------------------------------------------------------------------
//-  Main Line
//--------------------------------------------------------------------
export default async function registerUser(props) {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //
  //  Deconstruct props
  //
  const {
    sqlCaller,
    user,
    email,
    password,
    name,
    fedid,
    fedcountry,
    dftmaxquestions,
    dftowner,
    showprogress,
    showscore,
    sortquestions,
    skipcorrect,
    admin,
    dev
  } = props
  let sqlClient = `${debugModule}/${sqlCaller}`
  //
  //  Get the URL
  //
  const App_URL = JSON.parse(sessionStorage.getItem('App_URL'))
  //
  // Fetch the data
  //
  let rtnObj = fetchItems()
  return rtnObj
  //--------------------------------------------------------------------
  //.  fetch data
  //--------------------------------------------------------------------
  async function fetchItems() {
    let body
    try {
      //
      //  Setup actions
      //
      const method = 'post'
      body = {
        sqlClient: sqlClient,
        sqlTable: 'users',
        user: user,
        email: email,
        password: password,
        name: name,
        fedid: fedid,
        fedcountry: fedcountry,
        dftmaxquestions: dftmaxquestions,
        dftowner: dftowner,
        showprogress: showprogress,
        showscore: showscore,
        sortquestions: sortquestions,
        skipcorrect: skipcorrect,
        admin: admin,
        dev: dev
      }
      const URL = App_URL + URL_REGISTER
      //
      //  Timeout
      //
      let timeout = DFT_TIMEOUT
      //
      //  Info
      //
      const info = `Client(${sqlClient}) Action(Register)`
      //
      //  SQL database
      //
      rtnObj = await apiAxios(method, URL, body, timeout, info)
      return rtnObj
      //
      // Errors
      //
    } catch (err) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'Catch err'), { ...err })
      const rtnObj = {
        rtnBodyParms: body,
        rtnValue: false,
        rtnMessage: '',
        rtnSqlFunction: debugModule,
        rtnCatchFunction: debugModule,
        rtnCatch: true,
        rtnCatchMsg: 'Catch calling apiAxios',
        rtnRows: []
      }
      return rtnObj
    }
  }
  //--------------------------------------------------------------------
}
