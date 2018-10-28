const regForm = document.getElementById('reg-form')
const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
const userNameRegex = new RegExp(/^[A-Za-z]+[A-Za-z0-9]+/)

const badUserNames = [
    "admin", "support", "auth",
    "authorization","authorized",
    "authorizeduser","administration",
    "webmaster","website","authenticator",
    "authentication","contactus",
    "administrator","help","contact",
    "playground","root","password",
    "login","register","registration",
    "signup"
]

function submitReg(e){
    const username = this.children[0].value
    const email = this.children[1].value
    const confirmEmail = this.children[2].value
    const pswd = this.children[3].value
    const confirmPswd = this.children[4].value
    if(!username || !email || !confirmEmail || !pswd || !confirmPswd){
        e.preventDefault()
        console.warn('Missing form fields')
    }
    else if(username.length < 4){
        e.preventDefault()
        console.warn('Username too short.')
    }
    else if(username.length > 20){
        e.preventDefault()
        console.warn('Username too long')
    }
    else if(!username.match(userNameRegex)){
        e.preventDefault()
        console.warn('Invalid username')
    }
    else if(badUserNames.contains(username.toLowerCase())){
        e.preventDefault()
        console.warn('Bad username')
    }
    else if(!email.match(emailRegex)){
        e.preventDefault()
        console.warn('Invalid email')
    }
    else if(email != confirmEmail){
        e.preventDefault()
        console.warn("Emails don't match.")
    }
    else if(pswd.length < 6){
        e.preventDefault()
        console.warn("Password too short.")
    }
    else if(pswd != confirmPswd){
        e.preventDefault()
        console.warn("Passwords don't match")
    }
}
regForm.addEventListener('submit',submitReg)