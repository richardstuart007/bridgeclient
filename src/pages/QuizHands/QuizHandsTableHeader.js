//
//  Libraries
//
import { Avatar, TableCell, TableHead, TableRow } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
//
//  Sub Components
//
import spade from '../../assets/images/spade.svg'
import heart from '../../assets/images/heart.svg'
import diamond from '../../assets/images/diamond.svg'
import club from '../../assets/images/club.svg'
//
// Styles
//
const useStyles = makeStyles({
  tableCell: {
    maxWidth: '100px'
  }
})
//...................................................................................
//.  Main Line
//...................................................................................
export default function QuizHandsTableHeader() {
  //
  //  Styles
  //
  const classes = useStyles()
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <TableHead style={{ backgroundColor: 'Gray' }}>
        <TableRow>
          <TableCell
            sx={{ padding: '0px' }}
            align='left'
            style={{ width: 100 }}
            className={classes.tableCell}
          ></TableCell>
          <TableCell
            sx={{ padding: '0px' }}
            align='left'
            style={{ width: 100 }}
            className={classes.tableCell}
          >
            <Avatar src={spade} sx={{ height: '1rem', width: '1rem' }} />
          </TableCell>
          <TableCell
            sx={{ padding: '0px' }}
            align='left'
            style={{ width: 100 }}
            className={classes.tableCell}
          >
            <Avatar src={heart} sx={{ height: '1rem', width: '1rem' }} />
          </TableCell>
          <TableCell
            sx={{ padding: '0px' }}
            align='left'
            style={{ width: 100 }}
            className={classes.tableCell}
          >
            <Avatar src={diamond} sx={{ height: '1rem', width: '1rem' }} />
          </TableCell>
          <TableCell
            sx={{ padding: '0px' }}
            align='left'
            style={{ width: 100 }}
            className={classes.tableCell}
          >
            <Avatar src={club} sx={{ height: '1rem', width: '1rem' }} />
          </TableCell>
        </TableRow>
      </TableHead>
    </>
  )
}
