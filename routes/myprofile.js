let express = require('express');
let router = express.Router();
let path = require("path")
// let sql = require("../modules/sqlCom")
let cookieParser = require('cookie-parser')
let db = require('../modules/postGresMod')
let utils = require('../modules/utils')

const cookieName = 'SPACEPLAYUSER'

let user
let cookies

router.get('/',(req,res,next) => {
    const [uid,username] = utils.checkCookie(req,cookieName)
    if(uid){
      db.filterData('users',['*'],['id'],[uid]).then(rows => {
         user = rows[0]
         res.render('myprofile',{
           username: user.username,
           email: user.email,
           fullname: user.fullname,
           aboutme: user.aboutme,
           instrument: user.instrument,
           location: user.location})
      }).catch(err => console.log(err))
    }
    else{
      res.redirect('../')
    }
})

router.get('/edit',(req,res,next) => {
    if(!user){
      const [uid,username] = utils.checkCookie(req,cookieName)
      if(uid){
        db.filterData('users',['*'],['id'],[uid]).then(rows => {
           user = rows[0]
           res.render('myprofile',{
             username: user.username,
             email: user.email,
             fullname: user.fullname,
             aboutme: user.aboutme,
             instrument: user.instrument,
             location: user.location})
        }).catch(err => console.log(err))
      }
      else{
        res.redirect('/myprofile')

      }
    }
    else{
      res.render('editprofile',{
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        aboutme: user.aboutme,
        instrument: user.instrument,
        location: user.location
      })
    }
})

 router.post('/newProfileInfo',(req,res,next) => {
    if(!user){
      const [uid,username] = utils.checkCookie(req,cookieName)
      if(uid){
        db.filterData('users',['*'],['id'],[uid]).then(rows => {
           user = rows[0]
           let valsToChange = []
           let colsToChange = []
           if(req.body.length > 0){
              Object.keys(req.body).forEach(columnName => {
                const newValue = req.body[columnName]
                if(newValue)
                {
                  valsToChange.push(db.wrap(newValue))
                  colsToChange.push(columnName)
                }
              })
              if(valsToChange.length > 0){
                db.updateData('users',colsToChange,valsToChange,['id'],[uid]).then(after => res.redirect('/myprofile'))
              }
              else{
                res.redirect('/myprofile')
              }
           }
           else{
             res.redirect('/myprofile')
           }
        }).catch(err => console.log(err))
      }
      else{
        res.redirect('/myprofile')
      }
    }
    else{
      const uid = user.id
      db.filterData('users',['*'],['id'],[uid]).then(rows => {
        user = rows[0]
        let valsToChange = []
        let colsToChange = []
        if(Object.keys(req.body).length > 0){
          Object.keys(req.body).forEach(columnName => {
            const newValue = req.body[columnName]
            if(newValue)
            {
              valsToChange.push(db.wrap(newValue))
              colsToChange.push(columnName)
            }
          })
          if(valsToChange.length > 0){
            db.updateData('users',colsToChange,valsToChange,['id'],[uid]).then(after => res.redirect('/myprofile'))
          }
          else{
            res.redirect('/myprofile')
          }
        }
        else{
          res.redirect('/myprofile')
        }
      }).catch(err => console.log(err))
    }
  })

module.exports = router;