//
// Libraries
//
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { useState } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
//
//  Pages
//
import Control from '../pages/Control'
//
//  Utilities
//
import writeUsersHistory from '../services/writeUsersHistory'
//
//  Common Components
//
import Layout from '../components/Layout/Layout'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
//...........................................................................
// Global CONSTANTS
//...........................................................................
//
//  Debug Settings
//
const debugLog = debugSettings()
const debugModule = 'App'
//
//  Layout Theme
//
const theme = createTheme({})
//
//  Start Pages
//
const { PAGESTART } = require('../services/constants.js')
const { PAGESTARTAPP } = require('../services/constants.js')
//...........................................................................
// Global VARIABLES
//...........................................................................
let g_firstTimeFlag = true
let g_server_database
let g_node_env
let g_Database = 'Error'
let g_Server = 'Error'
let g_URL = 'Error'
//============================================================================
//= Exported Module
//============================================================================
export default function App() {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //...........................................................................
  // Module STATE
  //...........................................................................
  const [pageCurrent, setPageCurrent] = useState(PAGESTARTAPP)
  //
  //  Screen Width
  //
  const ScreenMedium = useMediaQuery(theme.breakpoints.up('sm'))
  const ScreenSmall = !ScreenMedium
  sessionStorage.setItem('App_ScreenSmall', ScreenSmall)
  //...........................................................................
  // Module Main Line
  //...........................................................................
  //
  //  Try
  //
  try {
    //
    //  First Time Setup
    //
    if (g_firstTimeFlag) {
      g_firstTimeFlag = false
      firstTime()
    }
  } catch (e) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
    console.log(e)
  }
  //.............................................................................
  //  First Time Setup
  //.............................................................................
  function firstTime() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'First Time APP Reset'))
    //
    //  Environment variables
    //
    g_server_database = process.env.REACT_APP_SERVER_DATABASE
    g_server_database = g_server_database.trim()
    g_node_env = process.env.NODE_ENV
    //
    //  Timeouts
    //
    const AppTimeout = {
      timeout: null,
      extra: null,
      retry: null
    }
    const { REACT_APP_ENV_TIMEOUT } = require('../services/constants.js')
    const env_timeout = process.env.REACT_APP_ENV_TIMEOUT
    if (debugLog) console.log(consoleLogTime(debugModule, 'env_timeout'), env_timeout)
    env_timeout
      ? (AppTimeout.timeout = parseInt(env_timeout))
      : (AppTimeout.timeout = REACT_APP_ENV_TIMEOUT)

    const { REACT_APP_ENV_TIMEOUT_EXTRA } = require('../services/constants.js')
    const env_timeout_extra = process.env.REACT_APP_ENV_TIMEOUT_EXTRA
    env_timeout_extra
      ? (AppTimeout.extra = parseInt(env_timeout_extra))
      : (AppTimeout.extra = REACT_APP_ENV_TIMEOUT_EXTRA)

    const { REACT_APP_ENV_TIMEOUT_RETRY } = require('../services/constants.js')
    const env_timeout_retry = process.env.REACT_APP_ENV_TIMEOUT_RETRY
    env_timeout_retry
      ? (AppTimeout.retry = parseInt(env_timeout_retry))
      : (AppTimeout.retry = REACT_APP_ENV_TIMEOUT_RETRY)
    //
    //  Save in session storage
    //
    sessionStorage.setItem('App_Timeout', JSON.stringify(AppTimeout))
    //
    //  Server & Database
    //
    Set_ServerDatabase()
    //
    //  Initialise storage
    //
    Init_Storage()
  }
  //.............................................................................
  //.  Local Port Overridden - Update Constants
  //.............................................................................
  function Set_ServerDatabase() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'g_server_database'), g_server_database)
    //------------------------------------------------------------------------
    //  Remote - Client/Server/Database (Production)
    //------------------------------------------------------------------------
    //
    //  Remote Client --> Remote Server 1 --> Remote Database 1
    //
    const { SERVER01 } = require('../services/constants.js')
    const { DATABASE01 } = require('../services/constants.js')
    const { SERVERURL01 } = require('../services/constants.js')
    //
    //  Remote Client --> Remote Server 2 --> Remote Database 2
    //
    const { SERVER02 } = require('../services/constants.js')
    const { DATABASE02 } = require('../services/constants.js')
    const { SERVERURL02 } = require('../services/constants.js')
    //
    //  Remote Client --> Remote Server 3 --> Remote Database 3
    //
    const { SERVER03 } = require('../services/constants.js')
    const { DATABASE03 } = require('../services/constants.js')
    const { SERVERURL03 } = require('../services/constants.js')
    //
    //  Remote Client --> Remote Server 4 --> Remote Database 4
    //
    const { SERVER04 } = require('../services/constants.js')
    const { DATABASE04 } = require('../services/constants.js')
    const { SERVERURL04 } = require('../services/constants.js')
    //------------------------------------------------------------------------
    //  Local - Client/Server - Remote Database
    //------------------------------------------------------------------------
    //
    //  Local Client --> Local Server 1 --> Remote Database 1
    //
    const { SERVER11 } = require('../services/constants.js')
    const { SERVERURL11 } = require('../services/constants.js')
    //
    //  Local Client --> Local Server 2 --> Remote Database 2
    //
    const { SERVER12 } = require('../services/constants.js')
    const { SERVERURL12 } = require('../services/constants.js')
    //
    //  Local Client --> Local Server 3 --> Remote Database 3
    //
    const { SERVER13 } = require('../services/constants.js')
    const { SERVERURL13 } = require('../services/constants.js')
    //
    //  Local Client --> Local Server 4 --> Remote Database 4
    //
    const { SERVER14 } = require('../services/constants.js')
    const { SERVERURL14 } = require('../services/constants.js')
    //------------------------------------------------------------------------
    //  Local - Client/Server/Database
    //------------------------------------------------------------------------
    //
    //  Local Client --> Local Server --> Local Database 6
    //
    const { SERVER16 } = require('../services/constants.js')
    const { DATABASE6 } = require('../services/constants.js')
    const { SERVERURL16 } = require('../services/constants.js')
    //
    //  Local Client --> Local Server --> Local Database 7
    //
    const { SERVER17 } = require('../services/constants.js')
    const { DATABASE7 } = require('../services/constants.js')
    const { SERVERURL17 } = require('../services/constants.js')
    //------------------------------------------------------------------------
    switch (g_server_database) {
      //------------------------------------------------------
      //  Client(Local/Remote) --> Remote Server 1 --> Remote Database 1
      //------------------------------------------------------
      case '01':
        g_Server = SERVER01
        g_Database = DATABASE01
        g_URL = SERVERURL01
        break
      //------------------------------------------------------
      //  Client(Local/Remote) --> Remote Server 2 --> Remote Database 2
      //------------------------------------------------------
      case '02':
        g_Server = SERVER02
        g_Database = DATABASE02
        g_URL = SERVERURL02
        break
      //------------------------------------------------------
      //  Client(Local/Remote) --> Remote Server 3 --> Remote Database 3
      //------------------------------------------------------
      case '03':
        g_Server = SERVER03
        g_Database = DATABASE03
        g_URL = SERVERURL03
        break
      //------------------------------------------------------
      //  Client(Local/Remote) --> Remote Server 4 --> Remote Database 4
      //------------------------------------------------------
      case '04':
        g_Server = SERVER04
        g_Database = DATABASE04
        g_URL = SERVERURL04
        break
      //------------------------------------------------------
      //  Local Client --> Local Server 1 --> Remote Database 1
      //------------------------------------------------------
      case '11':
        g_Server = SERVER11
        g_Database = DATABASE01
        g_URL = SERVERURL11
        break
      //------------------------------------------------------
      //  Local Client --> Local Server 2 --> Remote Database 2
      //------------------------------------------------------
      case '12':
        g_Server = SERVER12
        g_Database = DATABASE02
        g_URL = SERVERURL12
        break
      //------------------------------------------------------
      //  Local Client --> Local Server 3 --> Remote Database 3
      //------------------------------------------------------
      case '13':
        g_Server = SERVER13
        g_Database = DATABASE03
        g_URL = SERVERURL13
        break
      //------------------------------------------------------
      //  Local Client --> Local Server 4 --> Remote Database 4
      //------------------------------------------------------
      case '14':
        g_Server = SERVER14
        g_Database = DATABASE04
        g_URL = SERVERURL14
        break
      //------------------------------------------------------
      //  Local Client --> Local Server --> Local Database 6
      //------------------------------------------------------
      case '16':
        g_Server = SERVER16
        g_Database = DATABASE6
        g_URL = SERVERURL16
        break
      //------------------------------------------------------
      //  Local Client --> Local Server --> Local Database 7
      //------------------------------------------------------
      case '17':
        g_Server = SERVER17
        g_Database = DATABASE7
        g_URL = SERVERURL17
        break
      //------------------------------------------------------
      //  Error
      //------------------------------------------------------
      default:
        g_Server = 'Error'
        g_Database = 'Error'
        g_URL = 'Error'
        break
    }
    if (debugLog) console.log(consoleLogTime(debugModule, 'g_Server'), g_Server)
    if (debugLog) console.log(consoleLogTime(debugModule, 'g_Database'), g_Database)
    if (debugLog) console.log(consoleLogTime(debugModule, 'g_URL'), g_URL)
  }
  //.............................................................................
  //.  Initialise Storage
  //.............................................................................
  function Init_Storage() {
    //
    //  Store Server, Database, URL
    //
    sessionStorage.setItem('App_Server_Database', JSON.stringify(g_server_database))
    sessionStorage.setItem('App_Node_Env', JSON.stringify(g_node_env))
    sessionStorage.setItem('App_Server', JSON.stringify(g_Server))
    sessionStorage.setItem('App_Database', JSON.stringify(g_Database))
    sessionStorage.setItem('App_URL', JSON.stringify(g_URL))
    //
    //  Navigation
    //
    sessionStorage.setItem('Nav_Page_Current', JSON.stringify(PAGESTARTAPP))
    sessionStorage.setItem('Nav_Page_Previous', JSON.stringify(''))
    //
    //  SignedIn Status
    //
    sessionStorage.setItem('User_SignedIn', false)
    //
    //  Quiz
    //
    sessionStorage.setItem('Pg_Qz_Owner', JSON.stringify(''))
    sessionStorage.setItem('Pg_Qz_OwnerGroup', JSON.stringify(''))
  }
  //.............................................................................
  //.  Handle Page Change
  //.............................................................................
  function handlePage(nextPage) {
    //
    //  Retrieve the state
    //
    let PageCurrent = JSON.parse(sessionStorage.getItem('Nav_Page_Current'))
    const PagePrevious = JSON.parse(sessionStorage.getItem('Nav_Page_Previous'))
    //
    //  If no change of Page, return
    //
    if (nextPage === PageCurrent) return
    //
    //  Back/Start ?
    //
    const PageNext =
      nextPage === 'PAGEBACK' ? PagePrevious : nextPage === 'PAGESTART' ? PAGESTART : nextPage
    //
    //  Quiz End, write history
    //
    if (PageCurrent === 'Quiz') {
      writeUsersHistory()
    }
    //
    //  Change of Page
    //
    if (debugLog)
      console.log(
        consoleLogTime(debugModule, `Current Page ${PageCurrent} ==> New Page ${PageNext}`)
      )
    //
    //  Update Previous Page
    //
    sessionStorage.setItem('Nav_Page_Previous', JSON.stringify(PageCurrent))
    if (debugLog)
      console.log(consoleLogTime(debugModule, `UPDATED Nav_Page_Previous ${PageCurrent}`))
    //
    //  If SignIN, Update signed in info
    //
    if (PageNext === 'Signin') {
      sessionStorage.setItem('User_SignedIn', false)
    }
    //
    //  Update NEW Page
    //
    sessionStorage.setItem('Nav_Page_Current', JSON.stringify(PageNext))
    if (debugLog) console.log(consoleLogTime(debugModule, `UPDATED Nav_Page_Current ${PageNext}`))
    //
    //  Update State
    //
    setPageCurrent(PageNext)
  }
  //...................................................................................
  //.  Render the component
  //...................................................................................
  return (
    <div>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Layout handlePage={handlePage} pageCurrent={pageCurrent}>
            <Control handlePage={handlePage} />
          </Layout>
          <CssBaseline />
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  )
}
