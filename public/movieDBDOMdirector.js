//Danny Chung || chungdan@oregonstate.edu || CS340
//Hailee Hibray || hibrayh@oregonstate.edu || CS340


//DIRECTOR FUNCTIONS ----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------

//Delete Director

//Function called from Delete button from view_directors. 'value' assigned from button based on directorID.
function deleteDirector(value) {
    var request = new XMLHttpRequest();
    var reqInfo = {};
    reqInfo.id = value;

    //Send request to /delete-director with 'value' in reqInfo.
    request.open("POST", "/delete-director", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
        if (request.status >= 200 && request.status < 400) {
            console.log("succ");
            window.location.reload();
            //Director deleted based on actorID.            
        }
        else {
            console.log("err");
        }
    })
    request.send(JSON.stringify(reqInfo));
}


//Add Director

//Assign constants to appropriate elements.
const directorFirstName = document.getElementById("directorFirstName");
const directorLastName = document.getElementById("directorLastName");
const directorSalary = document.getElementById("directorSalary");
const addDirectorButton = document.getElementById("addDirector");
const director_display = document.getElementById("director_display");

//Event listener to addDirectorButton.
addDirectorButton.addEventListener("click", function (event) {
    event.preventDefault();

    //Constraints to fill in all fields.
    if (directorFirstName.value == "" || directorLastName.value == "" || directorSalary.value == "") {
        alert("All fields are required, please fill in all fields.")
        return;
    }

    if (directorSalary.value < 0) {
        alert("Director's salary can't be below 0!");
        return;
    }

    if (directorSalary.value > 200000) {
        alert("Director's salary can't be above 200,000!");
        return;
    }

    //Set up request with director's first name, last name, and salary.
    var request = new XMLHttpRequest();
    var reqInfo = {};
    reqInfo.directorFirstName = directorFirstName.value || null;
    reqInfo.directorLastName = directorLastName.value || null;
    reqInfo.directorSalary = directorSalary.value || null;

    //Send request to //insert-director.
    request.open("POST", "/insert-director", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
        if (request.status >= 200 && request.status < 400) {
            alert("Successfully Added!");
            directorFirstName.value = "";
            directorLastName.value = "";
            directorSalary.value = "";
            //Director added to database.
        }
        else {
            director_display.textContent = "Error, try again." + request.statusText;
        }
    });
    request.send(JSON.stringify(reqInfo));

})

//Update Director

////Function called from popup after clicking Edit button in view_directors.
////Removes the added update button which gets added from when function openEdit was clicked.
////Closes popup div for edit/update.
function closeEdit() {
    const popupEditDirector = document.getElementById("popupEditDirector");
    const editField = document.getElementById("edit_director_field");
    popupEditDirector.style.display = "none";
    editField.removeChild(editField.lastChild);
}

////Function called from Edit button from view_directors. 'value' assigned from button based on directorID.
function openEdit(value, fname, lname, salary) {

    document.getElementById("directorFirstNameEditInput").value = fname;
    document.getElementById("directorLastNameEditInput").value = lname;
    document.getElementById("directorSalaryEditInput").value = salary;

    //Shows and adds update button to the popup div menu.
    const popupEditDirector = document.getElementById("popupEditDirector");
    popupEditDirector.style.display = "block";
    const editField = document.getElementById("edit_director_field");
    var updateButton = document.createElement("button");
    updateButton.value
    updateButton.textContent = "Update Director " + value;
    editField.appendChild(updateButton);

    //Add functionality to the update button.
    updateButton.addEventListener("click", function (event) {

        const directorFirstNameEditInput = document.getElementById("directorFirstNameEditInput");
        const directorLastNameEditInput = document.getElementById("directorLastNameEditInput");
        const directorSalaryEditInput = document.getElementById("directorSalaryEditInput");

        event.preventDefault();

        //Constraints to fill in all fields.
        if (directorFirstNameEditInput.value == "" || directorLastNameEditInput.value == "" || directorSalaryEditInput.value == "") {
            alert("All fields are required, please fill in all fields.")
            return;
        }

        if (directorSalaryEditInput.value < 0) {
            alert("Director's salary can't be below 0!");
            return;
        }

        if (directorSalaryEditInput.value > 200000) {
            alert("Director's salary can't be above 200,000!");
            return;
        }

        var request = new XMLHttpRequest();
        var reqInfo = {};

        //Set up request with director's new first name, last name, salary.
        reqInfo.directorID = value;
        reqInfo.directorFirstNameEdit = directorFirstNameEditInput.value || null;
        reqInfo.directorLastNameEdit = directorLastNameEditInput.value || null;
        reqInfo.directorSalaryEdit = directorSalaryEditInput.value || null;

        //Send request to /update-director.
        request.open("POST", "/update-director", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.addEventListener("load", function () {
            if (request.status >= 200 && request.status < 400) {
                alert("Successfully Updated!")
                window.location.reload();
            }
            else {
                alert("Error, try again." + request.statusText);
            }
        });
        request.send(JSON.stringify(reqInfo));
    })

}
