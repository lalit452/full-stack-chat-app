import jwt from "jsonwebtoken"

export const generateToken = (userId, res)=>{
const token = jwt.sign({userId}, process.env.JWT_SECRET,{
    expiresIn : "7d"
})

res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,  //MS
    httpOnly: true, //prevent XSS attacks corss-site scripting attack
    sameSite: "strict", //CSRF attacks cross-site forgery attacks
    secure: process.env.NODE_ENV !== "development"  // jab tak devvelopment me rahenge ye false rahega
});

return token;
} 

//  {userId} is payload of the token