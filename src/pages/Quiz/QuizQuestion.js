//
//  Libraries
//
import { Typography } from '@mui/material'
import { teal } from 'material-ui-colors'
//
//  Components
//
import MyButton from '../../components/controls/MyButton'
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
  const { qowner, qgroup, qid, qdetail } = quizRow
  let hyperLink
  qdetail.substring(0, 8) === 'https://' ? (hyperLink = true) : (hyperLink = false)
  //
  //  Hyperlink open
  //
  const openTab = hyperlink => () => {
    window.open(hyperlink, '_blank')
  }
  //
  //  Question Info
  //
  const User_Set_User = JSON.parse(sessionStorage.getItem('User_Set_User'))
  const User_Dev = User_Set_User.u_dev
  let QuestionInfo = `${qowner}/${qgroup} ${quizQuestion}/${quizTotal}`
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
