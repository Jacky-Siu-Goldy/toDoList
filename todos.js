
//toDos: An array of To Dos
let toDos = [{
    id: 1,
    thingsToDo: "vaccum living room.",
    active: true,
    completed: false,
    editing: false
},{
    id: 2,
    thingsToDo: "clean bedroom.",
    active: true,
    completed: false,
    editing: false
},{
    id: 3,
    thingsToDo: "mop kitchen floor.",
    active: true,
    completed: false,
    editing: false
},{
    id: 4,
    thingsToDo: "buy groceries.",
    active: true,
    completed: false,
    editing: false
},{
    id: 5,
    thingsToDo: "do leetcode.",
    active: true,
    completed: false,
    editing: false
}];
//id1: make sure the new id is always unique
let id1 = toDos.length;

//let toDos3=[];


let hide_completed = false;
let hide_inactive = false;

const savedToDos = JSON.parse(localStorage.getItem("toDos"));

if(savedToDos){
    toDos = savedToDos;
}

const filters = {
    searchText: ""
}

    // renderToDos(): used for rendering the table after each state change
    const renderToDos = function (){
        console.log("renderToDos Called");
        const filteredToDos = toDos.filter(function(note){
            let filtered_toDos = note.thingsToDo.toLowerCase().includes(filters.searchText.toLowerCase());
         if(!filtered_toDos) return false;
         if(hide_completed && note.completed) return false;
         if(hide_inactive && !note.active) return false
         return true; 
         })

    tableBody.innerHTML = '';
    
    filteredToDos.forEach(function(e){
         const tableRow = document.createElement("tr");
         tableRow.id ="row-" + e.id;
         tableRow.innerHTML =`
        <td class="todo-text" id="todo-text${e.id}"> 
            ${
                e.editing 
                ? `<input type="text" class="todoInput" data-index-number="${e.id}" value="${e.thingsToDo}">`: e.thingsToDo}</td>
        <td>
           <input type="checkbox" class="active-box" id="active-box${e.id}">
                         
            <button type="button" class="edit" data-index-number="${e.id}">${e.editing? "Save":"Edit"}</button>
        </td>
        <td>
            <input type="checkbox" class="completed-box" id="completed-box${e.id}">
            <button type="button" class="delete" data-index-number="${e.id}">Delete</button>
        </td>`;

        
        
       tableBody.appendChild(tableRow);
        document.getElementById("active-box"+ e.id).checked = e.active;
        document.getElementById("completed-box" + e.id).checked = e.completed;
        
        
    })
 
   updateSummary();

}
//updateSummary(): update the number of to dos at the top of the page under heading
function updateSummary(){
    let numbOfToDos = document.querySelector("#numbOfToDos");
    numbOfToDos.textContent = `You have ${summaryOfToDos().length} ToDos left.`;

}

//summaryOfToDos(): return an array of to dos after filtering out the completed one
   function summaryOfToDos(){
    return toDos.filter(function(todos){
         return !todos.completed;
    });}

//addToDos(id, thingsToDo, active, completed, editing): push a new to Dos object into the toDos Array
function addToDos(id, thingsToDo, active, completed, editing){
    
    
    toDos.push({ id, 
                 thingsToDo, 
                 active, 
                 completed, 
                 editing});

}

//saveToDos(): save the current state of the todo app into local storage
function saveToDos(){
    localStorage.setItem("toDos", JSON.stringify(toDos));
}

const tableBody = document.querySelector("#newToDos2");

//EventListener for the delete or edit buttons
  tableBody.addEventListener('click', function(e){
   const id = Number(e.target.dataset.indexNumber);
  
   if(!id) return;
   const todo = toDos.find(t => t.id===id);
      
   //Delete
   if(e.target.classList.contains("delete")){
    toDos = toDos.filter(t=> t.id !==id);
    saveToDos();
    renderToDos();
   }

   //Edit /Save'
  
   if(e.target.classList.contains("edit") ){
       
        console.log(todo.editing);
    if(todo.editing){
       
        const input = document.querySelector(`input[data-index-number="${id}"]`);
        todo.thingsToDo = input.value.trim();
        todo.editing = false;
    }else{
         toDos.forEach((e)=> e.editing = false); 
         todo.editing = todo.id === id
    }
    
    saveToDos();
    renderToDos();
   }
  
  });
console.log(tableBody);
//Event Listener for the active and completed checkboxes in the table
tableBody.addEventListener('change', function(e){
   
     console.log("change fired");
  if(e.target.classList.contains("active-box")){
    const id = Number(e.target.id.replace("active-box", ""));
    const task = toDos.find(t=> t.id ===id);
    console.log("Active-Working");
    task.active = e.target.checked;

    if(task.active){
       
        task.completed =false;
        
    }
    
    saveToDos();
    renderToDos();
    
  }


  if(e.target.classList.contains("completed-box")){

    const id = Number(e.target.id.replace("completed-box", ""));

    const task = toDos.find(t=> t.id===id);
    console.log("Completed-Working");
    task.completed = e.target.checked;
    if(task.completed){
         
        task.active= false;
       
    }
    saveToDos();
    renderToDos();
   
  }
})



renderToDos();


//Event listener for the filter to dos input box
document.querySelector("#filter-input").addEventListener('input', function(e){
    filters.searchText = e.target.value;
     renderToDos();

   
})

//Event Listener for the add to do form
document.querySelector('#toDos-form').addEventListener('submit', function (e){
    e.preventDefault();
    ++id1;
    console.log(e.target.elements.newToDos.value);
    const isCheckedActive = document.getElementById("active").checked;
    const isCheckedCompleted = document.getElementById("completed").checked;
    addToDos(id1, e.target.elements.newToDos.value, isCheckedActive, isCheckedCompleted, false);
    
    document.getElementById("active").checked = false;
    document.getElementById("completed").checked = false;

   saveToDos();
   renderToDos();
    e.target.elements.newToDos.value = '';
})

//Event Listener for the Hide-Completed checkbox
document.querySelector("#hide-completed").addEventListener('change', function(e){
    hide_completed = e.target.checked;

    renderToDos();
})

//Event Listener for the Hide-inactive checkbox
document.querySelector("#hide-inactive").addEventListener('change', function(e){
    hide_inactive = e.target.checked;
     renderToDos();
})