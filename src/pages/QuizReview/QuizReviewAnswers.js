//
//  Libraries
//
import { Typography, Grid, Card } from '@mui/material'
//
//  Sub Components
//
import QuizReviewAnswer from './QuizReviewAnswer'
//===================================================================================
export default function QuizReviewAnswers(props) {
  //
  // Deconstruct Props
  //
  const { quizRow, AnswerNum } = props
  //
  //  Load answers to array
  //
  const Answers = quizRow.qans
  const Points = quizRow.qpoints
  //...................................................................................
  //  Format Panel
  //...................................................................................
  return (
    <>
      <Card sx={{ maxWidth: 600, marginTop: '16px' }} style={{ backgroundColor: 'LightGray' }}>
        <Grid container sx={{ mt: 2, maxWidth: 600 }} alignItems='center'>
          <Grid item xs={11}>
            <Typography variant='subtitle2' style={{ color: 'Blue' }}>
              {quizRow.qdetail}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant='subtitle2' color='Blue' align='center'>
              Points
            </Typography>
          </Grid>
        </Grid>

        {Answers.map((answer, key) => (
          <QuizReviewAnswer
            key={key}
            answer={answer}
            points={Points[key]}
            AnswerNum={AnswerNum}
            FieldNum={key + 1}
          />
        ))}
      </Card>
    </>
  )
}
