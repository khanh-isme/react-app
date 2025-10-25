import db from "../database/index.js";

async function getAllUser() {
    const [rows] = await db.query('SELECT * from users');
    return rows;
}

 const createUser = async (username, email, password) => {
  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  const [result] = await db.execute(sql, [username, email, password]);
  return { id: result.insertId, username, email };
};

 const createUserdemo = async (username, password) => {
  const sql = "INSERT INTO usersdemo (username, password) VALUES (?, ?)";
  const [result] = await db.execute(sql, [username, password]);
  return { id: result.insertId, username };
};

export const findByUsername = async (username) =>{
  const sql ="Select * FROM usersdemo where username=?";
  const [rows] = await db.execute( sql,[username]);
  return rows;
}


export default {getAllUser,createUserdemo,findByUsername};