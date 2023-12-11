const api = "https://6576f6d2197926adf62ce184.mockapi.io/todo-list"

const list = document.querySelector("#list")
const newTaskText = document.querySelector("#newTaskText")
const postNewTaskBlock = document.querySelector("#postNewTaskBlock")

const modalBg = document.querySelector(".modalBg")
const editTextModalWindow = document.querySelector(".editTextModalWindow")
const editText = document.querySelector("#editText")

const signOutBtn = document.querySelector(".signOutBtn")

const userId = localStorage.getItem("id")

// Get the tasks from a server
const getTasks = async () => {
    try {
        const response = await fetch(`${api}/users/${userId}/tasks-list`)
        const tasksList = await response.json()

        // Client side error handler
        if (response.status >= 400 && response.status <= 450) {
            return console.log("Error!!!")
        }
        if (tasksList) {
            return tasksList
        }
    } catch (e) {
        return console.log("Error!!!")
    }
}

const elementsCreate = (task) => {

    // Create the main block for all elements
    const taskBlock = document.createElement("div")
    taskBlock.className = "task"

    // Block for the checkbox and p tags
    const taskTextBlock = document.createElement("div")
    taskTextBlock.className = "taskTextBlock"

    // Text
    const text = document.createElement("p")
    text.className = "taskText"
    text.innerHTML = task.text

    // Create checkbox and call function
    const checkbox = document.createElement("input")
    checkbox.setAttribute("type", "checkbox")
    checkbox.className = "taskCheck"
    checkbox.checked = task.checked
    checkbox.onclick = async (e) => {
        await taskCheck(task.id, e.target.checked)
    }

    // Delete button
    const deleteBtn = document.createElement("button")
    deleteBtn.className = "taskDeleteBtn"
    deleteBtn.onclick = async () => {
        await taskDelete(task.id)
        await taskBlock.remove()
    }

    // Delete btn icon
    const trashCan = document.createElement("img")
    trashCan.setAttribute("src", "images/icons/trashCan.svg")
    deleteBtn.append(trashCan)


    // Edit button. The input turns red and won't be submitted if it is empty
    text.onclick = async () => {
        editTextModalWindow.classList.remove("hideModal")
        modalBg.classList.remove("hideModalBg")
        editTextModalWindow.onsubmit = async (e) => {
            e.preventDefault()
            const editedTask = await taskEdit(task.id, editText.value)
            text.innerHTML = editedTask.text
            editText.value = ""
            editTextModalWindow.classList.add("hideModal")
            modalBg.classList.add("hideModalBg")
        }
    }


    // Appending the elements into the corresponding blocks
    taskTextBlock.append(text, checkbox)
    taskBlock.append(taskTextBlock, deleteBtn)
    list.insertBefore(taskBlock, list.firstChild)
}

// Show the tasks
const tasksListShow = async () => {
    const tasksList = await getTasks()
    if (tasksList) {
        tasksList.forEach(task => {
            elementsCreate(task)
        })
    }
}

tasksListShow()

// Delete task function
const taskDelete = async (taskId) => {
    try {
        await fetch(`${api}/users/${userId}/tasks-list/${taskId}`, {method: "DELETE"})
    } catch (e) {
        console.log(e)
    }

}

// Check task function
const taskCheck = async (taskId, checked) => {
    try {
        await fetch(`${api}/users/${userId}/tasks-list/${taskId}`, {
            method: "PUT",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({checked})
        })
    } catch (e) {
        console.log(e)
    }

}

// Edit task function
const taskEdit = async (taskId, text) => {
    try {
        const response = await fetch(`${api}/users/${userId}/tasks-list/${taskId}`, {
            method: "PUT",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({text})
        })
        return await response.json()
    } catch (e) {
        console.log(e)
    }
}

// New task function
const newTaskSubmit = async (text) => {
    try {
        const response = await fetch(`${api}/users/${userId}/tasks-list/`, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({text, checked: false})
        })
        elementsCreate(await response.json())
    } catch (e) {
        console.log(e)
    }
}

// Post a new task
postNewTaskBlock.onsubmit = async (e) => {
    e.preventDefault()
    await newTaskSubmit(newTaskText.value)
    newTaskText.value = ""
}
// Sign out
signOutBtn.onclick = () => {
    localStorage.removeItem("id");
    window.location.replace("index.html")
}


// Hide modal window
modalBg.onclick = () => {
    editText.value = ""
    editTextModalWindow.classList.add("hideModal")
    modalBg.classList.add("hideModalBg")
}

const allBtn = document.querySelector(".allBtn")
const checkedBtn = document.querySelector(".checkedBtn")
const uncheckedBtn = document.querySelector(".uncheckedBtn")

// Checked filter
const tasksFilter = async (checked) => {
    try {
        const response = await fetch(`${api}/users/${userId}/tasks-list?checked=${checked}`)
        return await response.json()
    } catch (e) {
        console.log(e)
    }
}

// Show all tasks
allBtn.onclick = async () => {
    const filteredTasks = await tasksFilter("")
    list.innerHTML = await null
    await filteredTasks.forEach(task => elementsCreate(task))
}

// Show checked tasks
checkedBtn.onclick = async () => {
    const filteredTasks = await tasksFilter("true")
    list.innerHTML = await null
    await filteredTasks.forEach(task => elementsCreate(task))
}

// Show unchecked tasks
uncheckedBtn.onclick = async () => {
    const filteredTasks = await tasksFilter("false")
    list.innerHTML = await null
    await filteredTasks.forEach(task => elementsCreate(task))
}