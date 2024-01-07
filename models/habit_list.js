// creating model/habitschema
const mongoose=require('mongoose')

const habitschema=new mongoose.Schema({
    value:{
        type: String,
        required: true
    },
    weeklyStatus: [
        {
            day: { type: String, required: true },
            status: { type: String, enum: ['Completed', 'Unmarked', 'Not done'], default: 'Unmarked' }
        }
    ]
})

const Habits=mongoose.model('Habit',habitschema)
module.exports=Habits