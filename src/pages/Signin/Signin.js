//
//  Libraries
//
import { useState } from 'react'
import { Paper, Grid, Typography } from '@mui/material'
//
//  Sub components
//
import SigninInit from './SigninInit'
//
//  Utilities
//
import apiAxios from '../../utilities/apiAxios'
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
//
// Debug Settings
//
const debugLog = debugSettings()
const debugFunStart = false
const debugModule = 'Signin'
//
//  Initial Values
//
const initialFValues = {
  user: '',
  password: ''
}
//
// Constants
//
const { URL_SIGNIN } = require('../../services/constants.js')
//
//  Object returned by this handler - as per server
//
let rtnObj = {
  rtnValue: false,
  rtnMessage: '',
  rtnSqlFunction: debugModule,
  rtnCatchFunction: '',
  rtnCatch: false,
  rtnCatchMsg: '',
  rtnRows: []
}
//
//  Previous signed in user
//
let previousUser = null
//...................................................................................
//.  Main Line
//...................................................................................
export default function Signin({ handlePage }) {
  if (debugFunStart) console.log('Signin')
  //
  //  Get User (Previous, if any)
  //
  const User_Settings_User = JSON.parse(sessionStorage.getItem('User_Settings_User'))
  if (User_Settings_User) {
    previousUser = User_Settings_User.u_user
    initialFValues.user = previousUser
  }
  //
  // Form Message
  //
  const [form_message, setForm_message] = useState('')
  const [showButtons, setShowButtons] = useState(true)
  //
  //  Interface to Form
  //
  const { values, errors, setErrors, handleInputChange } = useMyForm(initialFValues, true, validate)
  //.............................................................................
  //.  Input field validation
  //.............................................................................
  function validate(fieldValues = values) {
    if (debugFunStart) console.log('validate')
    let temp = { ...errors }
    //
    //  user
    //
    if ('user' in fieldValues) {
      temp.user = fieldValues.user.length !== 0 ? '' : 'This field is required.'
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
  //.  Form Submit
  //...................................................................................
  function FormSubmit(e) {
    if (debugFunStart) console.log('FormSubmit')
    if (validate()) {
      FormUpdate()
    }
  }
  //...................................................................................
  //.  Update
  //...................................................................................
  function FormUpdate() {
    if (debugFunStart) console.log('FormUpdate')
    //
    //  Hide signin button
    //
    setShowButtons(false)
    //
    //  Check the user/pwd
    //
    const myPromiseSignin = checkSignin()
    //
    //  Resolve Status
    //
    myPromiseSignin.then(function (rtnObj) {
      if (debugLog) console.log('rtnObj ', rtnObj)
      //
      //  Error
      //
      const rtnValue = rtnObj.rtnValue
      if (!rtnValue) {
        let message
        rtnObj.rtnCatch ? (message = rtnObj.rtnCatchMsg) : (message = rtnObj.rtnMessage)
        if (debugLog) console.log('Error Message ', message)
        setForm_message(message)
        //
        //  Hide signin button
        //
        setShowButtons(true)
        return
      }
      //
      //  SignIn
      //
      ProcessSignIn()
    })
  }
  //--------------------------------------------------------------------
  //-  Check the User/Pwd
  //--------------------------------------------------------------------
  async function checkSignin() {
    //
    //  User message
    //
    setForm_message('Validating please WAIT..')
    //
    //  Deconstruct values
    //
    const { user, password } = values
    //
    //  Get the URL
    //
    const App_Settings_URL = JSON.parse(sessionStorage.getItem('App_Settings_URL'))
    if (debugLog) console.log('App_Settings_URL ', App_Settings_URL)
    //
    //  Initialise Values
    //
    rtnObj.rtnValue = false
    rtnObj.rtnMessage = ''
    rtnObj.rtnSqlFunction = debugModule
    rtnObj.rtnCatchFunction = ''
    rtnObj.rtnCatch = false
    rtnObj.rtnCatchMsg = ''
    rtnObj.rtnRows = []
    //
    // Fetch the data
    //
    try {
      //
      //  Setup actions
      //
      const method = 'post'
      let body = {
        sqlClient: debugModule,
        user: user,
        password: password
      }
      const URL = App_Settings_URL + URL_SIGNIN
      if (debugLog) console.log('URL ', URL)
      //
      //  SQL database
      //
      rtnObj = await apiAxios(method, URL, body)
      return rtnObj
      //
      // Errors
      //
    } catch (err) {
      console.log(err)
      return rtnObj
    }
  }
  //...................................................................................
  //.  Process User Signin
  //...................................................................................
  function ProcessSignIn() {
    if (debugFunStart) console.log('ProcessSignIn')
    //
    //  Form Message
    //
    setForm_message('Signin being processed')
    //
    //  User Row
    //
    const userRow = rtnObj.rtnRows[0]
    if (debugLog) console.log('userRow ', userRow)
    //
    //  User owner rows
    //
    const userownerRows = rtnObj.rtnRows[1]
    if (debugLog) console.log('userownerRows ', userownerRows)
    //
    //  User Info
    //
    sessionStorage.setItem('User_Settings_User', JSON.stringify(userRow))
    sessionStorage.setItem('User_Settings_UserSwitch', JSON.stringify(false))
    sessionStorage.setItem('User_Settings_Userowners', JSON.stringify(userownerRows))
    //
    //  Signed In
    //
    sessionStorage.setItem('User_Settings_SignedIn', true)
    //
    //  Get the Selection Options (if not already exists)
    //
    if (userRow.u_user !== previousUser) SigninInit()
    //
    //  Start Page
    //
    handlePage('PAGESTART')
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
          <Grid container spacing={1} justify='center' alignItems='center' direction='column'>
            {/*.................................................................................................*/}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant='h6' style={{ color: 'blue' }}>
                SignIn Page
              </Typography>
            </Grid>
            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <MyInput
                name='user'
                label='Registered user'
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
            <Grid item xs={12}>
              <Typography style={{ color: 'red' }}>{form_message}</Typography>
            </Grid>

            {/*.................................................................................................*/}
            {showButtons ? (
              <Grid item xs={12}>
                <MyButton
                  text='SignIn'
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
                handlePage('Register')
              }}
              text='Register'
            />
          </Grid>
        ) : null}
        {/*.................................................................................................*/}
      </MyForm>
    </>
  )
}
