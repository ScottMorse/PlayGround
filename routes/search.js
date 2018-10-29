let express = require('express');
let router = express.Router();
let path = require("path")
let url = require("url")
let sql = require("../modules/sqlCom")
let cookieParser = require('cookie-parser')

let user
let cookies

router.get('/',(req,res,next) => {
    const urlQuery = url.parse(req.url,true).query
    console.log(urlQuery)
    res.render('search')
})

module.exports = router