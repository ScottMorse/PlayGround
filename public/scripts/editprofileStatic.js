const editForm = document.getElementById('edit-form')
const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

function submitEdit(e){
    let fullname,email,instrument,about,location
    [fullname,email,instrument,about,location] = Array.from(this.children).slice(0,5).map(child => child.firstElementChild.value)
    if(email){
        console.log(email)
        if(!email.match(emailRegex)){
            e.preventDefault()
            console.log('Invalid email')
        }
    }
}

editForm.addEventListener('submit',submitEdit)