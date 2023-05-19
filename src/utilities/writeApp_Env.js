//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
//============================================================================
//= Exported Module
//============================================================================
export default function writeApp_Env() {
  //...........................................................................
  // Global CONSTANTS
  //...........................................................................
  //
  //  Save Process.env variables
  //
  const App_Env = {
    DEBUG_LOG_OVERRIDE: true,
    DEBUG_LOG: true,
    PAGESTART: process.env.REACT_APP_PAGESTART,
    PAGESTARTAPP: process.env.REACT_APP_PAGESTARTAPP,
    SERVER_DATABASE: process.env.REACT_APP_SERVER_DATABASE.trim(),
    NODE_ENV: process.env.NODE_ENV,
    TIMEOUT: parseInt(process.env.REACT_APP_TIMEOUT),
    TIMEOUT_EXTRA: parseInt(process.env.REACT_APP_TIMEOUT_EXTRA),
    TIMEOUT_RETRY: parseInt(process.env.REACT_APP_TIMEOUT_RETRY),
    SERVER01: process.env.REACT_APP_SERVER01,
    DATABASE01: process.env.REACT_APP_DATABASE01,
    SERVERURL01: process.env.REACT_APP_SERVERURL01,
    SERVER02: process.env.REACT_APP_SERVER02,
    DATABASE02: process.env.REACT_APP_DATABASE02,
    SERVERURL02: process.env.REACT_APP_SERVERURL02,
    SERVER03: process.env.REACT_APP_SERVER03,
    DATABASE03: process.env.REACT_APP_DATABASE03,
    SERVERURL03: process.env.REACT_APP_SERVERURL03,
    SERVER04: process.env.REACT_APP_SERVER04,
    DATABASE04: process.env.REACT_APP_DATABASE04,
    SERVERURL04: process.env.REACT_APP_SERVERURL04,
    SERVER11: process.env.REACT_APP_SERVER11,
    SERVERURL11: process.env.REACT_APP_SERVERURL11,
    SERVER12: process.env.REACT_APP_SERVER12,
    SERVERURL12: process.env.REACT_APP_SERVERURL12,
    SERVER13: process.env.REACT_APP_SERVER13,
    SERVERURL13: process.env.REACT_APP_SERVERURL13,
    SERVER14: process.env.REACT_APP_SERVER14,
    SERVERURL14: process.env.REACT_APP_SERVERURL14,
    SERVER16: process.env.REACT_APP_SERVER16,
    DATABASE6: process.env.REACT_APP_DATABASE6,
    SERVERURL16: process.env.REACT_APP_SERVERURL16,
    SERVER17: process.env.REACT_APP_SERVER17,
    DATABASE7: process.env.REACT_APP_DATABASE7,
    SERVERURL17: process.env.REACT_APP_SERVERURL17,
    DFT_USER_MAXQUESTIONS: process.env.REACT_APP_DFT_USER_MAXQUESTIONS,
    DFT_USER_OWNER: process.env.REACT_APP_DFT_USER_OWNER,
    DFT_USER_SHOWPROGRESS: true,
    DFT_USER_SHOWSCORE: true,
    DFT_USER_SORTQUESTIONS: true,
    DFT_USER_SKIPCORRECT: true,
    URL_HELLO: process.env.REACT_APP_URL_HELLO,
    URL_REGISTER: process.env.REACT_APP_URL_REGISTER,
    URL_SIGNIN: process.env.REACT_APP_URL_SIGNIN,
    URL_TABLES: process.env.REACT_APP_URL_TABLES
  }
  //
  //  Set Boolean flags
  //
  process.env.REACT_APP_DEBUG_LOG_OVERRIDE === 'true'
    ? (App_Env.DEBUG_LOG_OVERRIDE = true)
    : (App_Env.DEBUG_LOG_OVERRIDE = false)

  process.env.REACT_APP_DEBUG_LOG === 'true'
    ? (App_Env.DEBUG_LOG = true)
    : (App_Env.DEBUG_LOG = false)

  process.env.REACT_APP_DFT_USER_SHOWPROGRESS === 'true'
    ? (App_Env.DFT_USER_SHOWPROGRESS = true)
    : (App_Env.DFT_USER_SHOWPROGRESS = false)

  process.env.REACT_APP_DFT_USER_SHOWSCORE === 'true'
    ? (App_Env.DFT_USER_SHOWSCORE = true)
    : (App_Env.DFT_USER_SHOWSCORE = false)

  process.env.REACT_APP_DFT_USER_SORTQUESTIONS === 'true'
    ? (App_Env.DFT_USER_SORTQUESTIONS = true)
    : (App_Env.DFT_USER_SORTQUESTIONS = false)

  process.env.REACT_APP_DFT_USER_SKIPCORRECT === 'true'
    ? (App_Env.DFT_USER_SKIPCORRECT = true)
    : (App_Env.DFT_USER_SKIPCORRECT = false)
  //
  //  Save
  //
  sessionStorage.setItem('App_Env', JSON.stringify(App_Env))
  //
  //  Debug Settings
  //
  const debugLog = debugSettings()
  const debugModule = 'writeApp_Env'
  if (debugLog) console.log(consoleLogTime(debugModule, 'App_Env'), App_Env)
  //
  //  Check App_Env
  //
  //
  //  Application Environment Variables
  //
  const App_Env_check = JSON.parse(sessionStorage.getItem('App_Env'))
  if (debugLog) console.log(consoleLogTime(debugModule, 'App_Env_check'), App_Env_check)
}
