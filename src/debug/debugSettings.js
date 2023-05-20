export default function debugSettings(debug = false) {
  //
  //  Default values
  //
  let DEBUG_LOG_OVERRIDE = false
  let DEBUG_LOG = false
  //
  //  Application Environment Variables
  //
  const App_Env = JSON.parse(sessionStorage.getItem('App_Env'))
  if (App_Env) {
    DEBUG_LOG_OVERRIDE = App_Env.DEBUG_LOG_OVERRIDE
    DEBUG_LOG = App_Env.DEBUG_LOG
  }
  if (DEBUG_LOG_OVERRIDE) return DEBUG_LOG
  //
  // No Override - return incomming parameter (or default of false)
  //
  return debug
}
