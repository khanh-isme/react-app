import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const  SECRET_KEY ='khanh';
const user= {
    id:1,
    username:'khanh',
    role:'admin'
}

const token = jwt.sign(user,SECRET_KEY,{ expiresIn : "1h"});
console.log(token);

const decode = jwt.decode(token);
console.log(decode);

dotenv.config();

console.log(process.env.JWT_SECRET);