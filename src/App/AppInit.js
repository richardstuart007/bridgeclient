//
//  Utilities
//
import Appwrite_App_Env from './Appwrite_App_Env'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
//...........................................................................
// Globals
//...........................................................................
//
//  Save Process.env variables
//
let App_Env
//
//  Debug Settings
//
let debugLog
const debugModule = 'AppInit'

let g_Database = 'Error'
let g_Server = 'Error'
let g_URL = 'Error'
//============================================================================
//= Exported Module
//============================================================================
export default function AppInit() {
  //
  //  Debug Settings
  //
  debugLog = debugSettings()
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Write Environment Variables
  //
  Appwrite_App_Env()
  App_Env = JSON.parse(sessionStorage.getItem('App_Env'))
  //
  //  Server & Database
  //
  Set_ServerDatabase()
  //
  //  Initialise storage
  //
  Init_Storage()
  //.............................................................................
  //.  Local Port Overridden - Update Constants
  //.............................................................................
  function Set_ServerDatabase() {
    //------------------------------------------------------------------------
    //  Remote - Client/Server/Database (Production)
    //------------------------------------------------------------------------
    //
    //  Remote Client --> Remote Server 1 --> Remote Database 1
    //
    const SERVER01 = App_Env.SERVER01
    const DATABASE01 = App_Env.DATABASE01
    const SERVERURL01 = App_Env.SERVERURL01
    //
    //  Remote Client --> Remote Server 2 --> Remote Database 2
    //
    const SERVER02 = App_Env.SERVER02
    const DATABASE02 = App_Env.DATABASE02
    const SERVERURL02 = App_Env.SERVERURL02
    //
    //  Remote Client --> Remote Server 3 --> Remote Database 3
    //
    const SERVER03 = App_Env.SERVER03
    const DATABASE03 = App_Env.DATABASE03
    const SERVERURL03 = App_Env.SERVERURL03
    //
    //  Remote Client --> Remote Server 4 --> Remote Database 4
    //
    const SERVER04 = App_Env.SERVER04
    const DATABASE04 = App_Env.DATABASE04
    const SERVERURL04 = App_Env.SERVERURL04
    //------------------------------------------------------------------------
    //  Local - Client/Server - Remote Database
    //------------------------------------------------------------------------
    //
    //  Local Client --> Local Server 1 --> Remote Database 1
    //
    const SERVER11 = App_Env.SERVER11
    const SERVERURL11 = App_Env.SERVERURL11
    //
    //  Local Client --> Local Server 2 --> Remote Database 2
    //
    const SERVER12 = App_Env.SERVER12
    const SERVERURL12 = App_Env.SERVERURL12
    //
    //  Local Client --> Local Server 3 --> Remote Database 3
    //
    const SERVER13 = App_Env.SERVER13
    const SERVERURL13 = App_Env.SERVERURL13
    //
    //  Local Client --> Local Server 4 --> Remote Database 4
    //
    const SERVER14 = App_Env.SERVER14
    const SERVERURL14 = App_Env.SERVERURL14
    //------------------------------------------------------------------------
    //  Local - Client/Server/Database
    //------------------------------------------------------------------------
    //
    //  Local Client --> Local Server --> Local Database 6
    //
    const SERVER16 = App_Env.SERVER16
    const DATABASE6 = App_Env.DATABASE6
    const SERVERURL16 = App_Env.SERVERURL16
    //
    //  Local Client --> Local Server --> Local Database 7
    //
    const SERVER17 = App_Env.SERVER17
    const DATABASE7 = App_Env.DATABASE7
    const SERVERURL17 = App_Env.SERVERURL17
    //------------------------------------------------------------------------
    switch (App_Env.SERVER_DATABASE) {
      //------------------------------------------------------
      //  Client(Local/Remote) --> Remote Server 1 --> Remote Database 1
      //------------------------------------------------------
      case '01':
        g_Server = SERVER01
        g_Database = DATABASE01
        g_URL = SERVERURL01
        break
      //------------------------------------------------------
      //  Client(Local/Remote) --> Remote Server 2 --> Remote Database 2
      //------------------------------------------------------
      case '02':
        g_Server = SERVER02
        g_Database = DATABASE02
        g_URL = SERVERURL02
        break
      //------------------------------------------------------
      //  Client(Local/Remote) --> Remote Server 3 --> Remote Database 3
      //------------------------------------------------------
      case '03':
        g_Server = SERVER03
        g_Database = DATABASE03
        g_URL = SERVERURL03
        break
      //------------------------------------------------------
      //  Client(Local/Remote) --> Remote Server 4 --> Remote Database 4
      //------------------------------------------------------
      case '04':
        g_Server = SERVER04
        g_Database = DATABASE04
        g_URL = SERVERURL04
        break
      //------------------------------------------------------
      //  Local Client --> Local Server 1 --> Remote Database 1
      //------------------------------------------------------
      case '11':
        g_Server = SERVER11
        g_Database = DATABASE01
        g_URL = SERVERURL11
        break
      //------------------------------------------------------
      //  Local Client --> Local Server 2 --> Remote Database 2
      //------------------------------------------------------
      case '12':
        g_Server = SERVER12
        g_Database = DATABASE02
        g_URL = SERVERURL12
        break
      //------------------------------------------------------
      //  Local Client --> Local Server 3 --> Remote Database 3
      //------------------------------------------------------
      case '13':
        g_Server = SERVER13
        g_Database = DATABASE03
        g_URL = SERVERURL13
        break
      //------------------------------------------------------
      //  Local Client --> Local Server 4 --> Remote Database 4
      //------------------------------------------------------
      case '14':
        g_Server = SERVER14
        g_Database = DATABASE04
        g_URL = SERVERURL14
        break
      //------------------------------------------------------
      //  Local Client --> Local Server --> Local Database 6
      //------------------------------------------------------
      case '16':
        g_Server = SERVER16
        g_Database = DATABASE6
        g_URL = SERVERURL16
        break
      //------------------------------------------------------
      //  Local Client --> Local Server --> Local Database 7
      //------------------------------------------------------
      case '17':
        g_Server = SERVER17
        g_Database = DATABASE7
        g_URL = SERVERURL17
        break
      //------------------------------------------------------
      //  Error
      //------------------------------------------------------
      default:
        g_Server = 'Error'
        g_Database = 'Error'
        g_URL = 'Error'
        break
    }
  }
  //.............................................................................
  //.  Initialise Storage
  //.............................................................................
  function Init_Storage() {
    //
    //  Store Server, Database, URL
    //
    sessionStorage.setItem('App_Server', JSON.stringify(g_Server))
    sessionStorage.setItem('App_Database', JSON.stringify(g_Database))
    sessionStorage.setItem('App_URL', JSON.stringify(g_URL))
    //
    //  Navigation
    //
    const PAGESTARTAPP = App_Env.PAGESTARTAPP
    sessionStorage.setItem('Nav_Page_Current', JSON.stringify(PAGESTARTAPP))
    sessionStorage.setItem('Nav_Page_Previous', JSON.stringify(PAGESTARTAPP))
    //
    //  SignedIn Status
    //
    sessionStorage.setItem('User_SignedIn', false)
    //
    //  Quiz
    //
    sessionStorage.setItem('Page_Quiz_Owner', JSON.stringify(''))
    sessionStorage.setItem('Page_Quiz_OwnerGroup', JSON.stringify(''))
    //
    //  Data Option Owners
    //
    const DFT_USER_OWNER = App_Env.DFT_USER_OWNER
    const optionOwners = {
      id: DFT_USER_OWNER,
      title: DFT_USER_OWNER,
    }
    sessionStorage.setItem('Data_Options_Owner', JSON.stringify(optionOwners))
  }
}
