const ADD_BUTTON = document.querySelector("#add");
const LIST = document.querySelector("#list");
const LIST_ITEM = document.querySelector("#list-item-tmp");
const SELECT_ALL_BUTTON = document.querySelector("#select-all");
const ITEMS_COUNT_VIEW = document.querySelector("#items-count");
const CLEAR_BUTTON = document.querySelector("#clear");
const FILTER_LINK = document.querySelectorAll("#filter > li a");

//Берёт параметр фильтра из url
function getFilterParam(){
    return window.location.href.substring(window.location.href.lastIndexOf('#/') + 2);
}

//Устанавливает состояние ссылок фильтра
function setFilterLinkState(filterParam){
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

//Возвращает список отфильтрованных записей
function itemsFilter(filterParam, items){
    if (filterParam === "active"){
        return items.filter(item => item.completed === false);
    } else if (filterParam === "completed"){ 
        return items.filter(item => item.completed === true);
    } else {
        return items
    }
}

//Возвращает значение элементов списка из localstorage
function getItems(){
    return JSON.parse(localStorage.getItem("itemList") || "[]");
}
//Сохраняет элементы списка в localstorage
function setItems(items){
    const itemsJson = JSON.stringify(items);
    localStorage.setItem("itemList", itemsJson)
}

//Добавляет новые элементы в список по нажатию enter или при выходе из фокуса
function addItem (e){
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

//Изменяет по ключу значения в список по нажатию enter или при выходе из фокуса
function updateItem(e, item, key, value) {
    if ((e.keyCode === 13 || e.keyCode === undefined) && e.target.value.length > 0) {
        item[key] = value; 
        setItems(items);
        refreshData();
    }
}

//Удаляет все данные из списка
function deleteAllItems(){
    items = [];
    setItems(items);
    refreshData();
} 

//Обновляет все параметры приложения
function refreshData () {
    //Убираем содержимое представления
    LIST.innerHTML = "";
    //Обнуляем число оставшихся заданий
    itemsCount = 0;
    //Получаем параметр фильтра
    const filterParam = getFilterParam()
    //Фильтруем список
    const itemsFiltered = itemsFilter(filterParam, items);
    //Устанавливаем состояние фильтра для ссылок
    setFilterLinkState(filterParam)
    
    //Перебираем все элементы списка
    for (const item of itemsFiltered){
        const itemElement = LIST_ITEM.content.cloneNode(true);
        const taskInput = itemElement.querySelector(".toDoApp__label");
        const completedInput = itemElement.querySelector(".toDoApp__select");
        const editInput = itemElement.querySelector(".toDoApp__edit-input");
        const itemDelete = itemElement.querySelector(".toDoApp__delete");
        //Устанавливаем значения в представление
        editInput.value = item.task;
        taskInput.innerHTML = item.task;
        taskInput.setAttribute("data-id", item.id);
        completedInput.checked = item.completed;

        //Увеличиваем счётчик не выполненных задач на один
        if (completedInput.checked) itemsCount += 1 

        //Вешаем обработчик для удалений элемента списка
        itemDelete.addEventListener("click", ()=>{
            items = items.filter(el => item.id != el.id);
            setItems(items);
            refreshData();
        })

        //Вешаем обработчик для редактирования текста, через двойной клик
        taskInput.addEventListener("dblclick", ()=>{
            editInput.style.display = "block";
            editInput.focus();
            editInput.addEventListener("blur", e =>{
                updateItem(e, item, "task", editInput.value);
            });
            editInput.addEventListener("keyup",updateItem);
        })

        //Вешаем обработчик для редактирования состояния таска
        completedInput.addEventListener("change", e =>{
            if (completedInput.checked){
                itemsCount += 1
            } else {
                itemsCount -= 1
            }
            updateItem(e, item, "completed", completedInput.checked)
        })
        
        //Добавляем новый элемент в представление
        LIST.append(itemElement);
    }
    //Обновляем информацию о кол-ве оставшихся тасках
    ITEMS_COUNT_VIEW.innerHTML = `${itemsCount} item left`
}

//Устанавливает значение checked для кнопки, которая меняет состояние checked всем элементам списка
function selectAllButtonSetState(){
    const SELECT_ALL_BUTTONState = JSON.parse(localStorage.getItem("selectAllButtonState")) || false;
    SELECT_ALL_BUTTON.checked = SELECT_ALL_BUTTONState;
}

//Меняем значение checked конкретного таска 
SELECT_ALL_BUTTON.addEventListener("change", e =>{
    for (const item of items){
        updateItem(e , item, "completed", e.target.checked)
        localStorage.setItem("selectAllButtonState", e.target.checked)
    }
})

//Отслеживаем изменение ссылки, нужно для фильтра
window.onhashchange = refreshData;

//Берём список элементов из localstorage
let items = getItems();
//Устанавливаем переменную для хранения числа не выполненных тасков
let itemsCount = 0;
//Устанавливаем значение checked для кнопки, которая меняет состояние checked всем элементам списка
selectAllButtonSetState();
//Первично устанавливаем все значения
refreshData();
//Устанавливаем обработчик для кнопки добавления записей
ADD_BUTTON.addEventListener("blur",addItem);
ADD_BUTTON.addEventListener("keyup",addItem);
//Устанавливаем обработчик для кнопки, которая удаляет все записи
CLEAR_BUTTON.addEventListener("click", deleteAllItems)
