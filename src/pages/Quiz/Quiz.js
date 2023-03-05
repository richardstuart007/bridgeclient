//
//  Libraries
//
import { useState } from 'react'
import { Box } from '@mui/material'
import { Card } from '@mui/material'
//
//  Controls
//
import MyButton from '../../components/controls/MyButton'
//
//  Sub Components
//
import QuizPanel from './QuizPanel'
import QuizHands from '../QuizHands/QuizHands'
import QuizBidding from '../QuizBidding/QuizBidding'
import QuizQuestion from './QuizQuestion'
import QuizLinearProgress from './QuizLinearProgress'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
import consoleLogTime from '../../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'Quiz'
//.............................................................................
//.  Initialisation
//.............................................................................
//
//  Global store variables
//
let g_Idx = 0
let g_quizQuest = []
let g_questCount = 0
let g_quizRow = {}
let g_quizAns = []
//...................................................................................
//.  Main Line
//...................................................................................
export default function Quiz({ handlePage }) {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Signed in User
  //
  const User_Set_User = JSON.parse(sessionStorage.getItem('User_Set_User'))
  //
  //  Show Linear Bars ?
  //
  const showLinearProgress = User_Set_User.u_showprogress
  const showLinearScore = User_Set_User.u_showscore
  //
  //  Define the State variables
  //
  const [ansPass, setAnsPass] = useState(0)
  const [ansCount, setAnsCount] = useState(0)
  const [value, setValue] = useState(0)
  const [id, setId] = useState(0)
  const [showSubmit, setShowSubmit] = useState(false)
  const [quizRow, setQuizRow] = useState(true)
  //
  //  Reset Quiz State
  //
  const Pg_Qz_Reset = JSON.parse(sessionStorage.getItem('Pg_Qz_Reset'))
  if (Pg_Qz_Reset) handleQuizReset()
  //
  //  No data (Error)
  //
  if (g_questCount === 0) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'No data'))
    return <p style={{ color: 'red' }}>No data</p>
  }
  if (debugLog) console.log(consoleLogTime(debugModule, 'g_quizRow'), g_quizRow)
  if (debugLog) console.log(consoleLogTime(debugModule, 'g_quizRow.qid'), g_quizRow.qid)
  //...................................................................................
  //.  Reset the Quiz
  //...................................................................................
  function handleQuizReset() {
    //
    //  Reset flag
    //
    if (debugLog) console.log(consoleLogTime(debugModule, 'Pg_Qz_Reset'))
    sessionStorage.setItem('Pg_Qz_Reset', false)
    //
    //  Get store data & copy to State
    //
    const Pg_Qz_Q_AllJSON = sessionStorage.getItem('Pg_Qz_Q_All')
    const Pg_Qz_Q_All = JSON.parse(Pg_Qz_Q_AllJSON)
    if (debugLog) console.log(consoleLogTime(debugModule), Pg_Qz_Q_All)

    let quest = []
    Pg_Qz_Q_All.forEach(row => {
      const rowData = { ...row }
      quest.push(rowData)
    })
    //
    // Update Questions from Store
    //
    g_quizQuest = quest
    g_questCount = quest.length
    g_Idx = 0
    g_quizRow = g_quizQuest[g_Idx]
    setQuizRow(g_quizRow)
    if (debugLog) console.log(consoleLogTime(debugModule, 'g_quizQuest '), g_quizQuest)
    if (debugLog) console.log(consoleLogTime(debugModule, 'g_questCount '), g_questCount)
    if (debugLog) console.log(consoleLogTime(debugModule, 'g_quizRow '), g_quizRow)
    //
    // Reset Answers
    //
    g_quizAns = []
    sessionStorage.setItem('Pg_Qz_A', JSON.stringify(g_quizAns))
    setAnsPass(0)
    setAnsCount(0)
  }
  //...................................................................................
  //.  Form Submit
  //...................................................................................
  function handleSubmit() {
    if (debugLog) console.log(consoleLogTime(debugModule, `Function: HandleSubmit`))
    if (debugLog) console.log(consoleLogTime(debugModule, `ID selected ${id}`))
    if (debugLog) console.log(consoleLogTime(debugModule, 'g_Idx ', g_Idx, 'qid '), g_quizRow.qid)
    //
    //  No selection
    //
    if (!id) {
      return
    }
    //
    //  Update count
    //
    if (debugLog) console.log(consoleLogTime(debugModule, 'g_Idx ', g_Idx, 'id '), id)
    if (id === 1) {
      const nextAnsPass = ansPass + 1
      setAnsPass(nextAnsPass)
    }
    //
    //   Write Answers
    //
    if (debugLog) console.log(consoleLogTime(debugModule, 'g_Idx ', g_Idx, 'id '), id)
    g_quizAns[g_Idx] = id
    if (debugLog) console.log(consoleLogTime(debugModule, 'g_quizAns '), g_quizAns)
    sessionStorage.setItem('Pg_Qz_A', JSON.stringify(g_quizAns))

    const nextAnsCount = ansCount + 1
    setAnsCount(nextAnsCount)
    if (debugLog) console.log(consoleLogTime(debugModule, 'nextAnsCount '), nextAnsCount)
    //
    //  End of data
    //
    if (g_Idx + 1 >= g_questCount) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'g_quizAns'), g_quizAns)
      //
      //  Review
      //
      handlePage('QuizReview')
    }
    //
    //  Next row
    //
    g_Idx++
    g_quizRow = g_quizQuest[g_Idx]
    setQuizRow(g_quizRow)
    if (debugLog) console.log(consoleLogTime(debugModule, 'g_quizRow'), g_quizRow)
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <QuizQuestion quizRow={quizRow} quizQuestion={g_Idx + 1} quizTotal={g_questCount} />
      <QuizBidding qid={quizRow.qid} />
      <QuizHands qid={quizRow.qid} />
      <Card sx={{ maxWidth: 600, marginTop: '16px' }} style={{ backgroundColor: 'LightGray' }}>
        <QuizPanel
          quizRow={quizRow}
          value={value}
          setValue={setValue}
          setId={setId}
          setShowSubmit={setShowSubmit}
        />
        {/* .......................................................................................... */}
        <Box>
          {showSubmit ? (
            <MyButton
              text='Submit Answer'
              onClick={() => {
                handleSubmit()
              }}
            />
          ) : null}
        </Box>
      </Card>
      {/* .......................................................................................... */}
      {showLinearProgress ? (
        <QuizLinearProgress count={ansCount} total={g_questCount} text={'Progress'} />
      ) : null}
      {/* .......................................................................................... */}
      {showLinearScore ? (
        <QuizLinearProgress count={ansPass} total={ansCount} text={'Score'}></QuizLinearProgress>
      ) : null}
      {/* .......................................................................................... */}
      <Box sx={{ mt: 2, maxWidth: 600 }}>
        <MyButton
          type='submit'
          text='Back'
          color='warning'
          variant='contained'
          onClick={() => {
            handlePage('PAGEBACK')
          }}
        />
        {/* .......................................................................................... */}
        {g_Idx > 0 ? (
          <MyButton
            type='submit'
            text='End/Review'
            color='warning'
            variant='contained'
            sx={{ float: 'right' }}
            onClick={() => {
              handlePage('QuizReview')
            }}
          />
        ) : null}
      </Box>
      {/* .......................................................................................... */}
    </>
  )
}
