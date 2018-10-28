let express = require('express');
let router = express.Router();
let path = require("path")
let sqlCom = require("../modules/sqlCom")

sqlCom.selectTable('users').then(res => console.log(res))


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})

router.post('/register', function(req,res,next){
  console.log('Registration form sent')
  const username = req.body.regUsername
  const email = req.body.regEmail
  const pswd = sqlCom.encryptPassword(req.body.regPswd)
  // sqlCom.selectTable('users').then(fields => console.log(fields))
  res.render('index', { title: 'Express' });
})

module.exports = router;
