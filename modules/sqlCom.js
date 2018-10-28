// import { dbCon } from './node-practice'

let mysql = require('mysql')
let bcrypt = require('bcrypt')

const dbName = 'nodeDb'

const config = {
    host: "localhost",
    user: "root",
    password: ""
}

class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
        console.log('SQL connection successful')
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                console.log('SQL connection closed.')
                resolve();
            } );
        } );
    }
}

let db
function useDb(){
    db = new Database(config)
    console.log('SQL using database ' + dbName)
    return db.query("USE " + dbName)
}

useDb()

function runCommand(comm){
    console.log(comm)
    return db.query(comm)
}

function selectTable(tbName,columnArr,limit,limitOffset){
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
    return comm
}

function createTable(tbName,argString){
    argString = " " + argString || ""
    comm = 'CREATE TABLE ' + tbName + argString
    return comm
}


function insertData(tbName,columnArr,valueArr){
    return "INSERT INTO " + tbName + " (" + columnArr.join(", ") + ") VALUES " + "(" + valueArr.join(", ") + ")"
}

function updateData(tbName,value,valueColumn,filterValue,filterColumn){
    return "UPDATE " + tbName + " SET " + valueColumn + " = " + valueCanyon + " WHERE " + filterColumn + " = " + filterValue
}

function selectTableFiltered(tbName,filterColumn,filter,columnArr,limit,limitOffset){
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
    return comm
}

function selectSortedTable (tbName,sortColumn,columnArr,desc,limit,limitOffset){
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
    return comm
}

function deleteRecords(tbName,filterColumn,filterValue){
    return comm = "DELETE FROM " + tbName + " WHERE " + filterColumn + " = '" + filterValue + "'"
}

function deleteTable(tbName){
    return "DROP TABLE IF EXISTS " + tbName
}

exports.runCommand = (comm) => {return runCommand(comm)}
exports.selectTable = (tbName,columnArr,limit,limitOffset) => {return runCommand(selectTable(tbName,columnArr,limit,limitOffset))}
exports.createTable = (tbName,argString) => {return runCommand(createTable(tbName,argString))}
exports.selectSortedTable = (tbName,sortColumn,columnArr,desc,limit,limitOffset) => {return runCommand(selectSortedTable(tbName,sortColumn,columnArr,desc,limit,limitOffset))}
exports.selectTableFiltered = (tbName,filterColumn,filter,columnArr,limit,limitOffset) => {return runCommand(selectTableFiltered(tbName,filterColumn,filter,columnArr,limit,limitOffset))}
exports.insertData = (tbName,columnArr,valueArr) => {return runCommand(insertData(tbName,columnArr,valueArr))}
exports.updateData = (tbName,value,valueColumn,filterValue,filterColumn) => {return runCommand(updateData(tbName,value,valueColumn,filterValue,filterColumn))}
exports.deleteRecords = (tbName,filterColumn,filterValue) => {return runCommand(deleteRecords(tbName,filterColumn,filterValue))}
exports.deleteTable = (tbName) => {return runCommand(deleteTable(tbName))}

exports.encryptPassword = (pswd) => {
    bcrypt.hash(pswd, 5, function( err, bcryptedPassword) {
        if (err) throw err
        console.log(bcryptedPassword)
        return bcryptedPassword
    })
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
