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
      sql.selectTableFiltered('users','ID',userCookie[0],null,1).then(rows => {
         user = rows[0]
         res.render('myprofile',{
           username: user.username,
           email: user.email,
           fullname: user.fullname,
           aboutme: user.aboutme,
           instrument: user.instrument,
           location: user.location})
      })
    }
    else{
      res.redirect('../')
    }
})

router.get('/edit',(req,res,next) => {
    const cookies = req.cookies
    if(!user){
      if(cookies.USER)
      {
        userCookie = cookies.USER.split('::')
        sql.selectTableFiltered('users','ID',userCookie[0],null,1).then(rows => {
          user = rows[0]
          res.render('editprofile',{
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            aboutme: user.aboutme,
            instrument: user.instrument,
            location: user.location})
        })
      }
      else{
        res.redirect('/')
      }
    }
    else{
        if(!cookies.USER){
          user = undefined
          res.redirect('/')
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
    }
})

router.post('/newProfileInfo',(req,res,next) => {
    const cookies = req.cookies
    if(!user){
      if(cookies.USER)
      {
        userCookie = cookies.USER.split('::')
        sql.selectTableFiltered('users','ID',userCookie[0],null,1).then(rows => {
            user = rows[0]
            let valsToChange = []
            let colsToChange = []
            Object.keys(req.body).forEach(columnName => {
              const newValue = req.body[columnName]
              if(newValue)
              {
                valsToChange.push(sql.wrapString(newValue))
                colsToChange.push(columnName)
              }
            })
            if(valsToChange){
              sql.updateColumns('users',valsToChange,colsToChange,user.ID,'ID')
            }
            res.redirect('/myprofile')
        })
      }
      else{
        res.redirect('../')
      }
    }
    else{
      let valsToChange = []
      let colsToChange = []
      Object.keys(req.body).forEach(columnName => {
        const newValue = req.body[columnName]
        if(newValue)
        {
          valsToChange.push(sql.wrapString(newValue))
          colsToChange.push(columnName)
        }
      })
      if(valsToChange){
        sql.updateColumns('users',valsToChange,colsToChange,user.ID,'ID')
      }
      res.redirect('/myprofile')
    }
})

module.exports = router;