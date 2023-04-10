//
//  Libraries
//
import { Grid } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
//
//  Icons
//
import ScoreboardIcon from '@mui/icons-material/Scoreboard'
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications'
import LogoutIcon from '@mui/icons-material/Logout'
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount'
//
//  Components
//
import MyActionButton from '../controls/MyActionButton'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
import consoleLogTime from '../../debug/consoleLogTime'
//...........................................................................
// Global CONSTANTS
//...........................................................................
//
//  Debug Settings
//
const debugLog = debugSettings()
const debugModule = 'Navigation'
//
//  Style overrides
//
const useStyles = makeStyles(theme => {
  return {
    root: {
      display: 'flex'
    }
  }
})
//============================================================================
//= Exported Module
//============================================================================
export default function Navigation({ handlePage }) {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //...........................................................................
  // Module STATE
  //...........................................................................
  const classes = useStyles()
  let showButton_Library
  let buttonTextSignout = 'Signout'
  let buttonTextSettings = 'Settings'
  let showButton_UsersSettings
  let showButton_QuizHistory
  let User_Admin = false
  let showButton_SwitchUser
  let showButton_Signout
  //...........................................................................
  // Module Main Line
  //...........................................................................
  //
  //  Try
  //
  try {
    //
    //  Get State
    //
    const PageCurrent = JSON.parse(sessionStorage.getItem('Nav_Page_Current'))
    const User_SignedIn = JSON.parse(sessionStorage.getItem('User_SignedIn'))
    //
    //  Small screen
    //
    const ScreenSmall = JSON.parse(sessionStorage.getItem('App_ScreenSmall'))
    if (ScreenSmall) {
      buttonTextSignout = null
      buttonTextSettings = null
    }
    //
    //  Show SignOut Button ?
    //
    User_SignedIn ? (showButton_Signout = true) : (showButton_Signout = false)
    //
    //  Show Settings Button ?
    //
    User_SignedIn && (PageCurrent === 'QuizHistory' || PageCurrent === 'Library')
      ? (showButton_UsersSettings = true)
      : (showButton_UsersSettings = false)
    //
    //  Show History Button ?
    //
    User_SignedIn &&
    PageCurrent !== 'QuizHistory' &&
    PageCurrent !== 'QuizHistoryDetail' &&
    PageCurrent !== 'UsersSettings' &&
    PageCurrent !== 'Quiz'
      ? (showButton_QuizHistory = true)
      : (showButton_QuizHistory = false)
    //
    //  Show Library Button ?
    //
    User_SignedIn &&
    PageCurrent !== 'Library' &&
    PageCurrent !== 'Quiz' &&
    PageCurrent !== 'UsersSettings'
      ? (showButton_Library = true)
      : (showButton_Library = false)
    //
    //  Show SwitchUser Button ?
    //
    if (User_SignedIn) {
      const User_User = JSON.parse(sessionStorage.getItem('User_User'))
      User_Admin = User_User.u_admin
    }
    User_SignedIn && !ScreenSmall && User_Admin
      ? (showButton_SwitchUser = true)
      : (showButton_SwitchUser = false)
  } catch (e) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
    console.log(e)
  }
  //...................................................................................
  //.  Render the component
  //...................................................................................
  return (
    <div className={classes.root}>
      <Grid container alignItems='center'>
        {/* .......................................................................................... */}

        {showButton_Library ? (
          <MyActionButton
            startIcon={<ScoreboardIcon fontSize='small' />}
            color='warning'
            onClick={() => handlePage('Library')}
            text='Library'
          ></MyActionButton>
        ) : null}
        {/* .......................................................................................... */}

        {showButton_QuizHistory ? (
          <MyActionButton
            startIcon={<ScoreboardIcon fontSize='small' />}
            color='warning'
            onClick={() => handlePage('QuizHistory')}
            text='History'
          ></MyActionButton>
        ) : null}
        {/* .......................................................................................... */}
        {showButton_UsersSettings ? (
          <MyActionButton
            startIcon={<SettingsApplicationsIcon fontSize='small' />}
            color='warning'
            onClick={() => handlePage('UsersSettings')}
            text={buttonTextSettings}
          ></MyActionButton>
        ) : null}

        {/* .......................................................................................... */}
        {showButton_SwitchUser ? (
          <MyActionButton
            startIcon={<SwitchAccountIcon fontSize='small' />}
            color='warning'
            onClick={() => handlePage('SwitchUser')}
            text='Switch User'
          ></MyActionButton>
        ) : null}
        {/* .......................................................................................... */}
        {showButton_Signout ? (
          <MyActionButton
            startIcon={<LogoutIcon fontSize='small' />}
            color='warning'
            onClick={() => {
              const OwnersString = JSON.parse(sessionStorage.getItem('User_OwnersString'))
              sessionStorage.setItem('User_OwnersString_Prev', JSON.stringify(OwnersString))
              handlePage('Signin')
            }}
            text={buttonTextSignout}
          ></MyActionButton>
        ) : null}
        {/* .......................................................................................... */}
      </Grid>
    </div>
  )
}
