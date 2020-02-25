const mongoose=require('mongoose')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
})


//  const me=new User({name:' Raj  ',password:'hithere',email:"rajbsAngani@gmail.com   "})

//  me.save().then((me)=>console.log(me)).catch((err)=>console.log(err))



// const football=new Task({description:"Have Coffee"})

// football.save().then((obj)=>{
//     console.log(obj);
    
// }).catch((err)=>{
//     console.log(err);
    
// })