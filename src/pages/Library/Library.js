//
//  Libraries
//
import { useState, useEffect } from 'react'
import PeopleOutlineTwoToneIcon from '@mui/icons-material/PeopleOutlineTwoTone'
import {
  Paper,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
  Box,
  Typography
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import PreviewIcon from '@mui/icons-material/Preview'
import QuizIcon from '@mui/icons-material/Quiz'
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
import BuildQuizData from '../../services/BuildQuizData'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
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
  }
}))
//
//  Table Heading
//
const headCellsLarge = [
  { id: 'lrid', label: 'ID' },
  { id: 'lrowner', label: 'Owner' },
  { id: 'lrgroup', label: 'Group' },
  { id: 'lrref', label: 'Reference' },
  { id: 'lrdesc', label: 'Description' },
  { id: 'lrwho', label: 'Who' },
  { id: 'lrtype', label: 'Type' },
  { id: 'learn', label: 'Learn', disableSorting: true },
  { id: 'ogcntquestions', label: 'Questions' },
  { id: 'quiz', label: 'Quiz', disableSorting: true }
]
const headCellsSmall = [
  { id: 'lrdesc', label: 'Description' },
  { id: 'learn', label: 'Learn', disableSorting: true },
  { id: 'quiz', label: 'Quiz', disableSorting: true }
]
const searchTypeOptionsLarge = [
  { id: 'lrid', title: 'ID' },
  { id: 'lrowner', title: 'Owner' },
  { id: 'lrgroup', title: 'Group' },
  { id: 'lrref', title: 'Reference' },
  { id: 'lrdesc', title: 'Description' },
  { id: 'lrwho', title: 'Who' },
  { id: 'lrtype', title: 'Type' }
]
const searchTypeOptionsSmall = [{ id: 'lrdesc', title: 'Description' }]

//
//  Constants
//
const functionName = 'Library'
//
// Debug Settings
//
const debugLog = debugSettings()
const debugFunStart = false
const debugModule = 'Library'
//...................................................................................
//.  Main Line
//...................................................................................
export default function Library({ handlePage }) {
  if (debugFunStart) console.log(debugModule)
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
  const [searchType, setSearchType] = useState('lrdesc')
  const [searchValue, setSearchValue] = useState('')
  const [startPage0, setStartPage0] = useState(false)
  const [form_message, setForm_message] = useState('')
  //
  //  Small Screen overrides
  //
  const ScreenSmall = JSON.parse(sessionStorage.getItem('App_Settings_ScreenSmall'))
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
  //  Initial Data Load
  //
  useEffect(() => {
    getRowAllData()
    // eslint-disable-next-line
  }, [])
  //.............................................................................
  //.  GET ALL
  //.............................................................................
  function getRowAllData() {
    if (debugFunStart) console.log('getRowAllData')
    //
    //  Do not refetch data if already exists
    //
    if (debugLog) console.log('records', records)
    if (records.length !== 0) return
    //
    //  Same selection - take from Storage
    //
    const UserOwnersString = JSON.parse(sessionStorage.getItem('User_Settings_UserOwnersString'))
    const UserOwnersString_S = JSON.parse(
      sessionStorage.getItem('User_Settings_UserOwnersString_S')
    )
    if (UserOwnersString === UserOwnersString_S) {
      //
      //  Session Storage
      //
      const Pages_Library_Data = JSON.parse(sessionStorage.getItem('Pages_Library_Data'))
      if (Pages_Library_Data) {
        if (debugLog) console.log('Pages_Library_Data', Pages_Library_Data)
        //
        //  Update Table
        //
        setRecords(Pages_Library_Data)
        //
        //  Form Saved Values - retrieve
        //
        const selection = JSON.parse(sessionStorage.getItem('Pages_Library_Selection'))
        if (debugLog) console.log('Pages_Library_Selection', selection)
        if (selection) {
          const searchType = selection.searchType
          const searchValue = selection.searchValue
          setSearchType(searchType)
          setSearchValue(searchValue)
          handleSearch(searchType, searchValue)
        }
        return
      }
    }
    //
    //  Selection
    //
    const sqlString = `* from library join ownergroup on lrowner = ogowner and lrgroup = oggroup where lrowner in (${UserOwnersString}) order by lrid`
    if (debugLog) console.log('sqlString', sqlString)
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'post',
      sqlCaller: functionName,
      sqlTable: 'library',
      sqlAction: 'SELECTSQL',
      sqlString: sqlString
    }
    const myPromiseGet = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseGet.then(function (rtnObj) {
      if (debugLog) console.log('rtnObj ', rtnObj)
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Data
      //
      const Pages_Library_Data = rtnObj.rtnRows
      //
      //  Session Storage
      //
      sessionStorage.setItem('Pages_Library_Data', JSON.stringify(Pages_Library_Data))
      sessionStorage.setItem('User_Settings_UserOwnersString_S', JSON.stringify(UserOwnersString))
      //
      //  Update Table
      //
      setRecords(Pages_Library_Data)
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
  //.  Prepare Row before switching to Quiz
  //...................................................................................
  function LibraryRow(row) {
    if (debugLog) console.log('LibraryRow ')
    //
    //  Store Row
    //
    sessionStorage.setItem('Pages_Library_Data_Row', JSON.stringify(row))
    //
    //  BuildQuizData
    //
    const SqlString_Q = `* from questions where qowner = '${row.lrowner}' and qgroup = '${row.lrgroup}'`
    const params = {
      SqlString_Q: SqlString_Q
    }
    setForm_message('Quiz: Building data....wait')
    BuildQuizData(params)
    //
    //  Reset Quiz Data
    //
    sessionStorage.setItem('Pages_Quiz_Reset', true)
    //
    //  Wait for data
    //
    const waitSessionStorageParams = {
      sessionItem: 'BuildQuizData_Received',
      handlePageValue: 'Quiz',
      dftWait: 200,
      dftMaxTry: 50
    }
    waitSessionStorage(waitSessionStorageParams, handlePage)
  }
  //--------------------------------------------------------------------
  //-  Wait
  //--------------------------------------------------------------------
  function waitSessionStorage(props, handlePage) {
    if (debugLog) console.log('Start waitSessionStorage')
    if (debugLog) console.log('props ', props)
    const timeStart = new Date()
    //
    //  Constants
    //
    const { WAIT } = require('../../services/constants')
    const { WAIT_MAX_TRY } = require('../../services/constants')
    //
    //  Deconstruct props
    //
    const { sessionItem, dftWait = WAIT, dftMaxTry = WAIT_MAX_TRY, handlePageValue } = props
    if (debugLog) console.log('sessionItem ', sessionItem)
    if (debugLog) console.log('dftWait ', dftWait)
    if (debugLog) console.log('dftMaxTry ', dftMaxTry)
    //
    //  Global
    //
    let completedFlag = false
    let totalWAIT = 0
    //
    //  Wait for data
    //
    let w_try = 0
    const myInterval = setInterval(myTimer, dftWait)
    function myTimer() {
      //
      //  Data received, end wait
      //
      completedFlag = JSON.parse(sessionStorage.getItem(sessionItem))
      if (completedFlag) {
        const timeEnd = new Date()
        const timeDiff = timeEnd - timeStart
        if (debugLog)
          console.log(
            `waitSessionStorage sessionStorage(${sessionItem}) value(${completedFlag}) Elapsed Time(${timeDiff})`
          )
        clearInterval(myInterval)
        //
        //  Data ?
        //
        const Pages_Quiz_Questions_Quiz_Count = JSON.parse(
          sessionStorage.getItem('Pages_Quiz_Questions_Quiz_Count')
        )
        if (Pages_Quiz_Questions_Quiz_Count === 0) {
          setForm_message('QuizSelect: No Questions found')
          if (debugLog) console.log('No Quiz Questions found')
          return
        }
        //
        //  Questions found - page change
        //
        handlePage(handlePageValue)
      } else {
        //
        //  Waited enough
        //
        if (w_try >= dftMaxTry) {
          if (debugLog)
            console.log(`waitSessionStorage sessionStorage(${sessionItem}) Timed out(${totalWAIT})`)
          clearInterval(myInterval)
        }
        //
        //  Update counters
        //
        totalWAIT = totalWAIT + dftWait
        w_try++
      }
    }
  }
  //.............................................................................
  //  Search/Filter
  //.............................................................................
  function handleSearch(p_searchType = searchType, p_searchValue = searchValue) {
    if (debugFunStart) console.log('handleSearch')
    setStartPage0(true)
    //
    //  Form Saved Values
    //
    const selection = {
      searchType: p_searchType,
      searchValue: p_searchValue
    }
    sessionStorage.setItem('Pages_Library_Selection', JSON.stringify(selection))
    if (debugLog) console.log('Pages_Library_Selection', selection)
    //
    //  Filter
    //
    setFilterFn({
      fn: items => {
        //
        //  Nothing to search, return rows
        //
        if (p_searchValue === '') {
          return items
        }
        //
        //  Numeric
        //
        const p_searchValueInt = parseInt(p_searchValue)
        //
        //  Filter
        //
        let itemsFilter = items
        switch (p_searchType) {
          case 'lrid':
            itemsFilter = items.filter(x => x.lrid === p_searchValueInt)
            break
          case 'lrowner':
            itemsFilter = items.filter(x =>
              x.lrowner.toLowerCase().includes(p_searchValue.toLowerCase())
            )
            break
          case 'lrgroup':
            itemsFilter = items.filter(x =>
              x.lrgroup.toLowerCase().includes(p_searchValue.toLowerCase())
            )
            break
          case 'lrref':
            itemsFilter = items.filter(x =>
              x.lrref.toLowerCase().includes(p_searchValue.toLowerCase())
            )
            break
          case 'lrdesc':
            if (debugLog) console.log('lrdesc ')
            itemsFilter = items.filter(x =>
              x.lrdesc.toLowerCase().includes(p_searchValue.toLowerCase())
            )
            break
          case 'lrwho':
            itemsFilter = items.filter(x =>
              x.lrwho.toLowerCase().includes(p_searchValue.toLowerCase())
            )
            break
          case 'lrtype':
            itemsFilter = items.filter(x =>
              x.lrtype.toLowerCase().includes(p_searchValue.toLowerCase())
            )
            break
          default:
        }
        if (debugLog) console.log('itemsFilter ', itemsFilter)
        return itemsFilter
      }
    })
  }
  //.............................................................................
  //
  //  Hyperlink open
  //
  const openHyperlink = hyperlink => {
    if (debugLog) console.log('hyperlink ', hyperlink)
    window.open(hyperlink, '_blank')
  }
  //.............................................................................
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
  //.  Render the form
  //...................................................................................
  return (
    <>
      {/* .......................................................................................... */}
      {ScreenSmall ? null : (
        <PageHeader
          title='Library of Teaching Material'
          subTitle='View Reference Material or Take a Quiz'
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
        </Toolbar>
        {/* .......................................................................................... */}
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map(row => (
              <TableRow key={row.lrid}>
                {ScreenSmall ? null : <TableCell>{row.lrid}</TableCell>}
                {ScreenSmall ? null : <TableCell>{row.lrowner}</TableCell>}
                {ScreenSmall ? null : <TableCell>{row.lrgroup}</TableCell>}
                {ScreenSmall ? null : <TableCell>{row.lrref}</TableCell>}
                <TableCell>{row.lrdesc}</TableCell>
                {ScreenSmall ? null : <TableCell>{row.lrwho}</TableCell>}
                {ScreenSmall ? null : <TableCell>{row.lrtype}</TableCell>}

                <TableCell>
                  <MyActionButton
                    startIcon={<PreviewIcon fontSize='small' />}
                    text={buttonTextView}
                    color='warning'
                    onClick={() => openHyperlink(row.lrlink)}
                  ></MyActionButton>
                </TableCell>
                {ScreenSmall ? null : <TableCell>{row.ogcntquestions}</TableCell>}
                <TableCell>
                  {row.ogcntquestions > 0 ? (
                    <MyActionButton
                      startIcon={<QuizIcon fontSize='small' />}
                      text={buttonTextQuiz}
                      color='warning'
                      onClick={() => {
                        LibraryRow(row)
                      }}
                    ></MyActionButton>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
        {/*.................................................................................................*/}
        <Box sx={{ mt: 2, maxWidth: 600 }}>
          <Typography style={{ color: 'red' }}>{form_message}</Typography>
        </Box>
        {/*.................................................................................................*/}
      </Paper>
    </>
  )
}
