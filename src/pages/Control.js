//
//  Sub Components
//
import UsersSettings from './UsersSettings/UsersSettings'
import Splash from './Splash/Splash'
import Register from './Register/Register'
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
const debugLog = debugSettings()
const debugModule = 'Control'
//===================================================================================
export default function Control({ handlePage }) {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
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
