const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const JWT=require('jsonwebtoken')
const Task=require('./task')

const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required:true,
        trim:true,
        minlength:7,
        validate(e){
            if(e.includes('password')||e.includes('PASSWORD'))
            {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age:{
        type: Number,
        default:19,
        validate(e){
            if (e<0) {
                throw new Error ('Age must be positive')
            }
        }
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase:true,
        unique:true,
        validate(e){
            if(!validator.isEmail(e))
            {
                throw new Error ('Please enter a valid email')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})


userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.statics.findByCredentials=async (email,password)=>{
    const user=await User.findOne({email:email})
    if (!user) {
         throw new Error('Unable to login')
    }
    const isMatch=await bcrypt.compare(password,user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}



userSchema.methods.generateAuthToken=async function(){
    try {
        const token=JWT.sign({_id:this._id.toString()},process.env.JWT_SECRET)
        this.tokens.push({token})
        await this.save()
        return token
        
    } catch (error) {
        console.log(error)
        
    }
    
}


userSchema.methods.toJSON= function(){
    const userObject=this.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}



//Hashing
userSchema.pre('save',async function(next){

    if (this.isModified('password')) {
        this.password= await bcrypt.hash(this.password,8)
    }
    next()  //Need to provide this to tell middleware to complete execution
    
})

//Delete user taks when user is removed
userSchema.pre('remove',async function (next){
    await Task.deleteMany({owner:this._id})
    next()

})


const User=mongoose.model('User',userSchema)
    

module.exports=User