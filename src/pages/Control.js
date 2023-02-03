//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
//
//  Sub Components
//
import UsersSettings from './UsersSettings/UsersSettings'
import Splash from './Splash/Splash'
import Register from './Register/Register'
import Signin from './Signin/Signin'
import QuizSelect from './QuizSelect/QuizSelect'
import Quiz from './Quiz/Quiz'
import QuizReview from './QuizReview/QuizReview'
import QuizHistory from './QuizHistory/QuizHistory'
import QuizHistoryDetail from './QuizHistory/QuizHistoryDetail'
import LibraryRefs from './LibraryRefs/LibraryRefs'
import Library from './Library/Library'
import SwitchUser from './SwitchUser/SwitchUser'
//
// Debug Settings
//
const debugLog = debugSettings()
//===================================================================================
function Control({ handlePage }) {
  if (debugLog) console.log('Start Control')
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
      {(() => {
        switch (PageCurrent) {
          case 'Splash':
            return <Splash handlePage={handlePage} />
          case 'UsersSettings':
            return <UsersSettings handlePage={handlePage} />
          case 'Register':
            return <Register handlePage={handlePage} />
          case 'Signin':
            return <Signin handlePage={handlePage} />
          case 'QuizSelect':
            return <QuizSelect handlePage={handlePage} />
          case 'LibraryRefs':
            return <LibraryRefs handlePage={handlePage} />
          case 'Library':
            return <Library handlePage={handlePage} />
          case 'Quiz':
            return <Quiz handlePage={handlePage} />
          case 'QuizReview':
            return <QuizReview handlePage={handlePage} />
          case 'QuizHistory':
            return <QuizHistory handlePage={handlePage} />
          case 'QuizHistoryDetail':
            return <QuizHistoryDetail handlePage={handlePage} />
          case 'SwitchUser':
            return <SwitchUser handlePage={handlePage} />
          default:
            return null
        }
      })()}
    </>
  )
}

export default Control
