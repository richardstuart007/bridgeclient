//...................................................................................
//.  Try/Catch/Finally logging
//...................................................................................
export default function consoleLogTime(debugModule, message) {
  const today = new Date()
  const milliseconds = today.getMinutes() + ':' + today.getSeconds() + ':' + today.getMilliseconds()
  const consoleLogTimemessage = `${milliseconds} ${debugModule} ${message} `
  return consoleLogTimemessage
}
