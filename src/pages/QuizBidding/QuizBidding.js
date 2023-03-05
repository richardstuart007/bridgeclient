//
//  Libraries
//
import { Table, TableBody, Card } from '@mui/material'
//
//  Sub Components
//
import QuizBiddingTableHeader from './QuizBiddingTableHeader'
import QuizBiddingTableLine from './QuizBiddingTableLine'
//===================================================================================
export default function QuizBidding({ qid }) {
  //...................................................................................
  //.  Main Line
  //...................................................................................
  let testingQid = qid
  //
  //  Get Bidding
  //
  const Pg_Qz_BidJSON = sessionStorage.getItem('Pg_Qz_Bid')
  //
  //  No Bidding, return
  //
  if (Pg_Qz_BidJSON === []) return null
  //
  //  Parse data
  //
  const Pg_Qz_Bid = JSON.parse(Pg_Qz_BidJSON)
  //
  //  Find the BiddingRow
  //
  let BiddingRow = Pg_Qz_Bid.find(element => element.bid === testingQid)
  //
  //  Has BiddingRow ?
  //
  let hasBidding
  BiddingRow === undefined ? (hasBidding = false) : (hasBidding = true)
  //
  //  No BiddingRow, return
  //
  if (hasBidding === false) return null
  //
  //  Build Bidding Arrays
  //
  let Rounds = [...BiddingRow.brounds]
  //
  //  Process each Round
  //
  let RoundCount = 0
  let roundsbidObjArray = []
  Rounds.forEach(round => {
    //
    //  Process each bid for a round - Create roundBidsArray
    //
    let bidObjArray = []
    round.forEach(bid => {
      //
      //  Fill bidObj (bid/suit)
      //
      const bidObj = {
        bid: '',
        suit: ''
      }
      const level = bid.substr(0, 1)
      switch (level) {
        // Pass
        case 'P':
          bidObj.bid = 'Pass'
          bidObj.suit = null
          break
        // Question
        case '?':
          bidObj.bid = bid
          bidObj.suit = null
          break
        // Double
        case 'X':
          bidObj.bid = bid
          bidObj.suit = null
          break
        //  Nothing
        case ' ':
          bidObj.bid = null
          bidObj.suit = null
          break
        //  Nothing
        case 'n':
          bidObj.bid = null
          bidObj.suit = null
          break
        //  Nothing
        case 'N':
          bidObj.bid = null
          bidObj.suit = null
          break
        default:
          //  No Trump
          if (bid.substr(1, 1) === 'N') {
            bidObj.bid = bid
            bidObj.suit = null
          }
          //  Suit
          else {
            bidObj.bid = level
            bidObj.suit = bid.substr(1, 1)
          }
          break
      }
      //
      //  Load bidObj to bidObjArray
      //
      bidObjArray.push(bidObj)
    })
    //
    //  Prefix bidObj with round number
    //
    const objTemp = {
      roundCount: '',
      innerArray: []
    }
    RoundCount++
    objTemp.roundCount = 'Round' + RoundCount.toString()
    objTemp.innerArray = bidObjArray
    //
    //  Load to all rounds (bidObj)
    //
    roundsbidObjArray.push(objTemp)
  })
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <Card sx={{ maxWidth: 200, marginTop: '16px' }} style={{ backgroundColor: 'LightGray' }}>
        <Table>
          {/* .......................................................................................... */}
          <QuizBiddingTableHeader />
          {/* .......................................................................................... */}
          <TableBody>
            {roundsbidObjArray.map(objTemp => (
              <QuizBiddingTableLine
                key={objTemp.roundCount}
                roundCount={objTemp.roundCount}
                round={objTemp.innerArray}
              />
            ))}
          </TableBody>
          {/* .......................................................................................... */}
        </Table>
      </Card>
    </>
  )
}
