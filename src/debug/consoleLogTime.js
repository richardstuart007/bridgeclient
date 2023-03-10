//...................................................................................
//.  Try/Catch/Finally logging
//...................................................................................
export default function consoleLogTime(debugModule, message = '') {
  //
  //  Format time
  //
  const today = new Date()
  const milliseconds = today.getMinutes() + ':' + today.getSeconds() + ':' + today.getMilliseconds()
  //
  //  Format module to length
  //
  const debugModuleDots = '...................:'
  let debugModuleText = debugModule
  if (debugModule.length < 20) {
    debugModuleText = debugModuleText + debugModuleDots.substring(debugModule.length)
  }
  //
  //  Build return string
  //
  const consoleLogTimemessage = `${milliseconds} ${debugModuleText} ${message} `
  return consoleLogTimemessage
}
