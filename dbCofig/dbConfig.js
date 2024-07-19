const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
    instancename:"SUJIT", 
    user: 'sa',
    password: process.env.DB_PASSWORD,
    server: process.env.SERVER,
    database:"SAMPLE2",
    options: {
        encrypt: false,
        trustServerCertificate: true,
        trustedConnection:false,
    } 
};  

sql.connect(dbConfig, err =>{
    if(err){ 
        console.log("Error in Connection");
        console.log(err);
    }
    else{
        console.log("Connected SuccessFully");
    }
})

module.exports={dbConfig }