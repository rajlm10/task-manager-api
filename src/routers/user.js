const express=require('express')
const User=require('../models/user')
const auth=require('../middleware/authentication')
const multer=require('multer')
const sharp=require('sharp')
const {sendWelcomeEmail,sendCancellationEmail}=require('../emails/account')
const router=new express.Router()

router.post('/users',async (req,res)=>{
    const user=new User(req.body)
    

    try {
        
        sendWelcomeEmail(user.email,user.name)
        const token=user.generateAuthToken()
        res.status(201)
        res.send({
            user,
            token
        })
    } catch (error) {
        res.status(400)
        res.send(error)
        
    }


    // user.save().then(()=>{
    //     res.status(201)
    //     res.send(user)
    // }).catch((err)=>{
    //     res.status(400)
    //     res.send(err)
    // })

})

router.post('/users/login',async (req,res)=>{
    try {
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken()
        res.send({
            user,
            token
        })
    } catch (error) {
        res.status(400).send()
    }
})

router.post('/users/logout',auth,async (req,res)=>{
    try {
        req.user.tokens=req.user.tokens.forEach((tkn,i)=>{
            if(tkn===req.token)
            {
                return req.user.tokens.splice(i,1)
            }
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll',auth,async (req,res)=>{
    try {
        req.user.tokens=[]
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).save()
    }
})

router.get('/users/me',auth,async (req,res)=>{     //auth is our middleware and middleware must call next
    res.send(req.user)      //which we embedded in the middleware
    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((e)=>{
    //     res.status(500)
    //     res.send()
    // })

}) 


router.patch('/users/me',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    let isValid=1
    
    updates.forEach((update)=>{
        if(!allowedUpdates.includes(update))
        {
            isValid=0
        }
    })

    if(!isValid)
    {
        return res.status(400).send({error:'Invalid properties chosen for update'})
    }


    try {
        

        updates.forEach((update)=>{
            req.user[update]=req.body[update]            //Done for middleware
        })

        await req.user.save()
        //const updatedUser= await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        res.send(req.user)
    } catch (error) {        
        res.status(400).send(error) //incorrect validation
    }
})

router.delete('/users/me',auth,async (req,res)=>{
    try {
        // const deleted= await User.findByIdAndDelete(req.user._id)   //auth gives us access to req.user
        // if (!deleted) {
        //     res.status(404).send()
        // }
        await req.user.remove()
        sendCancellationEmail(req.user.email,req.user.name)
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

const upload=multer({
    
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('The uploaded file must be a jpg,jpeg or png'))
        }
        cb(undefined,true)
    }
})


router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar',async (req,res)=>{
    try {
        const user=await User.findById(req.params.id)
        if (!user||!user.avatar) {
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})

module.exports=router