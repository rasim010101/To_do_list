if (localStorage.getItem("id")) {
    window.location.replace("listPage.html")
}

const api = "https://6576f6d2197926adf62ce184.mockapi.io/todo-list"

const signInForm = document.querySelector(".signInForm")
const signInUsername = document.querySelector(".signInUsername")
const signInPassword = document.querySelector(".signInPassword")
const signInInvalidMessage = document.querySelector(".signInInvalidMessage")

// Sign in
const getUsersForSignIn = async () => {
    try {
        const response = await fetch(`${api}/users`)
        const usersList = await response.json()
        return usersList.find(user => user.username === signInUsername.value && user.password === signInPassword.value)
    } catch (e) {
        console.log(e)
    }
}

// Submit the signIn form

signInForm.onsubmit = async (e) => {
    e.preventDefault()
    const user = await getUsersForSignIn()
    if (user) {
        localStorage.setItem("id", user.id)
        window.location.replace("listPage.html")
    } else {
        signInInvalidMessage.innerHTML = "Invalid login or password"
    }
}