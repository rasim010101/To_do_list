if (localStorage.getItem("id")) {
    window.location.replace("listPage.html")
}

const api = "https://6576f6d2197926adf62ce184.mockapi.io/todo-list"

const signUpForm = document.querySelector(".signUpForm")
const signUpUsername = document.querySelector(".signUpUsername")
const signUpPassword = document.querySelector(".signUpPassword")
const signUpConfirmPassword = document.querySelector(".signUpConfirmPassword")
const signUpUserExistsMessage = document.querySelector(".signUpUserExistsMessage")


// SignUp
const signUp = async (username, password) => {
    try {
        const response = await fetch(`${api}/users`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                username, password
            })
        })
        const user = await response.json()
        localStorage.setItem("id", user.id)
        window.location.replace("listPage.html")
    } catch (e) {
        console.log(e)
    }
}

// Submit the signup form
signUpForm.onsubmit = async (e) => {
    e.preventDefault()
    if (signUpPassword.value === signUpConfirmPassword.value) {
        await signUp(signUpUsername.value, signUpPassword.value)
    } else {
        signUpUserExistsMessage.innerHTML = "Passwords do not match!"
    }
}