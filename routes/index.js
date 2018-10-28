let express = require('express');
let router = express.Router();
let path = require("path")
let sqlCom = require("../modules/sqlCom")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})

router.post('/submit', function(req,res,next){
  console.log('form submission')
  res.render('index', { title: 'Express' });
})

module.exports = router;
