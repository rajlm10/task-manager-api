const express=require('express')
const Task=require('../models/task')
const auth=require('../middleware/authentication')

const router= new express.Router()

router.post('/tasks',auth,async (req,res)=>{
    const task=new Task({
        ... req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send()
    }

})




router.get('/tasks',auth,async (req,res)=>{
    const match={}
    const sort={}
    
    if (req.query.completed) {
        
        match.completed=req.query.completed
    } 

    if (req.query.sortBy) {
        const parts=req.query.sortBy.split('_')
        sort[parts[0]]=parts[1]==='desc'?-1:1
    }
   
    try {
        //tasks=await Task.find({owner:req.user._id,completed:comp},{limit:1})  //req.user comes from the auth file again which gives the currently authenticated user
            
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip)
            },
            sort
        }).execPopulate()     //will also give the same result
        
        
        
        
        res.status(200).send(req.user.tasks)
    } catch (error) {
        console.log(error)
        
        res.status(400).send(error)
    }

    
})


router.get('/tasks/:id',auth,async (req,res)=>{
    const _id=req.params.id
    

    try {
        //const task=await Task.findById(_id)
        const task= await Task.findOne({_id,owner:req.user._id})    //individual task that I have created
        if(!task)
        {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }

})

router.patch('/tasks/:id',auth,async (req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['decription','completed']
    let isValid=1



    updates.forEach((update)=>{
        if(!allowedUpdates.includes(update))
        {
            isValid=0
        }
    })

    if (!isValid) {
        res.status(400).send('Invalid properties chosen for update')
    }

    try {
        //const updated= await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        const updated=await Task.findOne({_id: req.params.id,owner: req.user._id})
        console.log(updated)
        

        
        
        if(!updated)
        {
            res.status(404).send()
        }
        
        updates.forEach((update)=>{
            updated[update]=req.body[update]
        })
        await updated.save()
        res.send(updated)
    } catch (error) {
        console.log(error)
        
        res.status(400).send()  //incorrect validation
    }
})

router.delete('/tasks/:id',auth,async (req,res)=>{
    try {
        const deleted=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if (!deleted) {
            return res.status(404).send()
        }
        res.send(deleted)
    } catch (error) {
        res.status(500).send()
    }
})


module.exports=router