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
import writeHistory from '../services/writeHistory'
//
//  Common Components
//
import Layout from '../components/Layout/Layout'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'App'
//
//  Layout Theme
//
const theme = createTheme({})
//------------------------------------------------------------------------
//  Remote - Production
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
//  Local
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
//
//  Start Pages
//
const { PAGESTART } = require('../services/constants.js')
const { PAGESTARTAPP } = require('../services/constants.js')
//
// Global
//
let g_firstTimeFlag = true
let w_server_database
let w_node_env
let w_Database = 'Error'
let w_Server = 'Error'
let w_URL = 'Error'
//----------------------------------------------------------------------------
//- Main Line
//----------------------------------------------------------------------------
export default function App() {
  const [pageCurrent, setPageCurrent] = useState(PAGESTARTAPP)
  //
  //  Screen Width
  //
  const ScreenMedium = useMediaQuery(theme.breakpoints.up('sm'))
  const ScreenSmall = !ScreenMedium
  sessionStorage.setItem('App_Set_ScreenSmall', ScreenSmall)
  //
  //  Try
  //
  try {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
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
  } finally {
    if (debugLog) console.log(consoleLogTime(debugModule, 'End'))
  }
  //.............................................................................
  //  First Time Setup
  //.............................................................................
  function firstTime() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'First Time APP Reset'))
    //
    //  Environment variables
    //
    w_server_database = process.env.REACT_APP_SERVER_DATABASE
    w_server_database = w_server_database.trim()
    w_node_env = process.env.NODE_ENV
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
    switch (w_server_database) {
      //------------------------------------------------------
      //  Client(Local/Remote) --> Remote Server 1 --> Remote Database 1
      //------------------------------------------------------
      case '01':
        w_Server = SERVER01
        w_Database = DATABASE01
        w_URL = SERVERURL01
        break
      //------------------------------------------------------
      //  Client(Local/Remote) --> Remote Server 2 --> Remote Database 2
      //------------------------------------------------------
      case '02':
        w_Server = SERVER02
        w_Database = DATABASE02
        w_URL = SERVERURL02
        break
      //------------------------------------------------------
      //  Client(Local/Remote) --> Remote Server 3 --> Remote Database 3
      //------------------------------------------------------
      case '03':
        w_Server = SERVER03
        w_Database = DATABASE03
        w_URL = SERVERURL03
        break
      //------------------------------------------------------
      //  Client(Local/Remote) --> Remote Server 4 --> Remote Database 4
      //------------------------------------------------------
      case '04':
        w_Server = SERVER04
        w_Database = DATABASE04
        w_URL = SERVERURL04
        break
      //------------------------------------------------------
      //  Local Client --> Local Server 1 --> Remote Database 1
      //------------------------------------------------------
      case '11':
        w_Server = SERVER11
        w_Database = DATABASE01
        w_URL = SERVERURL11
        break
      //------------------------------------------------------
      //  Local Client --> Local Server 2 --> Remote Database 2
      //------------------------------------------------------
      case '12':
        w_Server = SERVER12
        w_Database = DATABASE02
        w_URL = SERVERURL12
        break
      //------------------------------------------------------
      //  Local Client --> Local Server 3 --> Remote Database 3
      //------------------------------------------------------
      case '13':
        w_Server = SERVER13
        w_Database = DATABASE03
        w_URL = SERVERURL13
        break
      //------------------------------------------------------
      //  Local Client --> Local Server 4 --> Remote Database 4
      //------------------------------------------------------
      case '14':
        w_Server = SERVER14
        w_Database = DATABASE04
        w_URL = SERVERURL14
        break
      //------------------------------------------------------
      //  Local Client --> Local Server --> Local Database 6
      //------------------------------------------------------
      case '16':
        w_Server = SERVER16
        w_Database = DATABASE6
        w_URL = SERVERURL16
        break
      //------------------------------------------------------
      //  Local Client --> Local Server --> Local Database 7
      //------------------------------------------------------
      case '17':
        w_Server = SERVER17
        w_Database = DATABASE7
        w_URL = SERVERURL17
        break
      //------------------------------------------------------
      //  Error
      //------------------------------------------------------
      default:
        break
    }
  }
  //.............................................................................
  //.  Initialise Storage
  //.............................................................................
  function Init_Storage() {
    //
    //  Store Server, Database, URL
    //
    sessionStorage.setItem('App_Set_Server_Database', JSON.stringify(w_server_database))
    sessionStorage.setItem('App_Set_Node_Env', JSON.stringify(w_node_env))
    sessionStorage.setItem('App_Set_Server', JSON.stringify(w_Server))
    sessionStorage.setItem('App_Set_Database', JSON.stringify(w_Database))
    sessionStorage.setItem('App_Set_URL', JSON.stringify(w_URL))
    //
    //  Navigation
    //
    sessionStorage.setItem('App_Nav_Page_Current', JSON.stringify(PAGESTARTAPP))
    sessionStorage.setItem('App_Nav_Page_Previous', JSON.stringify(''))
    //
    //  SignedIn Status
    //
    sessionStorage.setItem('User_Set_SignedIn', false)
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
    let PageCurrent = JSON.parse(sessionStorage.getItem('App_Nav_Page_Current'))
    const PagePrevious = JSON.parse(sessionStorage.getItem('App_Nav_Page_Previous'))
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
      writeHistory()
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
    sessionStorage.setItem('App_Nav_Page_Previous', JSON.stringify(PageCurrent))
    if (debugLog)
      console.log(consoleLogTime(debugModule, `UPDATED App_Nav_Page_Previous ${PageCurrent}`))
    //
    //  If SignIN, Update signed in info
    //
    if (PageNext === 'Signin') {
      sessionStorage.setItem('User_Set_SignedIn', false)
    }
    //
    //  Update NEW Page
    //
    sessionStorage.setItem('App_Nav_Page_Current', JSON.stringify(PageNext))
    if (debugLog)
      console.log(consoleLogTime(debugModule, `UPDATED App_Nav_Page_Current ${PageNext}`))
    //
    //  Update State
    //
    setPageCurrent(PageNext)
  }
  //.............................................................................
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
