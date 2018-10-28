// import { dbCon } from './node-practice'

let mysql = require('mysql')
let bcrypt = require('bcrypt')

let dbCon =  mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ""
})

let sqlConnected = false
dbCon.connect(function(err) {
    if (err) throw err
    console.log("Connected to SQL")
    sqlConnected = true
    selectDb("nodeDb")
})

exports.anyCommand = (comm) => {
    dbCon.query(comm, (err,result)=>{
        if (err) throw err
        console.log("SQL: " + comm)
        return result
    })
}

function createDb(dbName){
    dbCon.query("CREATE DATABASE " + dbName, function (err, result) {
        if (err) throw err
        console.log("Database " + dbName + " created")
    })
}

exports.createDb = (dbName) => {
    createDb(dbName)
}

function selectDb(dbName){
    dbCon.query("USE " + dbName, (err,result)=>{
        if (err) createDb(dbName)
        else console.log("Using database " + dbName)
    })
}

exports.selectDb = (dbName) => {
    selectDb(dbName)
}

// function selectTable(tbName){
//     dbCon.query("CREATE TABLE" + tbName)
// }

exports.createTable = (tbName,argString,createPrimaryKey) => {
    argString = " " + argString || ""
    createPrimaryKey = createPrimaryKey || false

    dbCon.query('CREATE TABLE ' + tbName + argString,(err,result) => {
        if (err) console.log('Did NOT create table ' + tbName)
        else
        {
        console.log("Table " + tbName + " created")
        if(createPrimaryKey && !argString.includes('PRIMARY KEY')){
            dbCon.query("ALTER TABLE " + tbName + " ADD COLUMN key AUTO_INCREMENT",(err,result) => {
                if (err) throw err
            })
            dbCon.query("ALTER TABLE " + tbName + " ADD COLUMN PRIMARY KEY(key)",(err,result) => {
                if (err) throw err
            })
        }
    }
    })
}

exports.insertData = (tbName,columnArr,valueDArr) => {
    const comm = "INSERT INTO " + tbName + " (" + columnArr.join(", ") + ") VALUES ?"
    dbCon.query(comm,valueArr,(err,result) => {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) inserted to " + tbName)
        return result
    })
}

exports.updateData = (tbName,value,valueColumn,filterValue,filterColumn) => {
    const comm = "UPDATE " + tbName + " SET " + valueColumn + " = " + valueCanyon + " WHERE " + filterColumn + " = " + filterValue;
    dbCon.query(comm,valueArr,(err,result) => {
        if (err) throw err
        console.log("Record(s) for " + filterColumn + " " + filterValue + " updated to " + value)
        return result
    })
}

//result is an array of objects of all records
//fields is an array of objects about each column
exports.selectTable = (tbName,columnArr,limit,limitOffset) => {
    let comm
    if(!columnArr)
    {
        comm = "SELECT * FROM " + tbName
    }
    else
    {
        comm = "SELECT " + columnArr.join(", ") + "FROM " + tbName
    }
    if(limit){
        comm += " LIMIT " + limit
    }
    if(limit && limitOffset){
        comm += " OFFSET " + limitOffset
    }
    dbCon.query(comm,(err,result,fields) => {
        if (err) throw err
        console.log("SQL: " + comm)
        return result
    })
}

exports.selectTableFiltered = (tbName,filterColumn,filter,columnArr,limit,limitOffset) => {
    let comm
    if(!columnArr)
    {
        comm = "SELECT * FROM " + tbName + " WHERE " + filterColumn + " = '" + filter + "'"
    }
    else
    {
        comm = "SELECT " + columnArr.join(", ") + " FROM " + tbName + " WHERE " + filterColumn + " = '" + filter + "'"
    }
    if(limit){
        comm += " LIMIT " + limit
    }
    if(limit && limitOffset){
        comm += " OFFSET " + limitOffset
    }
    dbCon.query(comm,(err,result,fields) => {
        if (err) throw err
        console.log("SQL: " + comm)
        return result
    })
}

exports.selectSortedTable = (tbName,sortColumn,columnArr,desc,limit,limitOffset) => {
    let comm
    if(!columnArr)
    {
        comm = "SELECT * FROM " + tbName + " ORDER BY " + sortColumn
    }
    else
    {
        comm = "SELECT " + columnArr.join(", ") + " FROM " + tbName + " ORDER BY " + sortColumn
    }
    if(desc){
        comm += " DESC"
    }
    if(limit){
        comm += " LIMIT " + limit
    }
    if(limit && limitOffset){
        comm += " OFFSET " + limitOffset
    }
    dbCon.query(comm,(err,result,fields) => {
        if (err) throw err
        console.log("SQL: " + comm)
        return result
    })
}

exports.deleteRecords = (tbName,filterColumn,filter) => {
    const comm = "DELETE FROM " + tbName + " WHERE " + filterColumn + " = '" + filter + "'"
    dbCon.query(comm,(err,result) => {
        if (err) throw err
        console.log("SQL: " + comm)
        return result
    })
}

exports.deleteTable = (tbName) => {
    dbCon.query("DROP TABLE IF EXISTS " + tbName,(err,result) => {
        if (err) throw err
        console.log("Table " + tbName + " deleted")
    })
}

exports.savePassword = (pswd) => {
    bcrypt.hash(pswd, 5, function( err, bcryptedPassword) {
        //! save to db
    });
}

exports.comparePasswords = (givenPswd,dbPswd) => {
    bcrypt.compare(givenPswd, dbPswd, (err, isMatch) => {
        if (isMatch)
        {
            //!log in
        }else
        {
            //!user err
        }
    })
}