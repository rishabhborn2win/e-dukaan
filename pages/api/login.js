import initDB from '../../helpers/initDB'
import User from '../../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
initDB()

export default async (req,res) => {
    const {email,password} = req.body
    
    try {
        if (!email || !password){
            return res.status(422).json({error: 'Please add all fields'})
          }
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({error: 'No such user exists'})
        }
       const doMatch = await bcrypt.compare(password, user.password)
       if (!doMatch) {
        return res.status(401).json({error:"Invalid credentials"})
       }
       else{
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET || "updated it after correction",{
            expiresIn:"7d"
        })
        const {name,role,email} = user
        res.status(201).json({token,user:{name,role,email}})
       }
        
     
        res.status(201).json({message:"Logged in successfully"})
    } catch (error) {
        console.log(error)
    }
}