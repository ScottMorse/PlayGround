let express = require('express');
let router = express.Router();
let path = require("path")
// let sql = require("../modules/sqlCom")
let cookieParser = require('cookie-parser')
let db = require('../modules/postGresMod')
let utils = require('../modules/utils')

const cookieName = 'SPACEPLAYUSER'

router.get('/',(req,res,next) => {
  const [uid,username] = utils.checkCookie(req,cookieName)
  if(!uid){
    res.redirect('../') 
    return
  }
  res.render('dashboard',{username:username})
})

module.exports = router;