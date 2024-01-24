//
//  Sub Components
//
import UsersSettings from './UsersSettings/UsersSettings'
import Splash from './Splash/Splash'
import Register from './Register/Register'
import RegisterPwd from './RegisterPwd/RegisterPwd'
import RegisterUser from './RegisterUser/RegisterUser'
import Signin from './Signin/Signin'
import Quiz from './Quiz/Quiz'
import QuizReview from './QuizReview/QuizReview'
import QuizHistory from './QuizHistory/QuizHistory'
import QuizHistoryDetail from './QuizHistory/QuizHistoryDetail'
import Library from './Library/Library'
import SwitchUser from './SwitchUser/SwitchUser'
//
//  Debug Settings
//
import consoleLogTime from '../debug/consoleLogTime'
import debugSettings from '../debug/debugSettings'
let debugLog
const debugModule = 'Control'
//===================================================================================
export default function Control({ handlePage }) {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Debug Settings
  //
  debugLog = debugSettings()
  //.............................................................................
  //.  Main Line
  //.............................................................................
  //
  //  Retrieve the state
  //
  const PageCurrent = JSON.parse(sessionStorage.getItem('Nav_Page_Current'))
  //
  //  Present the selected component
  //
  if (debugLog) console.log(consoleLogTime(debugModule, 'PageCurrent'), PageCurrent)
  return (
    <>
      {PageCurrent === 'Splash' ? (
        <Splash handlePage={handlePage} />
      ) : PageCurrent === 'UsersSettings' ? (
        <UsersSettings handlePage={handlePage} />
      ) : PageCurrent === 'UsersSettings' ? (
        <UsersSettings handlePage={handlePage} />
      ) : PageCurrent === 'Register' ? (
        <Register handlePage={handlePage} />
      ) : PageCurrent === 'RegisterPwd' ? (
        <RegisterPwd handlePage={handlePage} />
      ) : PageCurrent === 'RegisterUser' ? (
        <RegisterUser handlePage={handlePage} />
      ) : PageCurrent === 'Signin' ? (
        <Signin handlePage={handlePage} />
      ) : PageCurrent === 'Library' ? (
        <Library handlePage={handlePage} />
      ) : PageCurrent === 'Quiz' ? (
        <Quiz handlePage={handlePage} />
      ) : PageCurrent === 'QuizReview' ? (
        <QuizReview handlePage={handlePage} />
      ) : PageCurrent === 'QuizHistory' ? (
        <QuizHistory handlePage={handlePage} />
      ) : PageCurrent === 'QuizHistoryDetail' ? (
        <QuizHistoryDetail handlePage={handlePage} />
      ) : PageCurrent === 'SwitchUser' ? (
        <SwitchUser handlePage={handlePage} />
      ) : null}
    </>
  )
}
