//...................................................................................
//.  Try/Catch/Finally logging
//...................................................................................
export default function consoleLogTime(debugModule, message = '') {
  try {
    let timeCurrent = new Date().getTime()
    let counter = 0
    let timelog = timeCurrent
    //
    //  Store log values
    //
    let App_Log_Time = {
      counter: counter,
      timelog: timelog
    }
    //
    //  Get stored values
    //
    const App_Log_Time_Prev = sessionStorage.getItem('App_Log_Time')
    if (App_Log_Time_Prev) {
      App_Log_Time = JSON.parse(App_Log_Time_Prev)
      counter = App_Log_Time.counter
      timelog = App_Log_Time.timelog
    }
    //
    //  Update values
    //
    const duration = timeCurrent - timelog
    App_Log_Time.counter++
    App_Log_Time.timelog = timeCurrent
    sessionStorage.setItem('App_Log_Time', JSON.stringify(App_Log_Time))
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
    const consoleLogTimemessage = `${counter} ${duration} ${debugModuleText} ${message} `
    return consoleLogTimemessage
  } catch (error) {
    console.log(error)
  }
}
