//
//  Libraries
//
import { TableBody, TableRow, TableCell, Grid } from '@mui/material'
import PreviewIcon from '@mui/icons-material/Preview'
//
//  Controls
//
import MyActionButton from '../../components/controls/MyActionButton'
import MyButton from '../../components/controls/MyButton'
import useMyTable from '../../components/controls/useMyTable'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
//
//  Table Heading
//
const headCellsLarge = [
  { id: 'lrid', label: 'ID' },
  { id: 'lrdesc', label: 'Description' },
  { id: 'lrwho', label: 'Who' },
  { id: 'lrtype', label: 'Type' },
  { id: 'actions', label: 'View', disableSorting: true }
]
const headCellsSmall = [
  { id: 'lrdesc', label: 'Description' },
  { id: 'actions', label: 'View', disableSorting: true }
]
//.............................................................................
//.  Initialisation
//.............................................................................
//
// Debug Settings
//
const debugLog = debugSettings()
//=====================================================================================
export default function LibraryRefs({ handlePage }) {
  if (debugLog) console.log('Start LibraryRefs')
  //
  //  Screen Width
  //
  const ScreenSmall = JSON.parse(sessionStorage.getItem('App_Settings_ScreenSmall'))
  let headCells
  ScreenSmall ? (headCells = headCellsSmall) : (headCells = headCellsLarge)
  //
  //  Find reference link
  //
  let Data_Library = []
  const Data_LibraryJSON = sessionStorage.getItem('Data_Library')
  if (Data_LibraryJSON !== '') Data_Library = JSON.parse(Data_LibraryJSON)
  if (debugLog) console.log('Data_Library ', Data_Library)
  //
  //  build records from Refs & Links
  //
  let records = Data_Library
  if (debugLog) console.log('records ', records)
  //.............................................................................
  //
  //  State
  //
  const filterFn = {
    fn: items => {
      return items
    }
  }
  //.............................................................................
  //
  //  Hyperlink open
  //
  const openHyperlink = hyperlink => {
    if (debugLog) console.log('hyperlink ', hyperlink)
    window.open(hyperlink, '_blank')
  }
  //...................................................................................
  //
  //  Populate the Table
  //
  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } = useMyTable(
    records,
    headCells,
    filterFn
  )
  if (debugLog) console.log('recordsAfterPagingAndSorting ', recordsAfterPagingAndSorting)
  if (debugLog) console.log('records ', records)
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <TblContainer>
        <TblHead />
        <TableBody>
          {recordsAfterPagingAndSorting().map(row => (
            <TableRow key={row.lrid}>
              {ScreenSmall ? null : <TableCell>{row.lrid}</TableCell>}
              <TableCell>{row.lrdesc}</TableCell>
              {ScreenSmall ? null : <TableCell>{row.lrwho}</TableCell>}
              {ScreenSmall ? null : <TableCell>{row.lrtype}</TableCell>}
              <TableCell>
                <MyActionButton
                  startIcon={<PreviewIcon fontSize='small' />}
                  text='View'
                  color='warning'
                  onClick={() => openHyperlink(row.lrlink)}
                ></MyActionButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TblContainer>
      <TblPagination />

      <Grid container spacing={1}>
        <Grid item xs={6}>
          <MyButton
            text='Go Back'
            color='warning'
            onClick={() => {
              handlePage('PAGEBACK')
            }}
          />
        </Grid>
      </Grid>
    </>
  )
}
