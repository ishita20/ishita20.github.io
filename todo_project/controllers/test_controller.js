const todoList = require('../models/task_model');
let userTodoList = todoList.userTodoModel;

exports.getTask = function(req,res){
    userTodoList.find({user:req.params.user}, function(err,todo){
        let x = todo[0]['todo']
        let disp = '<ul>';
    for(let i=0;i<x.length;i++){
        disp+='<li>'+x[i]['task']+" "+x[i]['label']+'<button class="remove" id="'+i+'">X</button></li>';
    }
    disp+='</ul>';
    document.getElementById('list').innerHTML=disp;
    let buttons = document.getElementsByClassName('remove');
    for(let i=0;i<buttons.length;i++){
        buttons[i].addEventListener('click',remove);
    }
    })

    
};