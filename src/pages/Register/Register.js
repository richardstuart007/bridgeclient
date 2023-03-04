//
//  Libraries
//
import { useState } from 'react'
import { Paper, Grid, Typography } from '@mui/material'
//
//  Utilities
//
import registerUser from '../../services/registerUser'

//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
//
//  Controls
//
import MyButton from '../../components/controls/MyButton'
import MyInput from '../../components/controls/MyInput'
import { useMyForm, MyForm } from '../../components/controls/useMyForm'
import SelectCountry from './SelectCountry'
//..............................................................................
//.  Initialisation
//.............................................................................
//
// Debug Settings
//
const debugLog = debugSettings()
const debugModule = 'Register'
//
// Constants
//
const sqlClient = 'Register'
const { DFT_USER_MAXQUESTIONS } = require('../../services/constants.js')
const { DFT_USER_OWNER } = require('../../services/constants.js')
const { DFT_USER_SHOWPROGRESS } = require('../../services/constants.js')
const { DFT_USER_SHOWSCORE } = require('../../services/constants.js')
const { DFT_USER_SORTQUESTIONS } = require('../../services/constants.js')
const { DFT_USER_SKIPCORRECT } = require('../../services/constants.js')
//.............................................................................
//.  Data Input Fields
//.............................................................................
//
//  Initial Values
//
const initialFValues = {
  name: '',
  fedid: '',
  fedcountry: 'NZ',
  user: '',
  email: '',
  password: ''
}
//...................................................................................
//.  Main Line
//...................................................................................
function Register({ handlePage }) {
  if (debugLog) console.log(debugModule)
  //
  // State
  //
  const [form_message, setForm_message] = useState('')
  const [showButtons, setShowButtons] = useState(true)
  //
  //  Interface to Form
  //
  const { values, setValues, errors, setErrors, handleInputChange } = useMyForm(
    initialFValues,
    true,
    validate
  )
  //.............................................................................
  //.  Input field validation
  //.............................................................................
  function validate(fieldValues = values) {
    if (debugLog) console.log('validate')
    let temp = { ...errors }
    //
    //  name
    //
    if ('name' in fieldValues) {
      temp.name = fieldValues.name.length !== 0 ? '' : 'This field is required.'
    }
    //
    //  user
    //
    if ('user' in fieldValues) {
      temp.user = fieldValues.user.length !== 0 ? '' : 'This field is required.'
    }
    //
    //  email
    //
    if ('email' in fieldValues) {
      temp.email = validateEmail(fieldValues.email) ? '' : 'Email is not a valid format'
    }
    //
    //  password
    //
    if ('password' in fieldValues) {
      temp.password = fieldValues.password.length !== 0 ? '' : 'This field is required.'
    }
    //
    //  Set the errors
    //
    setErrors({
      ...temp
    })

    if (fieldValues === values) return Object.values(temp).every(x => x === '')
  }
  //...................................................................................
  function validateEmail(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  }
  //...................................................................................
  //.  Form Submit
  //...................................................................................
  function FormSubmit(e) {
    if (debugLog) console.log('FormSubmit')
    if (validate()) {
      FormUpdate()
    }
  }
  //...................................................................................
  //.  Update
  //...................................................................................
  function FormUpdate() {
    if (debugLog) console.log('FormUpdate')
    //
    //  User message
    //
    setForm_message('Registration in progress please WAIT..')
    //
    //  Hide signin button
    //
    setShowButtons(false)
    //
    //  Deconstruct values
    //
    const { name, user, email, password, fedid, fedcountry } = values
    if (debugLog) console.log('values ', values)
    //
    //  Process promise
    //
    const params = {
      sqlCaller: sqlClient,
      user: user,
      email: email,
      password: password,
      name: name,
      fedid: fedid,
      fedcountry: fedcountry,
      dftmaxquestions: DFT_USER_MAXQUESTIONS,
      dftowner: DFT_USER_OWNER,
      showprogress: DFT_USER_SHOWPROGRESS,
      showscore: DFT_USER_SHOWSCORE,
      sortquestions: DFT_USER_SORTQUESTIONS,
      skipcorrect: DFT_USER_SKIPCORRECT,
      admin: false,
      dev: false
    }
    if (debugLog) console.log('params ', params)
    const myPromiseRegister = registerUser(params)
    //
    //  Resolve Status
    //
    myPromiseRegister.then(function (rtnObj) {
      if (debugLog) console.log('rtnObj ', rtnObj)
      //
      //  Valid ?
      //
      const rtnValue = rtnObj.rtnValue
      if (debugLog) console.log('rtnValue ', rtnValue)
      if (rtnValue) {
        const Usersrow = rtnObj.rtnRows[0]
        if (debugLog) console.log('Usersrow ', Usersrow)
        setForm_message(`Data updated in Database with ID(${Usersrow.u_id})`)
        sessionStorage.setItem('User_Set_User', JSON.stringify(Usersrow))
        handlePage('Signin')
      } else {
        //
        //  Error
        //
        let message
        rtnObj.rtnCatch ? (message = rtnObj.rtnCatchMsg) : (message = rtnObj.rtnMessage)
        if (debugLog) console.log(message)
        setForm_message(message)
        //
        //  Show button
        //
        setShowButtons(true)
      }
      return
    })
    return myPromiseRegister
  }
  //...................................................................................
  //.  Select Country
  //...................................................................................
  function handleSelectCountry(CountryCode) {
    if (debugLog) console.log('handleSelectCountry')
    if (debugLog) console.log('CountryCode ', CountryCode)
    //
    //  Populate Country Object & change country code
    //
    const updValues = { ...values }
    updValues.u_fedcountry = CountryCode
    if (debugLog) console.log('updValues ', updValues)
    //
    //  Update values
    //
    setValues(updValues)
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <MyForm>
        <Paper
          sx={{
            margin: 1,
            padding: 1,
            maxWidth: 400,
            backgroundColor: 'whitesmoke'
          }}
        >
          <Grid
            container
            spacing={1}
            justify='center'
            alignItems='center'
            direction='column'
            style={{ minheight: '100vh' }}
          >
            {/*.................................................................................................*/}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant='h6' style={{ color: 'blue' }}>
                Registration Page
              </Typography>
            </Grid>

            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <MyInput
                name='user'
                label='Registration User'
                value={values.user}
                onChange={handleInputChange}
                error={errors.user}
                sx={{ minWidth: '300px' }}
              />
            </Grid>
            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <MyInput
                name='password'
                label='password'
                value={values.password}
                onChange={handleInputChange}
                error={errors.password}
                sx={{ minWidth: '300px' }}
              />
            </Grid>
            {/*.................................................................................................*/}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant='subtitle2' style={{ color: 'blue' }}>
                Your Details
              </Typography>
            </Grid>
            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <MyInput
                name='name'
                label='name'
                value={values.name}
                onChange={handleInputChange}
                error={errors.name}
                sx={{ minWidth: '300px' }}
              />
            </Grid>
            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <MyInput
                name='email'
                label='email'
                value={values.email}
                onChange={handleInputChange}
                error={errors.email}
                sx={{ minWidth: '300px' }}
              />
            </Grid>
            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <MyInput
                name='fedid'
                label='Bridge Federation Id'
                value={values.fedid}
                onChange={handleInputChange}
                error={errors.fedid}
              />
            </Grid>
            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <SelectCountry
                label='Bridge Federation Country'
                onChange={handleSelectCountry}
                countryCode={values.u_fedcountry}
              />
            </Grid>

            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <Typography style={{ color: 'red' }}>{form_message}</Typography>
            </Grid>

            {/*.................................................................................................*/}
            {showButtons ? (
              <Grid item xs={12}>
                <MyButton
                  text='Register'
                  onClick={() => {
                    FormSubmit()
                  }}
                />
              </Grid>
            ) : null}
          </Grid>
        </Paper>
        {/*.................................................................................................*/}
        {showButtons ? (
          <Grid item xs={12}>
            <MyButton
              color='warning'
              onClick={() => {
                handlePage('Signin')
              }}
              text='Signin'
            />
          </Grid>
        ) : null}
        {/*.................................................................................................*/}
      </MyForm>
    </>
  )
}

export default Register
