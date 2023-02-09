//
//  Utilities
//
import createOptions from '../../utilities/createOptions'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
//
// Debug Settings
//
const debugLog = debugSettings()
//
//  Global
//
let timerStart
let sessionStorageItems = []
let sessionStorageItemsALL = 'Data_Options_ALL_Received'
let ownersString
//...................................................................................
//.  Main Line
//...................................................................................
export default function SigninInit() {
  if (debugLog) console.log(`Function: SigninInit`)
  //
  //  Initialisation
  //
  init()
  //
  //  Owner
  //
  let Promise_Owner
  if (!JSON.parse(sessionStorage.getItem('Data_Options_Owner_Received'))) {
    const cop_sqlWhere = `where oowner in (${ownersString})`
    Promise_Owner = createOptions({
      cop_sqlTable: 'owner',
      cop_sqlWhere: cop_sqlWhere,
      cop_id: 'oowner',
      cop_title: 'otitle',
      cop_store: 'Data_Options_Owner',
      cop_received: 'Data_Options_Owner_Received'
    })
  }
  //
  //  Ownergroup
  //
  let Promise_OwnerGroup
  if (!JSON.parse(sessionStorage.getItem('Data_Options_OwnerGroup_Received'))) {
    const cop_sqlWhere = `where ogowner in (${ownersString})`
    Promise_OwnerGroup = createOptions({
      cop_sqlTable: 'ownergroup',
      cop_owner: 'ogowner',
      cop_sqlWhere: cop_sqlWhere,
      cop_id: 'oggroup',
      cop_title: 'ogtitle',
      cop_store: 'Data_Options_OwnerGroup',
      cop_received: 'Data_Options_OwnerGroup_Received'
    })
  }
  //
  //   Wait for all promises
  //
  Promise.all([Promise_Owner, Promise_OwnerGroup]).then(values => {
    if (debugLog) console.log(`Promise values ALL values`, values)
    promisesAllComplete()
  })
  //...................................................................................
  //.  First time
  //...................................................................................
  function init() {
    //
    //  Get User and User/Owner
    //
    const User_Settings_Userowners = JSON.parse(sessionStorage.getItem('User_Settings_Userowners'))
    if (debugLog) console.log('User_Settings_Userowners ', User_Settings_Userowners)
    //
    //  Userowners string
    //
    ownersString = ''
    if (User_Settings_Userowners.length === 0) {
      const { DFT_USER_OWNER } = require('../../services/constants.js')
      ownersString = `'${DFT_USER_OWNER}'`
      if (debugLog) console.log('ownersString ', ownersString)
    } else {
      for (let i = 0; i < User_Settings_Userowners.length; i++) {
        const uoowner = User_Settings_Userowners[i].uoowner
        if (i > 0) ownersString = ownersString + `,`
        ownersString = ownersString + ` '${uoowner}'`
      }
    }
    if (debugLog) console.log('ownersString ', ownersString)
    sessionStorage.setItem('User_Settings_Userownersstring', JSON.stringify(ownersString))
    //
    //  Elapsed Time
    //
    timerStart = new Date()
    //
    //  Set storage items
    //
    sessionStorageItems.push('Data_Options_Owner_Received')
    sessionStorageItems.push('Data_Options_OwnerGroup_Received')
    //
    //  Initialise storage status to FALSE
    //
    sessionStorage.setItem(sessionStorageItemsALL, false)
    for (let i = 0; i < sessionStorageItems.length; i++) {
      sessionStorage.setItem(sessionStorageItems[i], false)
    }
  }
  //...................................................................................
  //.  Process completed promises
  //...................................................................................
  function promisesAllComplete() {
    if (debugLog) console.log(`Function: promisesAllComplete`)
    //
    //  Check if all completed
    //
    let ItemsALLStatus = true
    for (let i = 0; i < sessionStorageItems.length; i++) {
      const sessionItem = sessionStorageItems[i]
      const ItemStatus = JSON.parse(sessionStorage.getItem(sessionItem))
      if (debugLog) console.log(`SessionStorage(${sessionItem}) ${ItemStatus}`)
      if (!ItemStatus) {
        ItemsALLStatus = false
        if (debugLog) console.log(`SessionStorage(${sessionItem}) not received`)
        break
      }
    }
    //
    //  Data received
    //
    if (debugLog) console.log('ItemsALLStatus ', ItemsALLStatus)
    if (ItemsALLStatus) {
      const timeEnd = new Date()
      const timeDiff = timeEnd - timerStart
      if (debugLog)
        console.log(`SessionStorage(${sessionStorageItemsALL}) Elapsed Time(${timeDiff})`)
      sessionStorage.setItem(sessionStorageItemsALL, true)
    }
  }
}
