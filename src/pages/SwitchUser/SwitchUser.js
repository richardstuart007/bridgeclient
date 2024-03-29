//
//  Libraries
//
import { useState, useEffect } from 'react'
import PeopleOutlineTwoToneIcon from '@mui/icons-material/PeopleOutlineTwoTone'
import { Paper, TableBody, TableRow, TableCell, Toolbar, InputAdornment, Box } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import FilterListIcon from '@mui/icons-material/FilterList'
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount'
//
//  Controls
//
import MyActionButton from '../../components/controls/MyActionButton'
import MyButton from '../../components/controls/MyButton'
import MyInput from '../../components/controls/MyInput'
import MySelect from '../../components/controls/MySelect'
import PageHeader from '../../components/controls/PageHeader'
import useMyTable from '../../components/controls/useMyTable'
//
//  Services
//
import rowCrud from '../../utilities/rowCrud'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
import consoleLogTime from '../../debug/consoleLogTime'

const debugModule = 'SwitchUser'
//
//  Styles
//
const useStyles = makeStyles(theme => ({
  pageContent: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
  },
  searchInput: {
    minWidth: '300px',
    width: '30%',
  },
  searchInputTypeBox: {
    width: '10%',
    margin: `0 0 0 ${theme.spacing(2)}`,
  },
  searchInputType: {
    minWidth: '200px',
  },
  myButton: {
    margin: `0 0 0 ${theme.spacing(4)}`,
    backgroundColor: 'azure',
  },
}))
//
//  Table Heading
//
const headCells = [
  { id: 'u_uid', label: 'ID' },
  { id: 'u_user', label: 'User' },
  { id: 'u_email', label: 'Email' },
  { id: 'u_name', label: 'Name' },
  { id: 'u_fedid', label: 'Bridge ID' },
  { id: 'u_fedcountry', label: 'Country' },
  { id: 'u_dftmaxquestions', label: 'Max Questions' },
  { id: 'actions', label: 'Actions', disableSorting: true },
]
const searchTypeOptions = [
  { id: 'u_email', title: 'Email' },
  { id: 'u_user', title: 'User' },
  { id: 'u_uid', title: 'ID' },
  { id: 'u_name', title: 'Name' },
  { id: 'u_fedid', title: 'Bridge ID' },
]
//...................................................................................
//.  Main Line
//...................................................................................
export default function SwitchUser({ handlePage }) {
  const debugLog = debugSettings()
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //.............................................................................
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
    },
  })
  const [searchType, setSearchType] = useState('u_name')
  const [searchValue, setSearchValue] = useState('')
  //
  //  Initial Data Load
  //
  useEffect(() => {
    getRowAllData()
    // eslint-disable-next-line
  }, [])
  //.............................................................................
  //
  //  Populate the Table
  //
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useMyTable(
    records,
    headCells,
    filterFn
  )
  //.............................................................................
  //.  GET ALL
  //.............................................................................
  function getRowAllData() {
    //
    //  Selection
    //
    const AxString = `* from users order by u_uid`
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'post',
      AxCaller: debugModule,
      AxTable: 'users',
      AxAction: 'SELECTSQL',
      AxString: AxString,
    }
    var myPromiseGet = rowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseGet.then(function (rtnObj) {
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Data
      //
      const data = rtnObj.rtnRows
      //
      //  Update Table
      //
      setRecords(data)
      //
      //  Filter
      //
      handleSearch()
      return
    })
    return myPromiseGet
  }
  //.............................................................................
  //  Search/Filter
  //.............................................................................
  function handleSearch() {
    setFilterFn({
      fn: items => {
        //
        //  Nothing to search, return rows
        //
        if (searchValue === '') {
          return items
        }
        //
        //  Filter
        //
        let itemsFilter = items
        switch (searchType) {
          case 'u_email':
            itemsFilter = items.filter(x =>
              x.u_email.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'u_name':
            itemsFilter = items.filter(x =>
              x.u_name.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'u_user':
            itemsFilter = items.filter(x =>
              x.u_user.toLowerCase().includes(searchValue.toLowerCase())
            )
            break
          case 'u_uid':
            itemsFilter = items.filter(x => x.u_uid === parseInt(searchValue))
            break
          case 'u_fedid':
            itemsFilter = items.filter(x =>
              x.u_fedid.toLowerCase().includes(searchValue.toLowerCase())
            )
            break

          default:
        }
        return itemsFilter
      },
    })
  }
  //.............................................................................
  //  Switch User
  //.............................................................................
  function submitSwitchUser(row) {
    sessionStorage.setItem('User_User', JSON.stringify(row))
    sessionStorage.setItem('User_UserSwitch', JSON.stringify(true))
    //
    //  Force Rebuild History
    //
    sessionStorage.setItem('Page_History_Rebuild', true)
    handlePage('PAGEBACK')
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <PageHeader
        title='Users'
        subTitle='Switch Users'
        icon={<PeopleOutlineTwoToneIcon fontSize='large' />}
      />
      <Paper className={classes.pageContent}>
        <Toolbar>
          <MyInput
            label='Search'
            name='Search'
            value={searchValue}
            className={classes.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={e => setSearchValue(e.target.value)}
          />
          {/* .......................................................................................... */}
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
          {/* .......................................................................................... */}
          <MyButton
            text='Filter'
            variant='outlined'
            startIcon={<FilterListIcon />}
            onClick={handleSearch}
            className={classes.myButton}
          />
          {/* .......................................................................................... */}
          <MyButton
            text='Refresh'
            variant='outlined'
            startIcon={<RefreshIcon />}
            onClick={getRowAllData}
            className={classes.myButton}
          />
          {/* .......................................................................................... */}
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map(row => (
              <TableRow key={row.u_uid}>
                <TableCell>{row.u_uid}</TableCell>
                <TableCell>{row.u_user}</TableCell>
                <TableCell>{row.u_email}</TableCell>
                <TableCell>{row.u_name}</TableCell>
                <TableCell>{row.u_fedid}</TableCell>
                <TableCell>{row.u_fedcountry}</TableCell>
                <TableCell>{row.u_dftmaxquestions}</TableCell>
                <TableCell>
                  <MyActionButton
                    startIcon={<SwitchAccountIcon fontSize='small' />}
                    text='Switch'
                    color='warning'
                    onClick={() => submitSwitchUser(row)}
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
