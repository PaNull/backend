require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;

export async function connect() {
  if(global.connection && global.connection.state !== 'disconnected')
      return global.connection;
  const mysql = require("mysql2/promise");

  const connection = await mysql.createPool(databaseUrl);
  console.log("Conectou no MySQL!");

  global.connection = connection;
  
  return connection;
}
