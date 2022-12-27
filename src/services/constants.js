//------------------------------------------------------------------------
//  Remote - Production
//------------------------------------------------------------------------
//
//  Remote/Local Client --> Remote Server 1 --> Remote Database 1
//
exports.REM_CLIENT1 = 'LOC/REM:3801'
exports.REM_SERVER1 = 'REMOTE:Render/3901'
exports.REM_DATABASE1 = 'REMOTE:Elephant'
exports.REM_SERVERURL1 = 'https://bridgeserver01.onrender.com'
//
//  Remote/Local --> Remote Server 2 --> Remote Database 2
//
exports.REM_CLIENT2 = 'LOC/REM:3802'
exports.REM_SERVER2 = 'REMOTE:Render/3902'
exports.REM_DATABASE2 = 'REMOTE:Railway'
exports.REM_SERVERURL2 = 'https://bridgeserver02.onrender.com'
//------------------------------------------------------------------------
//  Local
//------------------------------------------------------------------------
//
//  Local Client --> Local Server --> Local Database 6
//
exports.LOC_LOC_LOC_CLIENT6 = 'LOCAL:3816'
exports.LOC_LOC_LOC_SERVER6 = 'LOCAL:3916'
exports.LOC_LOC_LOC_DATABASE6 = 'LOCAL:6'
exports.LOC_LOC_LOC_SERVERURL6 = 'http://localhost:3916'
//
//  Local Client --> Local Server --> Local Database 7
//
exports.LOC_LOC_LOC_CLIENT7 = 'LOCAL:3817'
exports.LOC_LOC_LOC_SERVER7 = 'LOCAL:3917'
exports.LOC_LOC_LOC_DATABASE7 = 'LOCAL:7'
exports.LOC_LOC_LOC_SERVERURL7 = 'http://localhost:3917'
//
//  Local Client --> Local Server 1 --> Remote Database 1
//
exports.LOC_LOC_REM_CLIENT1 = 'LOCAL:3811'
exports.LOC_LOC_REM_SERVER1 = 'LOCAL:3911'
exports.LOC_LOC_REM_SERVERURL1 = 'http://localhost:3911'
//
//  Local Client --> Local Server 2 --> Remote Database 2
//
exports.LOC_LOC_REM_CLIENT2 = 'LOCAL:3812'
exports.LOC_LOC_REM_SERVER2 = 'LOCAL:3912'
exports.LOC_LOC_REM_SERVERURL2 = 'http://localhost:3912'
//------------------------------------------------------------------------
//  Server details
//------------------------------------------------------------------------
exports.URL_REGISTER = '/QuizRegister'
exports.URL_SIGNIN = '/QuizSignin'
exports.URL_PROFILE = '/QuizProfile/:id'
exports.URL_TABLES = '/QuizTables'
//------------------------------------------------------------------------
//  Other Parameters
//------------------------------------------------------------------------
exports.MAX_QUESTIONS_SELECT = 50
exports.WAIT = 100
exports.WAIT_MAX_TRY = 20
