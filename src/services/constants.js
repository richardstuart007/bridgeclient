//------------------------------------------------------------------------
//  Remote - Server
//------------------------------------------------------------------------
//
//  Remote Server 1 --> Remote Database 1
//
exports.SERVER01 = 'REMOTE:Render/3901'
exports.DATABASE01 = 'REMOTE-1:Elephant'
exports.SERVERURL01 = 'https://bridgeserver01.onrender.com'
//
//  Remote Server 2 --> Remote Database 2
//
exports.SERVER02 = 'REMOTE:Render/3902'
exports.DATABASE02 = 'REMOTE-2:Railway'
exports.SERVERURL02 = 'https://bridgeserver02.onrender.com'
//------------------------------------------------------------------------
//  Local Server
//------------------------------------------------------------------------
//
//  Local Server 1 --> Remote Database 1
//
exports.SERVER11 = 'LOCAL:3911'
exports.SERVERURL11 = 'http://localhost:3911'
//
//  Local Server 2 --> Remote Database 2
//
exports.SERVER12 = 'LOCAL:3912'
exports.SERVERURL12 = 'http://localhost:3912'
//
//  Local Server --> Local Database 6
//
exports.SERVER16 = 'LOCAL:3916'
exports.SERVERURL16 = 'http://localhost:3916'
exports.DATABASE6 = 'LOCAL:bridge6'
//
//  Local Server --> Local Database 7
//
exports.SERVER17 = 'LOCAL:3917'
exports.SERVERURL17 = 'http://localhost:3917'
exports.DATABASE7 = 'LOCAL:bridge7'
//------------------------------------------------------------------------
//  Server details
//------------------------------------------------------------------------
exports.URL_HELLO = '/QuizHello'
exports.URL_REGISTER = '/QuizRegister'
exports.URL_SIGNIN = '/QuizSignin'
exports.URL_TABLES = '/QuizTables'
//------------------------------------------------------------------------
//  Other Parameters
//------------------------------------------------------------------------
exports.MAX_QUESTIONS_SELECT = 50
exports.WAIT = 200
exports.WAIT_MAX_TRY = 50
//------------------------------------------------------------------------
//  User Defaults
//------------------------------------------------------------------------
exports.DFT_USER_MAXQUESTIONS = 20
exports.DFT_USER_OWNER = 'NZBridge'
exports.DFT_USER_SHOWPROGRESS = false
exports.DFT_USER_SHOWSCORE = false
exports.DFT_USER_SORTQUESTIONS = true
exports.DFT_USER_SKIPCORRECT = true
//------------------------------------------------------------------------
//  Old Static URL
//------------------------------------------------------------------------
exports.STATIC_URL = 'https://quizclient021renderstatic.onrender.com/'
//------------------------------------------------------------------------
//  Other
//------------------------------------------------------------------------
exports.PAGESTART = 'Library'
exports.PAGESTARTAPP = 'Splash'
