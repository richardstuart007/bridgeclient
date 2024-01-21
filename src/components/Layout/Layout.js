//
//  Libraries
//
import { Typography, AppBar, Toolbar, Avatar, Grid } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
//
//  Common Sub Components
//
import Navigation from './Navigation'
//
//  Components
//
import cards from '../../assets/images/cards.svg'
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
let debugLog
const debugModule = 'Layout'
//
//  Style overrides
//
const useStyles = makeStyles(theme => {
  return {
    page: {
      background: 'white',
      width: '100%',
      padding: theme.spacing(1)
    },
    root: {
      display: 'flex'
    },
    title: {
      marginLeft: theme.spacing(2)
    },
    clientserver: {
      marginLeft: theme.spacing(2)
    },
    welcome: {
      marginLeft: theme.spacing(2)
    },
    appBar: {
      background: 'green',
      width: '100%'
    },
    toolbar: theme.mixins.toolbar,
    avatar: {
      marginLeft: theme.spacing(2)
    }
  }
})
//============================================================================
//= Exported Module
//============================================================================
export default function Layout({ handlePage, children }) {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Debug Settings
  //
  debugLog = debugSettings()
  //...........................................................................
  // Module STATE
  //...........................................................................
  //
  //  Style overrides
  //
  const classes = useStyles()
  //
  //  Screen Width
  //
  const ScreenSmall = JSON.parse(sessionStorage.getItem('App_ScreenSmall'))
  //
  //  Current Page
  //
  const PageCurrent = JSON.parse(sessionStorage.getItem('Nav_Page_Current'))
  if (debugLog) console.log(consoleLogTime(debugModule, 'PageCurrent'), PageCurrent)
  //...........................................................................
  // Module Main Line
  //...........................................................................
  //
  //  Title
  //
  let title
  switch (PageCurrent) {
    case 'UsersSettings':
      title = 'Settings'
      break
    case 'Register':
      title = 'Register'
      break
    case 'Signin':
      title = 'SignIn'
      break
    case 'Splash':
      title = 'Splash'
      break
    case 'Quiz':
      title = 'Quiz'
      break
    case 'QuizReview':
      title = 'Quiz Review'
      break
    case 'Library':
      title = 'Library'
      break
    default:
      title = PageCurrent
      break
  }
  //
  //  Add clientserver
  //
  const App_Server = JSON.parse(sessionStorage.getItem('App_Server'))
  const App_Database = JSON.parse(sessionStorage.getItem('App_Database'))
  const clientserver = ` Server(${App_Server}) Database(${App_Database})`
  //
  //  Default if not signed in
  //
  let User_Name = ''
  let User_Admin = false
  let User_Dev = false
  let User_Switched = false
  //
  //  Signed in User
  //
  let ShowClientServer = true
  const User_SignedIn = JSON.parse(sessionStorage.getItem('User_SignedIn'))
  if (User_SignedIn) {
    const User_User = JSON.parse(sessionStorage.getItem('User_User'))
    const User_UserSwitch = JSON.parse(sessionStorage.getItem('User_UserSwitch'))
    User_Name = User_User.u_name
    User_Admin = User_User.u_admin
    User_Dev = User_User.u_dev
    User_Switched = User_UserSwitch
    //
    //  Do not show clientserver if not dev
    //
    ShowClientServer = User_Dev
  }
  //...................................................................................
  //.  Render the component
  //...................................................................................
  return (
    <div className={classes.root}>
      {/* .......................................................................................... */}
      {/* app bar                                         */}
      {/* .......................................................................................... */}
      <AppBar position='fixed' className={classes.appBar} elevation={0} color='primary'>
        <Toolbar>
          <Grid container alignItems='center'>
            {/* .......................................................................................... */}
            <Grid item>
              <Avatar className={classes.avatar} src={cards} />
            </Grid>
            {/* .......................................................................................... */}
            <Grid item>
              <Typography className={classes.title} sx={{ color: 'yellow' }}>
                {title}
              </Typography>
            </Grid>
            {/* .......................................................................................... */}
            {User_SignedIn ? (
              <Grid item>
                <Typography
                  className={classes.welcome}
                  sx={{
                    display: { xs: 'none', sm: 'inline' },
                    color: 'red'
                  }}
                >
                  {User_Name}
                </Typography>
              </Grid>
            ) : null}
            {/* .......................................................................................... */}
            {User_Admin ? (
              <Grid item>
                <Typography
                  className={classes.clientserver}
                  sx={{
                    display: { xs: 'none', sm: 'inline', color: 'white', backgroundColor: 'red' }
                  }}
                >
                  ADMIN
                </Typography>
              </Grid>
            ) : null}
            {/* .......................................................................................... */}
            {User_Dev ? (
              <Grid item>
                <Typography
                  className={classes.clientserver}
                  sx={{
                    display: { xs: 'none', sm: 'inline', color: 'white', backgroundColor: 'red' }
                  }}
                >
                  DEV
                </Typography>
              </Grid>
            ) : null}
            {/* .......................................................................................... */}
            {User_Switched ? (
              <Grid item>
                <Typography
                  className={classes.clientserver}
                  sx={{
                    display: { xs: 'none', sm: 'inline', color: 'white', backgroundColor: 'purple' }
                  }}
                >
                  SWITCHED
                </Typography>
              </Grid>
            ) : null}
            {/* .......................................................................................... */}
            {ShowClientServer ? (
              <Grid item>
                <Typography
                  className={classes.clientserver}
                  sx={{ display: { xs: 'none', sm: 'inline' } }}
                >
                  {clientserver}
                </Typography>
              </Grid>
            ) : null}

            {/* .......................................................................................... */}
            <Grid item xs></Grid>

            {/* .......................................................................................... */}
            {!ScreenSmall && <Navigation handlePage={handlePage} />}
            {/* .......................................................................................... */}
          </Grid>
        </Toolbar>
      </AppBar>
      {/* .......................................................................................... */}
      {/* main content                          */}
      {/* .......................................................................................... */}
      <div className={classes.page}>
        <div className={classes.toolbar}></div>
        {ScreenSmall && <Navigation handlePage={handlePage} />}
        {children}
      </div>
    </div>
  )
}
