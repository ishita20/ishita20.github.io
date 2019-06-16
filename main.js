function get_list(){
    let todo=new Array;
    let todoStr=localStorage.getItem('todo');
    if(todoStr != null){
        todo=JSON.parse(todoStr);
    }
    //return list as array
    return todo;
}

function showList(){
    let tasks = get_list();
    let disp = '<div class="unordered_list"><ul>';
    for(let i=0;i<tasks.length;i++){
        disp+='<li><div>'+tasks[i]['task']+'</div><div>'+tasks[i]['label']+'</div><div><button class="remove" id="'+i+'">Delete</button></div></li>';
    }
    disp+='</ul></div>';
    // document.getElementById('list').innerHTML=disp;
    document.getElementsByClassName('list')[0].innerHTML=disp;
    let buttons = document.getElementsByClassName('remove');
    for(let i=0;i<buttons.length;i++){
        buttons[i].addEventListener('click',remove);
    }
}

function remove(){
    let removeButtonId=this.getAttribute('id');
    let list = get_list();
    // remove 1 element from index removeButtonId
    list.splice(removeButtonId,1);
    let tempList = JSON.stringify(list);
    localStorage.setItem('todo',tempList);
    showList();
    //check
    //return false;
}

function addTask(){
    let task=document.getElementById('addTask').value;
    let label = document.getElementById('label').value;
    // let label_text = document.getElementById('label').value
    let list = get_list();
    list.push({task:task,label:label});
    let tempList=JSON.stringify(list);
    localStorage.setItem('todo',tempList);
    //to refreash the list with updated items
    showList();
    //navigator.geolocation.clearWatch(watcher)
    //initialize()
    //check use
    //return false;
}

function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
  }

async function initialize(){
    let service = new google.maps.places.PlacesService(document.getElementById('places'));
    // var dict = {}
    // //let places = []
    // let todoList = get_list()
    // for(let i = 0;i<todoList.length;i++){
    //     let item = todoList[i]
    //     if(dict[item['label']]){// if key already present push to array
    //         dict[item['label']].push(item['task'])
    //     } else {// else add a new array for that key
    //         dict[item['label']] = [item['task']]
    //     }
    // }

    function nearbySearch(request){
        return new Promise(function(resolve){
            service.nearbySearch(request,function(results){
                resolve({label : request.type,response : results})
            })
        })
    }

    async function getPlaces(position){

        count++
        var dict = {}
    //let places = []
    let todoList = get_list()
    for(let i = 0;i<todoList.length;i++){
        let item = todoList[i]
        if(dict[item['label']]){// if key already present push to array
            dict[item['label']].push(item['task'])
        } else {// else add a new array for that key
            dict[item['label']] = [item['task']]
        }
    }

        let allRequests = [];
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        for (const [key, value] of Object.entries(dict)) {
            var request = {
                location: pos,
                radius: '1500',
                type: key
            }
        allRequests.push(nearbySearch(request))
        }

        let allResponse = await Promise.all(allRequests);
        // Promise.all(allRequests).then(function(values){
        //     values.forEach(function(element,index,array){
        //         array[index] = array[index].slice(0,3)
        //     })
        //     console.log(values)
        // })
        let message = ""
        allResponse.forEach(function(element,index,array){
            
            if(element['response'].length>3){
                element['response'] = element['response'].slice(0,3)
            }

            element['response'].forEach(function(innerElement,index2,array2){
                
                array2[index2] = innerElement['name']
                
            })
            element['label'] = dict[element['label']]
            //console.log("For "+ element['label']+" you can go to "+element['response'])
            message += "For "+ element['label']+" you can go to "+element['response']+"\n"
        })
        // function notify(message){
        //     var notification = new Notification("Hi there!",{body: message})
        // }
        // notify(message)
        
        if(count!=1 && message!=""){
            let start = new Date()
            alert(message)
            console.log(count+":"+start.getTime())
        }
        
    }
    let count = 0
    const watcher = navigator.geolocation.watchPosition(getPlaces, error, {distanceFilter:2000});
    setTimeout(() => {
        navigator.geolocation.clearWatch(watcher);
    }, 6000000);

}

document.getElementById('add').addEventListener('click',addTask);
showList();
window.addEventListener('load',initialize)
console.log("Hi")
