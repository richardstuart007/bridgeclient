import { useEffect, useState } from 'react'
import { Card } from '@mui/material'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
//
//  Sub Components
//
import MyRadioGroup from '../../components/controls/MyRadioGroup'
//..............................................................................
//.  Initialisation
//.............................................................................
//
// Debug Settings
//
const debugLog = debugSettings()
//
//  Global
//
let j = 0
let Answers = []
let label = 'Select your answer'
//===================================================================================
export default function QuizPanel({ quizRow, value, setValue, setId, setShowSubmit }) {
  if (debugLog) console.log('Start QuizPanel')
  //
  //  State
  //
  const [answers, setAnswers] = useState([])
  //
  //  On change of record, set State
  //
  useEffect(() => {
    newRow()
    // eslint-disable-next-line
  }, [quizRow])
  //...................................................................................
  //  Load Answers array with answer element
  //...................................................................................
  function newRow() {
    //
    //  Initialise value
    //
    setValue(99)
    setId(0)
    setShowSubmit(false)
    //
    //  Determine label
    //
    const qdetail = quizRow.qdetail
    let hyperLink
    qdetail.substring(0, 8) === 'https://' ? (hyperLink = true) : (hyperLink = false)
    hyperLink ? (label = 'Select your answer') : (label = qdetail)
    //
    //  Answers array
    //
    j = 0
    Answers = []
    for (let i = 0; i < quizRow.qans.length; i++) {
      let answer = quizRow.qans[i]
      loadAnswer(answer)
    }
    //
    //  Sort the Answers by the random sort id
    //
    Answers.sort((a, b) => (a.random > b.random ? 1 : -1))
    if (debugLog) console.log(Answers)
    //
    //  Re-assign the ID
    //
    for (let i = 0; i < Answers.length; i++) {
      Answers[i].id = i
    }
    if (debugLog) console.log(Answers)
    //
    //  Update state
    //
    setAnswers(Answers)
  }
  //...................................................................................
  //  Load Answers array with answer element
  //...................................................................................
  function loadAnswer(answer) {
    if (answer) {
      j++
      const ansObj = {
        random: Math.random(),
        id: j,
        idnum: j,
        title: answer
      }
      Answers.push(ansObj)
    }
  }
  //...................................................................................
  //. Answer Selected
  //...................................................................................
  const handleSelect = event => {
    const elem = event.target.value
    if (debugLog) console.log('elem ', elem)
    setValue(elem)
    if (debugLog) console.log('answers ', answers)
    const id = answers[elem].idnum
    if (debugLog) console.log('id ', id)
    setId(id)
    setShowSubmit(true)
  }
  //...................................................................................
  //  Format Panel
  //...................................................................................
  return (
    <>
      <Card sx={{ maxWidth: 600, marginTop: '16px' }} style={{ backgroundColor: 'LightGray' }}>
        <MyRadioGroup
          label={label}
          name={'MuiRadio'}
          value={value}
          onChange={handleSelect}
          items={answers}
          colorFormLabel={'LightSeaGreen'}
          colorRadioButton={'Blue'}
          colorRadioText={'SaddleBrown'}
          size='small'
        />
      </Card>
    </>
  )
}
