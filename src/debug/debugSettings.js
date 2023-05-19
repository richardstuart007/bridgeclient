//
//  Debug Settings
//
let DEBUG_LOG_OVERRIDE = false
if (process.env.REACT_APP_DEBUG_LOG_OVERRIDE === 'true') DEBUG_LOG_OVERRIDE = true
console.log('process.env.REACT_APP_DEBUG_LOG_OVERRIDE ', process.env.REACT_APP_DEBUG_LOG_OVERRIDE)
console.log('DEBUG_LOG_OVERRIDE ', DEBUG_LOG_OVERRIDE)

let DEBUG_LOG = false
if (process.env.REACT_APP_DEBUG_LOG === 'true') DEBUG_LOG = true
console.log('DEBUG_LOG ', DEBUG_LOG)

export default function debugSettings(debug = false) {
  if (DEBUG_LOG_OVERRIDE) return DEBUG_LOG
  //
  // No Override - return incomming parameter (or default of false)
  //
  return debug
}
