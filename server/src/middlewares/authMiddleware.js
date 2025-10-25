import jwt from 'jsonwebtoken'

export const authMiddleware=(req,res,next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: "chua dang nhap"});
    }
    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        req.user =decode;
        next(); // thằng này cho phép đi qua hàm handler tiếp theo 
    }catch(err){
        return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
}
