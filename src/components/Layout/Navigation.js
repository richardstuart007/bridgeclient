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
//===================================================================================
export default function Navigation({ handlePage }) {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  const classes = useStyles()
  //
  //  Define
  //
  const PageCurrent = JSON.parse(sessionStorage.getItem('App_Nav_Page_Current'))
  const User_Set_SignedIn = JSON.parse(sessionStorage.getItem('User_Set_SignedIn'))
  //
  //  Screen Width
  //
  const ScreenSmall = JSON.parse(sessionStorage.getItem('App_Set_ScreenSmall'))
  let buttonTextSignout = 'Signout'
  let buttonTextSettings = 'Settings'
  if (ScreenSmall) {
    buttonTextSignout = null
    buttonTextSettings = null
  }
  //
  //  Show SignOut Button ?
  //
  let showButton_Signin
  User_Set_SignedIn ? (showButton_Signin = true) : (showButton_Signin = false)
  //
  //  Show Settings Button ?
  //
  let showButton_UsersSettings
  User_Set_SignedIn && (PageCurrent === 'QuizHistory' || PageCurrent === 'Library')
    ? (showButton_UsersSettings = true)
    : (showButton_UsersSettings = false)
  //
  //  Show History Button ?
  //
  let showButton_QuizHistory
  User_Set_SignedIn &&
  PageCurrent !== 'QuizHistory' &&
  PageCurrent !== 'QuizHistoryDetail' &&
  PageCurrent !== 'UsersSettings' &&
  PageCurrent !== 'Quiz'
    ? (showButton_QuizHistory = true)
    : (showButton_QuizHistory = false)
  //
  //  Show Library Button ?
  //
  let showButton_Library
  User_Set_SignedIn &&
  PageCurrent !== 'Library' &&
  PageCurrent !== 'Quiz' &&
  PageCurrent !== 'UsersSettings'
    ? (showButton_Library = true)
    : (showButton_Library = false)
  //
  //  Show SwitchUser Button ?
  //
  let User_Admin = false
  if (User_Set_SignedIn) {
    const User_Set_User = JSON.parse(sessionStorage.getItem('User_Set_User'))
    User_Admin = User_Set_User.u_admin
  }
  let showButton_SwitchUser
  User_Set_SignedIn && !ScreenSmall && User_Admin
    ? (showButton_SwitchUser = true)
    : (showButton_SwitchUser = false)
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
        {showButton_Signin ? (
          <MyActionButton
            startIcon={<LogoutIcon fontSize='small' />}
            color='warning'
            onClick={() => handlePage('Signin')}
            text={buttonTextSignout}
          ></MyActionButton>
        ) : null}
        {/* .......................................................................................... */}
      </Grid>
    </div>
  )
}
