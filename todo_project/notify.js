// const todoList = require('../models/task_model');
// let userTodoList = todoList.userTodoModel;

// let arr = userTodoList.find({user:"ishita.singh"})
// console.log(arr)

const mongoose = require('mongoose');

let connStr = 'mongodb+srv://dbUser:dbUser@cluster0-xctyf.mongodb.net/test?retryWrites=true'
let mongoDB = process.env.MONGODB_URI || connStr;
mongoose.connect(mongoDB);

let db = mongoose.connection; 
db.on('error', console.error.bind(console, 'mongoDB conn error:'));

// const todoList = require('../models/task_model');
// let userTodoList = todoList.userTodoModel;

let taskSchema = new mongoose.Schema({
    task: String,
    label: String
},
{ _id : false });

let userTodoSchema = new mongoose.Schema({
    user:{
        type:String,
        required: true,
        unique: true
        //validate
    },
    
    todo:[taskSchema]
});

let userTodoList = mongoose.model('todo_list',userTodoSchema);

let arr = userTodoList.find({user:'ishita.singh'},function(err,user){
    let task = user[0]['todo']
    let i
    for(i=0;i<task.length;i++){
        console.log(task[i]['task'])
    }
})

