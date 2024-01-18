const ADD_BUTTON = document.querySelector("#add");
const LIST = document.querySelector("#list");
const LIST_ITEM = document.querySelector("#list-item-tmp");
const SELECT_ALL_BUTTON = document.querySelector("#select-all");
const ITEMS_COUNT_VIEW = document.querySelector("#items-count");
const CLEAR_BUTTON = document.querySelector("#clear");
const FILTER_LINK = document.querySelectorAll("#filter > li a");


// Track the last key code; set to null if the event is a mouse click
// This is used to apply input when the input field loses focus due to a mouse click
let lastKeyCode; 
document.addEventListener("click", ()=>{
    lastKeyCode = null;
})

// Retrieve the filter parameter from the URL
const getFilterParam = () =>{
    return window.location.href.substring(window.location.href.lastIndexOf('#/') + 2);
}

// Set the state of filter links
const setFilterLinkState = (filterParam) => {
    for (const link of FILTER_LINK){
        if (link.getAttribute("data-type") == filterParam){
            link.classList.add("toDoApp__sort-link_select");
            continue;
        }else{
            link.classList.remove("toDoApp__sort-link_select");
        }
        if(!["active", "completed"].includes(filterParam) && link.getAttribute("data-type") == 'all'){
            link.classList.add("toDoApp__sort-link_select");
        }
    }
}

// Return a list of filtered items
const itemsFilter = (filterParam, items) => {
    if (filterParam === "active"){
        return items.filter(item => item.completed === false);
    } else if (filterParam === "completed"){ 
        return items.filter(item => item.completed === true);
    } else {
        return items
    }
}

// Retrieve the list of items from local storage
const getItems = () => {
    return JSON.parse(localStorage.getItem("itemList") || "[]");
}

// Save the list of items to local storage
const setItems = (items) => {
    const itemsJson = JSON.stringify(items);
    localStorage.setItem("itemList", itemsJson)
}

// Add new items to the list on Enter key press or when focus is lost
const addItem = (e) => {
    if ((e.keyCode === 13 || e.keyCode === undefined) && e.target.value.trim().length > 0) {
        items.push({
            id: Math.random(),
            task: e.target.value.trim(),
            completed: false
        })
        e.target.value = "",
        setItems(items);
        refreshData();
    }
}

// Update item values in the list on Enter key press or when focus is lost
const updateItem = (e, item, key, value) => {
    if (e.keyCode === 13 || e.keyCode === undefined) {
        if (typeof value == "boolean"){
            item[key] = value;
            setItems(items);
            refreshData();
        }else{
            if (value.trim().length > 0){
                item[key] = value.trim(); 
                setItems(items);
                refreshData();
            } else {
                deleteItem(item.id) // delete the record if the string is empty
            }
        }
        
    } else if (e.keyCode === 27){
        refreshData();
    }
}


// Delete all data from the list
const deleteAllItems = () => {
    items = [];
    setItems(items);
    refreshData();
} 

// Delete an item from the list
const deleteItem = (id) => {
    items = items.filter(el => id != el.id);
    setItems(items);
    refreshData();
}

//Обновляет все параметры приложения
const refreshData = () => {
    // Clear the view content
    LIST.innerHTML = "";
    // Reset the number of remaining tasks
    itemsCount = 0;
    // Get the filter parameter
    const filterParam = getFilterParam()
    // Filter the list
    const itemsFiltered = itemsFilter(filterParam, items);
    // Set the filter state for links
    setFilterLinkState(filterParam)
    
    // Iterate through all list items
    for (const item of itemsFiltered){
        const itemElement = LIST_ITEM.content.cloneNode(true);
        const taskInput = itemElement.querySelector(".toDoApp__label");
        const completedInput = itemElement.querySelector(".toDoApp__select");
        const editInput = itemElement.querySelector(".toDoApp__edit-input");
        const itemDelete = itemElement.querySelector(".toDoApp__delete");
        // Set values in the view
        editInput.value = item.task;
        taskInput.innerHTML = item.task;
        taskInput.setAttribute("data-id", item.id);
        completedInput.checked = item.completed;

        // Increase the count of incomplete tasks by one
        if (completedInput.checked) itemsCount += 1 

        // Attach an event handler for deleting a list item
        itemDelete.addEventListener("click", () => deleteItem(item.id))

        // Attach an event handler for editing text via double-click
        taskInput.addEventListener("dblclick", ()=>{
            editInput.style.display = "block";
            editInput.focus();
            editInput.addEventListener("blur", e =>{
                console.log(lastKeyCode)
                if (lastKeyCode !== 27){
                    updateItem(e, item, "task", editInput.value);
                }
            });
            editInput.addEventListener("keyup", e =>{
                if(e.keyCode === 27 || e.keyCode === 13) {
                    lastKeyCode = e.keyCode
                    updateItem(e, item, "task", editInput.value);
                }
            });
           
        })


        // Attach an event handler for editing the task state
        completedInput.addEventListener("change", e =>{
            if (completedInput.checked){
                itemsCount += 1
            } else {
                itemsCount -= 1
            }
            updateItem(e, item, "completed", completedInput.checked)
        })
        
        // Add a new element to the view
        LIST.prepend(itemElement);
    }
    // Update information about the number of remaining tasks
    ITEMS_COUNT_VIEW.innerHTML = `${itemsCount} item left`
}

// Set the checked value for the button that changes the checked state for all list items
const selectAllButtonSetState = () => {
    const SELECT_ALL_BUTTONState = JSON.parse(localStorage.getItem("selectAllButtonState")) || false;
    SELECT_ALL_BUTTON.checked = SELECT_ALL_BUTTONState;
}

// Change the checked value of a specific task
SELECT_ALL_BUTTON.addEventListener("change", e =>{
    for (const item of items){
        updateItem(e , item, "completed", e.target.checked)
        localStorage.setItem("selectAllButtonState", e.target.checked)
    }
})

// Track changes in the link, necessary for filtering
window.onhashchange = refreshData;

// Get the list of items from local storage
let items = getItems();
// Set a variable to store the number of incomplete tasks
let itemsCount = 0;
// Set the checked value for the button that changes the checked state for all list items
selectAllButtonSetState();
// Initially set all values
refreshData();
// Set an event handler for the button that adds entries
ADD_BUTTON.addEventListener("blur",addItem);
ADD_BUTTON.addEventListener("keyup",addItem);
// Set an event handler for the button that deletes all entries
CLEAR_BUTTON.addEventListener("click", deleteAllItems)
