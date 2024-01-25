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
import AppInit from './AppInit'
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
let debugLog
const debugModule = 'App'
//
//  Layout Theme
//
const theme = createTheme({})
//
//  Start Pages
//
let PAGESTART
//...........................................................................
// Global VARIABLES
//...........................................................................
let g_AppFirstTime = true
//============================================================================
//= Exported Module
//============================================================================
export default function App() {
  //
  //  Debug Settings
  //
  debugLog = debugSettings()
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //...........................................................................
  // Module STATE
  //...........................................................................
  const [pageCurrent, setPageCurrent] = useState()
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
  //  First Time Setup
  //
  if (g_AppFirstTime) {
    AppFirstTime()
  }
  //.............................................................................
  //  First Time Setup
  //.............................................................................
  function AppFirstTime() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'First Time APP Reset'))
    g_AppFirstTime = false
    //
    //  App Initialisation
    //
    AppInit()
    //
    //  Start Pages
    //
    const App_Env = JSON.parse(sessionStorage.getItem('App_Env'))
    PAGESTART = App_Env.PAGESTART
    const PAGESTARTAPP = App_Env.PAGESTARTAPP
    setPageCurrent(PAGESTARTAPP)
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
