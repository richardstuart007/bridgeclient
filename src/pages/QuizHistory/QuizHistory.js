//
//  Libraries
//
import { useState, useEffect } from 'react'
import PeopleOutlineTwoToneIcon from '@mui/icons-material/PeopleOutlineTwoTone'
import { Paper, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Box } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import ScoreboardIcon from '@mui/icons-material/Scoreboard'
import QuizIcon from '@mui/icons-material/Quiz'
import PeopleIcon from '@mui/icons-material/People'
import { format, parseISO } from 'date-fns'
//
//  Controls
//
import MyButton from '../../components/controls/MyButton'
import MyInput from '../../components/controls/MyInput'
import MySelect from '../../components/controls/MySelect'
import PageHeader from '../../components/controls/PageHeader'
import useMyTable from '../../components/controls/useMyTable'
import MyActionButton from '../../components/controls/MyActionButton'
//
//  Services
//
import rowCrud from '../../utilities/rowCrud'
import buildDataQuiz from '../../services/buildDataQuiz'
import buildDataHistDtl from '../../services/buildDataHistDtl'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
import consoleLogTime from '../../debug/consoleLogTime'
//...........................................................................
// Global CONSTANTS
//...........................................................................
//
//  Debug Settings
//
const debugLog = debugSettings()
const debugModule = 'QuizHistory'
//
//  Styles
//
const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(1),
    padding: theme.spacing(1)
  },
  searchInputLarge: {
    minWidth: '300px',
    width: '30%'
  },
  searchInputSmall: {
    minWidth: '220px',
    width: '30%'
  },
  searchInputTypeBox: {
    width: '10%',
    margin: `0 0 0 ${theme.spacing(2)}`
  },
  searchInputType: {
    minWidth: '200px'
  },
  myButton: {
    margin: `0 0 0 ${theme.spacing(4)}`,
    backgroundColor: 'azure'
  },
  messages: {
    margin: `0 0 0 ${theme.spacing(4)}`
  }
}))
//
//  Table Heading
//
const headCellsLarge = [
  { id: 'r_hid', label: 'ID' },
  { id: 'yymmdd', label: 'Date' },
  { id: 'r_uid', label: 'User Id' },
  { id: 'u_name', label: 'User Name' },
  { id: 'r_owner', label: 'Owner' },
  { id: 'ogtitle', label: 'Group' },
  { id: 'r_questions', label: 'Questions' },
  { id: 'r_totalpoints', label: 'Score' },
  { id: 'r_maxpoints', label: 'Maximum' },
  { id: 'r_correctpercent', label: 'Score %' },
  { id: 'review', label: 'Review', disableSorting: true },
  { id: 'quiz', label: 'Quiz', disableSorting: true }
]
const headCellsSmall = [
  { id: 'ogtitle', label: 'Group' },
  { id: 'review', label: 'Review', disableSorting: true },
  { id: 'quiz', label: 'Quiz', disableSorting: true }
]
const searchTypeOptionsLarge = [
  { id: 'r_hid', title: 'ID' },
  { id: 'yymmdd', title: 'Date' },
  { id: 'r_owner', title: 'Owner' },
  { id: 'ogtitle', title: 'Group' }
]
const searchTypeOptionsSmall = [{ id: 'ogtitle', title: 'Group' }]
//...........................................................................
//  Global Variables
//...........................................................................
let g_allUsers = false
let g_allUsersText = 'ALL'
let g_handleQuizReset = true
export function QuizHistoryReset() {
  if (debugLog) console.log(consoleLogTime(debugModule, 'QuizHistoryReset'))
  g_allUsers = false
  g_allUsersText = 'ALL'
  if (debugLog) console.log(consoleLogTime(debugModule, 'g_allUsers'), g_allUsers)
  //
  //  Rebuild data
  //
  sessionStorage.removeItem('Pg_Qh_Data')
  sessionStorage.removeItem('Pg_Qh_Selection')
  g_handleQuizReset = true
}
//============================================================================
//= Exported Module
//============================================================================
export default function QuizHistory({ handlePage }) {
  //...........................................................................
  // Module STATE
  //...........................................................................
  //
  //  Styles
  //
  const classes = useStyles()
  //
  //  State
  //
  const [records, setRecords] = useState([])
  const [filterFn, setFilterFn] = useState({
    fn: items => {
      return items
    }
  })
  const [searchType, setSearchType] = useState('ogtitle')
  const [searchValue, setSearchValue] = useState('')
  const [startPage0, setStartPage0] = useState(false)
  const [allUsersText, setAllUsersText] = useState('ALL')
  const [subtitle, setSubtitle] = useState('')
  //...........................................................................
  // Module Main Line
  //...........................................................................
  //
  //  Small Screen overrides
  //
  const ScreenSmall = JSON.parse(sessionStorage.getItem('App_ScreenSmall'))
  let headCells = headCellsLarge
  let searchTypeOptions = searchTypeOptionsLarge
  let searchInput = classes.searchInputLarge
  let buttonTextView = 'View'
  let buttonTextQuiz = 'Quiz'
  if (ScreenSmall) {
    headCells = headCellsSmall
    searchTypeOptions = searchTypeOptionsSmall
    searchInput = classes.searchInputSmall
    buttonTextView = null
    buttonTextQuiz = null
  }
  //
  //  Get User
  //
  const User_User = JSON.parse(sessionStorage.getItem('User_User'))
  const u_name = User_User.u_name
  const u_uid = User_User.u_uid
  const User_Admin = User_User.u_admin
  //
  //  Initial Data Load
  //
  useEffect(() => {
    handleQuizReset()
    // eslint-disable-next-line
  }, [g_handleQuizReset])
  //
  //  Populate the Table
  //
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useMyTable(
    records,
    headCells,
    filterFn,
    startPage0,
    setStartPage0
  )
  //...................................................................................
  //.  Reset the Quiz
  //...................................................................................
  function handleQuizReset() {
    //
    //  No reset
    //
    if (!g_handleQuizReset) return
    g_handleQuizReset = false
    //
    //  Session Storage ?
    //
    const Pg_Qh_Data = JSON.parse(sessionStorage.getItem('Pg_Qh_Data'))
    if (Pg_Qh_Data) setRecords(Pg_Qh_Data)
    //
    //  Restore saved search values & search
    //
    const selection = JSON.parse(sessionStorage.getItem('Pg_Qh_Selection'))
    if (debugLog) console.log(consoleLogTime(debugModule, 'Pg_Qh_Selection'), { ...selection })
    if (selection) {
      const searchType = selection.searchType
      const searchValue = selection.searchValue
      setSearchType(searchType)
      setSearchValue(searchValue)
      handleSearch(searchType, searchValue)
    }
    //
    //  Get Data
    //
    if (!Pg_Qh_Data) getRowAllData()
  }
  //.............................................................................
  //.  GET ALL
  //.............................................................................
  function getRowAllData() {
    //
    //  Selection
    //
    let AxString = `r_hid, r_uid, u_name, r_datetime, r_owner, r_group, ogtitle, r_qid, r_ans, r_questions, r_totalpoints, r_maxpoints, r_correctpercent from usershistory`
    AxString = AxString + ` join ownergroup on r_owner = ogowner and r_group = oggroup`
    AxString = AxString + ` join users on r_uid = u_uid`
    //
    //  Select User (if not ALL)
    //
    if (!g_allUsers) AxString = AxString + ` where r_uid = ${u_uid}`
    AxString = AxString + ` order by r_hid desc`
    if (debugLog) console.log(consoleLogTime(debugModule, 'AxString'), AxString)
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'post',
      AxCaller: debugModule,
      AxTable: 'usershistory',
      AxAction: 'SELECTSQL',
      AxString: AxString
    }
    const myPromiseGet = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseGet.then(function (rtnObj) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj'), { ...rtnObj })
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Data
      //
      const Pg_Qh_Data = rtnObj.rtnRows
      //
      //  Data History add time stamp
      //
      const Pg_Qh_Data_Update = Pg_Qh_Data.map(record => ({
        ...record,
        yymmdd: format(parseISO(record.r_datetime), 'yy-MM-dd')
      }))
      //
      //  Session Storage
      //
      sessionStorage.setItem('Pg_Qh_Data', JSON.stringify(Pg_Qh_Data_Update))
      //
      //  Update Table
      //
      setRecords(Pg_Qh_Data_Update)
      //
      //  Filter
      //
      handleSearch()
      return
    })
    //
    //  Return Promise
    //
    return myPromiseGet
  }
  //...................................................................................
  //.  Prepare Row before switching to QuizHistoryDetail
  //...................................................................................
  function QuizHistoryRow(row) {
    //
    //  Store Row
    //
    sessionStorage.setItem('Pg_Qd_Row', JSON.stringify(row))
    //
    //  Get data
    //
    buildDataHistDtl(row)
    handlePage('QuizHistoryDetail')
  }
  //...................................................................................
  //.  Prepare Row before switching to Quiz
  //...................................................................................
  function QuizBuild(row) {
    //
    //  Store Row
    //
    sessionStorage.setItem('Pg_Qd_Row', JSON.stringify(row))
    sessionStorage.setItem('Pg_Qz_ogtitle', JSON.stringify(row.ogtitle))
    //
    //  buildDataQuiz
    //
    const params = {
      p_owner: row.r_owner,
      p_group: row.r_group
    }
    buildDataQuiz(params)
    handlePage('Quiz')
  }

  //.............................................................................
  //  Search/Filter
  //.............................................................................
  function handleSearch(p_searchType = searchType, p_searchValue = searchValue) {
    //
    //  Start at first page (0)
    //
    setStartPage0(true)
    //
    //  Save search values
    //
    const selection = {
      searchType: p_searchType,
      searchValue: p_searchValue
    }
    sessionStorage.setItem('Pg_Qh_Selection', JSON.stringify(selection))
    //
    //  Subtitle
    //
    g_allUsers ? setSubtitle('ALL USERS') : setSubtitle(`${u_name} (${u_uid})`)
    //
    //  Filter
    //
    setFilterFn({
      fn: items => {
        //
        //  Filter by user ?
        //
        let userFilter = items
        if (!g_allUsers) {
          userFilter = items.filter(x => x.r_uid === u_uid)
        }
        //
        //  Nothing to search, return rows
        //
        if (p_searchValue === '') {
          return userFilter
        }
        //
        //  Numeric
        //
        const p_searchValueInt = parseInt(p_searchValue)
        //
        //  Filter
        //
        let itemsFilter = userFilter
        switch (p_searchType) {
          case 'r_hid':
            itemsFilter = userFilter.filter(x => x.r_hid === p_searchValueInt)
            break
          case 'yymmdd':
            itemsFilter = userFilter.filter(x => x.yymmdd === p_searchValue)
            break
          case 'r_owner':
            itemsFilter = userFilter.filter(x =>
              x.r_owner.toLowerCase().includes(p_searchValue.toLowerCase())
            )
            break
          case 'ogtitle':
            itemsFilter = userFilter.filter(x =>
              x.ogtitle.toLowerCase().includes(p_searchValue.toLowerCase())
            )
            break
          default:
        }
        if (debugLog)
          console.log(consoleLogTime(debugModule, 'setFilterFn itemsFilter'), itemsFilter)
        return itemsFilter
      }
    })
  }
  //.............................................................................
  //  Switch to All/Users
  //.............................................................................
  function handleAllUsers() {
    //
    //  Switch All/Selected User
    //
    if (g_allUsers) {
      g_allUsers = false
      g_allUsersText = 'ALL'
    } else {
      g_allUsers = true
      g_allUsersText = 'Users'
    }
    //
    //  Button Text
    //
    setAllUsersText(g_allUsersText)
    //
    //  Subtitle
    //
    g_allUsers ? setSubtitle('ALL USERS') : setSubtitle(`${u_name} (${u_uid})`)
    //
    //  Refresh data
    //
    getRowAllData()
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      {/* .......................................................................................... */}
      {ScreenSmall ? null : (
        <PageHeader
          title='Quiz History'
          subTitle={subtitle}
          icon={<PeopleOutlineTwoToneIcon fontSize='large' />}
        />
      )}
      {/* .......................................................................................... */}
      <Paper className={classes.pageContent}>
        <Toolbar>
          {/* .......................................................................................... */}
          <MyInput
            label='Search'
            name='Search'
            value={searchValue}
            className={searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            onChange={e => setSearchValue(e.target.value)}
          />
          {/* .......................................................................................... */}
          {ScreenSmall ? null : (
            <Box className={classes.searchInputTypeBox}>
              <MySelect
                name='SearchType'
                label='Search By'
                value={searchType}
                onChange={e => setSearchType(e.target.value)}
                options={searchTypeOptions}
                className={classes.searchInputType}
              />
            </Box>
          )}
          {/* .......................................................................................... */}
          <MyButton
            text='Filter'
            variant='outlined'
            startIcon={<FilterListIcon />}
            onClick={() => handleSearch()}
            className={classes.myButton}
          />
          {/* .......................................................................................... */}
          {User_Admin & !ScreenSmall ? (
            <MyButton
              text={allUsersText}
              variant='outlined'
              startIcon={<PeopleIcon />}
              onClick={handleAllUsers}
              className={classes.myButton}
            />
          ) : null}
          {/* .......................................................................................... */}
          {User_Admin & !ScreenSmall ? (
            <MyButton
              text='Refresh'
              variant='outlined'
              startIcon={<PeopleIcon />}
              onClick={() => getRowAllData()}
              className={classes.myButton}
            />
          ) : null}
          {/* .......................................................................................... */}
        </Toolbar>
        {/* .......................................................................................... */}
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map(row => (
              <TableRow key={row.r_hid}>
                {ScreenSmall ? null : <TableCell>{row.r_hid}</TableCell>}
                {ScreenSmall ? null : <TableCell>{row.yymmdd}</TableCell>}
                {ScreenSmall ? null : <TableCell>{row.r_uid}</TableCell>}
                {ScreenSmall ? null : <TableCell>{row.u_name}</TableCell>}
                {ScreenSmall ? null : <TableCell>{row.r_owner}</TableCell>}
                <TableCell>{row.ogtitle}</TableCell>
                {ScreenSmall ? null : <TableCell>{row.r_questions}</TableCell>}
                {ScreenSmall ? null : <TableCell>{row.r_totalpoints}</TableCell>}
                {ScreenSmall ? null : <TableCell>{row.r_maxpoints}</TableCell>}
                {ScreenSmall ? null : <TableCell>{row.r_correctpercent}</TableCell>}
                <TableCell>
                  <MyActionButton
                    startIcon={<ScoreboardIcon fontSize='small' />}
                    text={buttonTextView}
                    color='warning'
                    onClick={() => QuizHistoryRow(row)}
                  ></MyActionButton>
                </TableCell>
                <TableCell>
                  <MyActionButton
                    startIcon={<QuizIcon fontSize='small' />}
                    text={buttonTextQuiz}
                    color='warning'
                    onClick={() => QuizBuild(row)}
                  ></MyActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
    </>
  )
}
