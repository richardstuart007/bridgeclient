//
//  Libraries
//
import { useState, useEffect } from 'react'
import { Typography, Box } from '@mui/material'
//
//  Controls
//
import MyButton from '../../components/controls/MyButton'
//
//  Sub Components
//
import QuizReviewAnswers from '../QuizReview/QuizReviewAnswers'
import QuizHands from '../QuizHands/QuizHands'
import QuizBidding from '../QuizBidding/QuizBidding'
import QuizQuestion from '../Quiz/QuizQuestion'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
import consoleLogTime from '../../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'QuizHistoryDetail'
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuizHistoryDetail({ handlePage }) {
  //
  //  Counts
  //
  const [countPass, setCountPass] = useState(0)
  const [countAns, setCountAns] = useState(0)
  const [countReview, setCountReview] = useState(0)
  const [mark, setMark] = useState(0)
  const [quizRow, setQuizRow] = useState(null)
  //
  //  Arrays & Index
  //
  const [arrQuest, setArrQuest] = useState([])
  const [arrAns, setArrAns] = useState([])
  const [arrAnsNum, setArrAnsNum] = useState([])
  const [ansIdx, setAnsIdx] = useState(0)
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Signed in User
  //
  const User_User = JSON.parse(sessionStorage.getItem('User_User'))
  //
  //  Load the data array from the store
  //
  useEffect(() => {
    firstLoad()
    // eslint-disable-next-line
  }, [])
  //
  //  No data to review
  //
  if (!quizRow) {
    if (countAns === 0) {
      return (
        <>
          <Typography variant='subtitle1' sx={{ marginTop: '8px' }}>
            Waiting for data
          </Typography>
        </>
      )
    } else {
      return (
        <>
          <Typography variant='subtitle1' sx={{ marginTop: '8px' }}>
            Result ({mark}%) {countPass} out of {countAns}. WELL DONE !!
          </Typography>
        </>
      )
    }
  }
  //
  //  Hide/Show Previous/Next Buttons
  //
  let hidePreviousButton
  ansIdx + 1 === 1 ? (hidePreviousButton = true) : (hidePreviousButton = false)
  let hideNextButton
  ansIdx + 1 === countReview ? (hideNextButton = true) : (hideNextButton = false)
  //...................................................................................
  //.  First time data received
  //...................................................................................
  function firstLoad() {
    //
    //  Get Row Values
    //
    const row = JSON.parse(sessionStorage.getItem('Pg_Qd_Row'))
    updateSelection(row)
  }
  //...................................................................................
  //.  Update Selection
  //...................................................................................
  function updateSelection(row) {
    //
    //  Get Stored Data
    //
    const Pg_Qz_Q_All = JSON.parse(sessionStorage.getItem('Pg_Qz_Q_All'))
    const Hist_r_ans = row.r_ans
    //
    //  Questions
    //
    let ArrQuestions = []
    Pg_Qz_Q_All.forEach(row => {
      const rowData = { ...row }
      ArrQuestions.push(rowData)
    })
    setArrQuest(ArrQuestions)
    //
    //  Answers
    //
    let Ans = []
    let AnsNum = []
    let AnsPass = 0
    let AnsCount = 0
    let AnsQuestIdx = -1
    let AnsReview = 0

    Hist_r_ans.forEach(id => {
      AnsCount++
      AnsQuestIdx++
      //
      //  Only show failed answers ?
      //
      let ReviewSkipPass = User_User.u_skipcorrect
      //
      //  BUGS!
      //
      ReviewSkipPass = false
      if (id !== 1 || !ReviewSkipPass) {
        Ans.push(id)
        AnsNum.push(AnsQuestIdx)
        AnsReview++
      }
      if (id === 1) AnsPass++
    })
    //
    //  Set State
    //
    setCountReview(AnsReview)
    setCountAns(AnsCount)
    setCountPass(AnsPass)
    setArrAns(Ans)
    setArrAnsNum(AnsNum)
    //
    //  Mark%
    //
    if (AnsCount > 0) setMark(Math.round((100 * AnsPass) / AnsCount))
    //
    //  Nothing to review
    //
    if (AnsReview === 0) return
    //
    // Start at Answer Row 0
    //
    const AnsIdx = 0
    setAnsIdx(AnsIdx)
    const QuizIdx = AnsNum[AnsIdx]
    setQuizRow(ArrQuestions[QuizIdx])
  }
  //...................................................................................
  //.  Next Question
  //...................................................................................
  function nextQuestion() {
    //
    //  More rows
    //
    const AnsIdx = ansIdx + 1
    if (AnsIdx < countReview) {
      const QuizIdx = arrAnsNum[AnsIdx]
      setAnsIdx(AnsIdx)
      setQuizRow(arrQuest[QuizIdx])
    }
  }
  //...................................................................................
  //.  Previous Question
  //...................................................................................
  function handlePrevious() {
    //
    //  More rows
    //
    if (ansIdx > 0) {
      const AnsIdx = ansIdx - 1
      const QuizIdx = arrAnsNum[AnsIdx]
      setAnsIdx(AnsIdx)
      setQuizRow(arrQuest[QuizIdx])
    }
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <Box sx={{ mt: 2, maxWidth: 600 }}>
        <Typography variant='subtitle1' sx={{ marginTop: '8px' }}>
          Result ({mark}%) {countPass} out of {countAns}
        </Typography>
      </Box>
      <QuizQuestion quizRow={quizRow} quizQuestion={arrAnsNum[ansIdx] + 1} quizTotal={countAns} />
      <QuizBidding qid={quizRow.qid} />
      <QuizHands qid={quizRow.qid} />
      <QuizReviewAnswers quizRow={quizRow} AnswerNum={arrAns[ansIdx]} />

      <Box sx={{ mt: 2, maxWidth: 600 }}>
        {hideNextButton ? null : (
          <MyButton
            type='submit'
            text='Next'
            color='primary'
            variant='contained'
            onClick={() => nextQuestion()}
          />
        )}
        {/* .......................................................................................... */}
        {hidePreviousButton ? null : (
          <MyButton
            type='submit'
            text='Previous'
            color='primary'
            variant='contained'
            onClick={() => handlePrevious()}
          />
        )}
        {/* .......................................................................................... */}
        <MyButton
          type='submit'
          text='Back'
          color='warning'
          variant='contained'
          sx={{ float: 'right' }}
          onClick={() => {
            handlePage('PAGEBACK')
          }}
        />
        {/* .......................................................................................... */}
      </Box>
    </>
  )
}
