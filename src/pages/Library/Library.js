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
import buildDataQuiz from '../../services/buildDataQuiz'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
import consoleLogTime from '../../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'Library'
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
//...................................................................................
//.  Main Line
//...................................................................................
export default function Library({ handlePage }) {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
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
  //  Initial Data Load
  //
  useEffect(() => {
    loadData()
    // eslint-disable-next-line
  }, [])
  //.............................................................................
  //.  GET ALL
  //.............................................................................
  function loadData() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'loadData'))
    //
    //  Do not refetch data if already exists
    //
    if (debugLog) console.log(consoleLogTime(debugModule, 'records'), records)
    if (records.length !== 0) return
    //
    //  Session Storage ?
    //
    const Pg_Lib_Data_JSON = sessionStorage.getItem('Pg_Lib_Data')
    Pg_Lib_Data_JSON ? getStoreData(Pg_Lib_Data_JSON) : getLibraryData()
  }
  //...................................................................................
  //.  Data from store
  //...................................................................................
  function getStoreData(Pg_Lib_Data_JSON) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'getStoreData'))
    //
    //  Update Table
    //
    const Pg_Lib_Data = JSON.parse(Pg_Lib_Data_JSON)
    setRecords(Pg_Lib_Data)
    //
    //  Form Saved Values - retrieve
    //
    const selection = JSON.parse(sessionStorage.getItem('Pg_Lib_Selection'))
    if (debugLog) console.log(consoleLogTime(debugModule, 'Pg_Lib_Selection'), selection)
    //
    //  Filter
    //
    if (selection) {
      const searchType = selection.searchType
      const searchValue = selection.searchValue
      setSearchType(searchType)
      setSearchValue(searchValue)
      handleSearch(searchType, searchValue)
    }
  }
  //...................................................................................
  //.  Get Library data
  //...................................................................................
  function getLibraryData() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'getLibraryData'))
    //
    //  User Message
    //
    setForm_message('Retrieving Data....wait')
    //
    //  Selection
    //
    const OwnersString = JSON.parse(sessionStorage.getItem('User_OwnersString'))
    const sqlString = `* from library join ownergroup on lrowner = ogowner and lrgroup = oggroup where lrowner in (${OwnersString}) order by lrid`
    if (debugLog) console.log(consoleLogTime(debugModule, 'sqlString'), sqlString)
    //
    //  Process promise
    //
    const rowCrudparams = {
      axiosMethod: 'post',
      sqlCaller: debugModule,
      sqlTable: 'library',
      sqlAction: 'SELECTSQL',
      sqlString: sqlString
    }
    const myPromiseGet = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseGet.then(function (rtnObj) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj'), rtnObj)
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Data
      //
      const Pg_Lib_Data = rtnObj.rtnRows
      //
      //  Session Storage
      //
      sessionStorage.setItem('Pg_Lib_Data', JSON.stringify(Pg_Lib_Data))
      //
      //  Update Table
      //
      setForm_message('')
      setRecords(Pg_Lib_Data)
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
    if (debugLog) console.log(consoleLogTime(debugModule, 'LibraryRow'), row)
    //
    //  Store title
    //
    sessionStorage.setItem('Pg_Qz_ogtitle', JSON.stringify(row.ogtitle))
    //
    //  buildDataQuiz
    //
    const params = {
      p_owner: row.lrowner,
      p_group: row.lrgroup
    }
    buildDataQuiz(params)
    handlePage('Quiz')
  }
  //.............................................................................
  //  Search/Filter
  //.............................................................................
  function handleSearch(p_searchType = searchType, p_searchValue = searchValue) {
    if (debugLog) console.log(consoleLogTime(debugModule, `Function: handleSearch`))
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
    sessionStorage.setItem('Pg_Lib_Selection', JSON.stringify(selection))
    if (debugLog) console.log(consoleLogTime(debugModule, `Pg_Lib_Selection`), selection)
    //
    //  Filter
    //
    setFilterFn({
      fn: items => {
        //
        //  Nothing to search, return rows
        //
        if (p_searchValue === '') return items
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
        return itemsFilter
      }
    })
  }
  //.............................................................................
  //
  //  Hyperlink open
  //
  const openHyperlink = hyperlink => {
    if (debugLog) console.log(consoleLogTime(debugModule, `hyperlink`), hyperlink)
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
          {/*.................................................................................................*/}
          <Box className={classes.messages}>
            <Typography style={{ color: 'red' }}>{form_message}</Typography>
          </Box>
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
                      onClick={() => LibraryRow(row)}
                    ></MyActionButton>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
        {/*.................................................................................................*/}
      </Paper>
    </>
  )
}
