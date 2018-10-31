let express = require('express');
let router = express.Router();
let path = require("path")
// let sql = require("../modules/sqlCom")
let cookieParser = require('cookie-parser')
let db = require('../modules/postGresMod')
let utils = require('../modules/utils')
let bodyParser = require('body-parser')
let url = require('url')

const cookieName = 'SPACEPLAYUSER'

let user

router.get('/',(req,res,next) => {
    const [uid,username] = utils.checkCookie(req,cookieName)
    const profileId = url.parse(req.url,true).query.uid
    if(!profileId){
        res.redirect('../dashboard')
        return
    }
    if(uid == profileId){
        res.redirect('../myprofile')
    }
    else{
        db.filterData('users',['username','fullname','location','instrument'],['id'],profileId)
          .then(row => {
              if(row.length == 0){
                  res.redirect('../dashboard')
              }
              else{
                res.render('profile',{user:row[0]})
              }
          }).catch(err => console.log(err))
    }
    // db.any('SELECT id, username, fullname, instrument, location FROM users WHERE username ILIKE ' + matcher + ' OR fullname ILIKE ' + matcher + ' ;')
    //   .then(result => res.render('search', {'matches':result}))
    //   .catch(err=>console.log(err))
})

module.exports = router