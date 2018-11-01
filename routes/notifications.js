const express = require('express');
const router = express.Router();
const path = require("path")
const url = require("url")
// const sql = require("../modules/sqlCom")
const cookieParser = require('cookie-parser')
const db = require('../modules/pgutils')
const utils = require('../modules/utils')

const cookieName = 'SPACEPLAYUSER'

const queryRegex = new RegExp(/[\W]/,'g')

let user


router.get('/',(req,res,next) => {
    const [uid,username] = utils.checkCookie(req,cookieName)
    if(!uid){
        res.redirect('../')
        return
    }
    let notifications = []
    db.filterData('usernotifications',['notifications'],['uid'],[uid])
      .then(row => {
            row[0].notifications.forEach(notification => {
            const [notifCode,evId] = notification.split('::')
            
            notifications.push({'code':notifCode,'evId':evId})
            })
          console.log(notifications)
          res.render('notifications',{})
    })
})

module.exports = router