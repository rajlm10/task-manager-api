const JWT=require('jsonwebtoken')
const User=require('../models/user')

const auth= async (req,res,next)=>{
    try {
        const token=req.header('Authorization').replace('Bearer ','')
        
        const decoded=JWT.verify(token,process.env.JWT_SECRET)
        
        
        const user=await User.findOne({_id: decoded._id,'tokens.token':token})   //using tokens.token as we can't write tokens.token since it has . also were checking whether the token passed was already in the tokens array
        
        if (!user) {
            throw new Error()
        }
        
        req.user=user
        req.token=token
        next()
        
    } catch (e) {
        
        
        
        res.status(401).send({error:"Please authenticate"})
    }
    
    
}


module.exports=auth