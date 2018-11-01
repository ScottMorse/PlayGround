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

//TODO MAKE SEARCH BETTER WITH TYPOS
router.get('/',(req,res,next) => {
    const urlQuery = url.parse(req.url,true).query
    const searchQ = urlQuery.query.split(' ').map(word => word.replace(queryRegex,'')).join(' ')
    const matcher = db.wrap('%' + searchQ + '%')
    db.any('SELECT id, username, fullname, instrument, location FROM users WHERE username ILIKE ' + matcher + ' OR fullname ILIKE ' + matcher + ' ;')
      .then(result => {
          if(result.length <= 15){
            res.render('search', {'query':searchQ,'matches':result,'showPage':[],'nextform':[],'prevform':[]})
            return
          }
          const page = parseInt(urlQuery.page)
          if(page){
             let startIndex = (page - 1) * 15 - 1
             if(startIndex < 0){
                 startIndex = 0
             }
             let endIndex = startIndex + 16
             let prevform
             let nextform
             if(endIndex >= result.length){
                 endIndex -= result.length - endIndex
                 prevform = [0]
                 nextform = []
             }
             else{
                 if(page < 2){
                    prevform = []
                    nextform = [0]
                 }
                 else{
                     nextform = [0]
                     prevform = [0]
                 }
             }
             res.render('search',{'query':searchQ,'matches':result.slice(startIndex,endIndex),'showPage':[0],'page':page,'nextform':nextform,'prevform':prevform})
          }
          else{
            res.render('search',{'query':searchQ,'matches':result.slice(0,15),'page':1,'showPage':[0],'prevform':[],'nextform':[0]})
          }
      }).catch(err=>console.log(err))
})

module.exports = router