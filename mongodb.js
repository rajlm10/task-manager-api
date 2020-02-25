// CRUD Create Read Update Delete

const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient
const ObjectID=mongodb.ObjectID

const connectionURL='mongodb://127.0.0.1:27017'
const databaseName='task-manager'

MongoClient.connect(connectionURL,{useNewUrlParser: true,useUnifiedTopology:true},(error,client)=>{
    if (error) {
        return console.log('Unable to connect to database');
        
    }
    const db=client.db(databaseName)
    
       // db.collection('tasks').insertMany([
    //     {
    //         description: 'Play football',
    //         completed: false
    //     },
    //     {
    //         description:'Eat outside',
    //         completed: false
    //     },
    //     {
    //         description:'Have a bath',
    //         completed: true
    //     }
    // ],(error,result)=>{
    //     if (error) {
    //         return console.log('Unable to insert tasks');
            
    //     }

    //     console.log(result.ops);
        
    // })

    // db.collection('users').findOne({name:'Simrn'},(error,document)=>{
    //     if (error) {
    //         return console.log('Unable to fetch');
            
    //     }

    //     console.log(document);
        
    // })


    // db.collection('users').find({age:19}).toArray((error,document)=>{
    //     console.log(document);
        
    // })

    // db.collection('users').find({age:19}).count((error,count)=>{
    //     console.log(count);
        
    // })

    // db.collection('tasks').findOne({_id:new ObjectID("5e47b089730a22353891cf1c")},(error,doc)=>{
    //     console.log(doc);
        
    // })

    // db.collection('users').updateOne({
    //     _id:new ObjectID("5e47ac935118723527b0c08d")
    // },{
    //     $inc:{
    //         age: 12
    //     }
    // }).then((result)=>{
    //     console.log(result);
    // }).then((error)=>{
    //     console.log(error);
        
    // })

    // db.collection('tasks').updateMany({
    //     completed:false
    // },{
    //     $set:{
    //         completed:true
    //     }
    // }).then((result)=>{
    //     console.log(result);
        
    // }).catch((error)=>{
    //     console.log(erro);
        
    // })

    // db.collection('users').deleteMany({
    //     age:19
    // }).then((result)=>{
    //     console.log(result);
        
    // }).catch((error)=>{
    //     console.log(error);
        
    // })

    // db.collection('tasks').deleteOne({
    //     description:'Eat outside'
    // }).then((result)=>console.log(result)
    // ).catch((error)=>console.log(error))

})
