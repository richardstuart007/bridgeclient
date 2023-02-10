//
//  Libraries
//
import { Typography } from '@mui/material'
import { teal } from 'material-ui-colors'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
//
//  Components
//
import MyButton from '../../components/controls/MyButton'
//.............................................................................
//.  Initialisation
//.............................................................................
//
// Debug Settings
//
const debugLog = debugSettings(true)
//===================================================================================
export default function QuizQuestion(params) {
  //...................................................................................
  //.  Main Line
  //...................................................................................
  //
  //  Deconstruct params
  //
  const { quizRow, quizQuestion, quizTotal = 0 } = params
  //
  //  Deconstruct row
  //
  if (debugLog) console.log('quizRow ', quizRow)
  const { qgroup, qid, qdetail } = quizRow
  let hyperLink
  qdetail.substring(0, 8) === 'https://' ? (hyperLink = true) : (hyperLink = false)
  if (debugLog) console.log('hyperLink ', hyperLink)
  //
  //  Hyperlink open
  //
  const openTab = hyperlink => () => {
    if (debugLog) console.log('hyperlink ', hyperlink)
    window.open(hyperlink, '_blank')
  }
  //
  //  Question Info
  //
  const User_Settings_User = JSON.parse(sessionStorage.getItem('User_Settings_User'))
  const User_Dev = User_Settings_User.u_dev
  let QuestionInfo = `${qgroup} ${quizQuestion}/${quizTotal}`
  if (User_Dev) QuestionInfo = QuestionInfo + ` (${qid})`
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      {/* .......................................................................................... */}
      {/* Question number and ID */}
      {/* .......................................................................................... */}
      <Typography variant='subtitle2' style={{ color: teal['A700'] }} sx={{ marginTop: '8px' }}>
        {QuestionInfo}
      </Typography>
      {/* .......................................................................................... */}
      {/* Hyperlink Button */}
      {/* .......................................................................................... */}
      {hyperLink && (
        <MyButton
          onClick={openTab(qdetail)}
          type='submit'
          style={{ color: 'white' }}
          size='small'
          text='Click to view the Question'
        ></MyButton>
      )}
      {/* .......................................................................................... */}
    </>
  )
}
