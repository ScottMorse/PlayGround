// import { dbCon } from './node-practice'

let mysql = require('mysql')
let bcrypt = require('bcrypt')


const config = {
    host: "localhost",
    user: "root",
    password: "",
    database: "nodeDb",
}

function wrapString(string){
    return "'" + string + "'"
}

let connectionState

function handleDisconnect() {
    connection = mysql.createConnection(config)
                                                
    connection.connect(function(err) {             
        if(err){
            console.log('error when connecting to db:', err)
            setTimeout(handleDisconnect, 2000)
        }
        else console.log('mySQL connected successfully')
      }                                    
    )                           
    connection.on('error', function(err) {
      console.log('db error: ')
      if(err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('PROTOCOL_CONNECTION_LOST')
        handleDisconnect()                        
      } else {                                     
        throw err                                 
      }
    })
    return connection
}

class Database {
    constructor( config ) {
        this.connection = handleDisconnect();
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
    checkTables()
      .then(after => console.log('mySQL tables okay.'))
      .catch(err => {setTimeout(checkTables(),1000)})
}

function checkTables(){
    return runCommand(selectTable('users')).catch(err => {
        runCommand(createTable('users',"( ID int NOT NULL AUTO_INCREMENT, username varchar(20) NOT NULL , email varchar(255) NOT NULL, pswd varchar(255) NOT NULL, fullname varchar(30), instrument varchar(50), aboutme varchar(280), location varchar(50), PRIMARY KEY (ID) )"))
    })
}

function runCommand(comm){
    return db.query(comm).catch(err => {throw err})
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

function updateColumns(tbName,valueArr,valueColumnArr,filterValue,filterColumn){
    if(valueArr.length == 1){
        return "UPDATE " + tbName + " SET " + valueColumnArr[0] + " = " + valueArr[0] + " WHERE " + filterColumn + " = " + filterValue
    }
    else{
        comm = "UPDATE " + tbName + " SET "
        for(let i=0;i<valueArr.length;i++){
            comm += valueColumnArr[i] + " = " + valueArr[i]
            comm += i < valueArr.length - 1 ? ", ":" "
        }
        comm += " WHERE " + filterColumn + " = " + filterValue
        return comm
    }
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

useDb()

exports.runCommand = (comm) => {return runCommand(comm)}
exports.selectTable = (tbName,columnArr,limit,limitOffset) => {return runCommand(selectTable(tbName,columnArr,limit,limitOffset))}
exports.createTable = (tbName,argString) => {return runCommand(createTable(tbName,argString))}
exports.selectSortedTable = (tbName,sortColumn,columnArr,desc,limit,limitOffset) => {return runCommand(selectSortedTable(tbName,sortColumn,columnArr,desc,limit,limitOffset))}
exports.selectTableFiltered = (tbName,filterColumn,filter,columnArr,limit,limitOffset) => {return runCommand(selectTableFiltered(tbName,filterColumn,filter,columnArr,limit,limitOffset))}
exports.insertData = (tbName,columnArr,valueArr) => {return runCommand(insertData(tbName,columnArr,valueArr))}
exports.updateColumns = (tbName,valueArr,valueColumnArr,filterValue,filterColumn) => {return runCommand(updateColumns(tbName,valueArr,valueColumnArr,filterValue,filterColumn))}
exports.deleteRecords = (tbName,filterColumn,filterValue) => {return runCommand(deleteRecords(tbName,filterColumn,filterValue))}
exports.deleteTable = (tbName) => {return runCommand(deleteTable(tbName))}

exports.wrapString = (string) => {return wrapString(string)}

exports.encryptPassword = (pswd) => {return bcrypt.hash(pswd, 5)}
exports.comparePasswords = (givenPswd,dbPswd) => {return bcrypt.compare(givenPswd, dbPswd)}
