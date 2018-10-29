let express = require('express');
let router = express.Router();
let path = require("path")
let sql = require("../modules/sqlCom")
let cookieParser = require('cookie-parser')

let user
let cookies

router.get('/',(req,res,next) => {
    const cookies = req.cookies
    if(cookies.USER)
    {
      userCookie = cookies.USER.split('::')
      res.render('myprofile',{username: userCookie[1]})
    }
    else{
      res.redirect('../')
    }
})

module.exports = router;