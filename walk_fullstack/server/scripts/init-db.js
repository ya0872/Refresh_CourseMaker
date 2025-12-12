import fs from 'fs';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const {
  DB_HOST='127.0.0.1', DB_PORT=3306, DB_USER='root',
  DB_PASSWORD='', DB_NAME='walkapp'
} = process.env;

async function main(){
  const sql = fs.readFileSync(new URL('../schema.sql', import.meta.url)).toString('utf8');
  const conn = await mysql.createConnection({
    host: DB_HOST, port: Number(DB_PORT),
    user: DB_USER, password: DB_PASSWORD, database: DB_NAME, multipleStatements: true
  });
  await conn.query(sql);
  await conn.end();
  console.log('✅ schema applied');
}
main().catch(e=>{ console.error(e); process.exit(1); });
