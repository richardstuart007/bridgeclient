//
//  Debug Settings
//
let DEBUG_LOG_OVERRIDE = false
if (process.env.REACT_APP_DEBUG_LOG_OVERRIDE === 'true') DEBUG_LOG_OVERRIDE = true

let DEBUG_LOG = false
if (process.env.REACT_APP_DEBUG_LOG === 'true') DEBUG_LOG = true

export default function debugSettings(debug = false) {
  if (DEBUG_LOG_OVERRIDE) return DEBUG_LOG
  //
  // No Override - return incomming parameter (or default of false)
  //
  return debug
}
