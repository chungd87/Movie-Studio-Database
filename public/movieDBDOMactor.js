//Danny Chung || chungdan@oregonstate.edu || CS340
//Hailee Hibray || hibrayh@oregonstate.edu || CS340


//ACTOR FUNCTIONS ----------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------

//Delete Actor

//Function called from Delete button from view_actors. 'value' assigned from button based on actorID.
function deleteActor(value) {
    var request = new XMLHttpRequest();
    var reqInfo = {};
    reqInfo.id = value;

    //Send request to /delete-actor with 'value' in reqInfo.
    request.open("POST", "/delete-actor", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
        if (request.status >= 200 && request.status < 400) {
            console.log("succ");
            window.location.reload();
            //Actor deleted based on actorID.
        }
        else {
            console.log("err");
        }
    })
    request.send(JSON.stringify(reqInfo));
}


//Add actor

//Assign constants to appropriate elements.
const actorFirstName = document.getElementById("actorFirstName");
const actorLastName = document.getElementById("actorLastName");
const actorSalary = document.getElementById("actorSalary");
const addactorButton = document.getElementById("addActor");

//Event listener to addactorButton.
addactorButton.addEventListener("click", function (event) {
    event.preventDefault();

    //Constraints to fill in all fields.
    if (actorFirstName.value == "" || actorLastName.value == "" || actorSalary.value == "") {
        alert("All fields are required, please fill in all fields.")
        return;
    }

    if (actorSalary.value < 0) {
        alert("Actor's salary can't be below 0!");
        return;
    }

    if (actorSalary.value > 100000) {
        alert("Actor's salary can't be above 100,000!");
        return;
    }

    //Set up request with actor's first name, last name, salary, and director.
    var request = new XMLHttpRequest();
    var reqInfo = {};
    reqInfo.actorFirstName = actorFirstName.value || null;
    reqInfo.actorLastName = actorLastName.value || null;
    reqInfo.actorSalary = actorSalary.value || null;

    const directorValue = document.getElementById("director_names");
    reqInfo.directorID = directorValue.value;


    if (directorValue.value == 0) // 0 is used to signify "No director" because it is not a valid director ID
    {
        alert("Because the actor does not have an assigned director, their salary has been set to 0");
        reqInfo.actorSalary = 0;
        reqInfo.directorID = null;

    }

    //Send request to /insert-actor.
    request.open("POST", "/insert-actor", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
        if (request.status >= 200 && request.status < 400) {
            alert("Successfully Added!")
            //Actor added to database.
            actorFirstName.value = "";
            actorLastName.value = "";
            actorSalary.value = "";
            window.location.reload();
        }
        else {
            alert(request.statusText);
        }
    });
    request.send(JSON.stringify(reqInfo));

})


//Update Actor

////Function called from popup after clicking Edit button in view_actors.
////Removes the added update button which gets added from when function openEditActor was clicked.
////Closes popup div for edit/update.
function closeEditActor() {
    const popupEditActor = document.getElementById("popupEditActor");
    const editFieldActor = document.getElementById("edit_Actor_field");
    popupEditActor.style.display = "none";
    editFieldActor.removeChild(editFieldActor.lastChild);
}

////Function called from Edit button from view_actors. 'value' assigned from button based on actorID.
function openEditActor(value, fname, lname, salary, directorID) {

    document.getElementById("actorFirstNameEditInput").value = fname;
    document.getElementById("actorLastNameEditInput").value = lname;
    document.getElementById("actorSalaryEditInput").value = salary;

    var dropdown = document.getElementById("director_names_edit").children;

    for (let option of dropdown) {
        if (option.value == directorID) {
            option.selected = "selected"
        }

        if (option.value != directorID) {
            option.selected = "";
        }
    }


    //Shows and adds update button to the popup div menu.
    const popupEditActor = document.getElementById("popupEditActor");
    popupEditActor.style.display = "block";
    const editFieldActor = document.getElementById("edit_actor_field");
    var updateButtonactor = document.createElement("button");
    updateButtonactor.value
    updateButtonactor.textContent = "Update Actor " + value;
    editFieldActor.appendChild(updateButtonactor);

    //Add functionality to the update button.
    updateButtonactor.addEventListener("click", function (event) {
        event.preventDefault();

        // Get the inputted values
        const actorFirstNameEditInput = document.getElementById("actorFirstNameEditInput");
        const actorLastNameEditInput = document.getElementById("actorLastNameEditInput");
        const actorSalaryEditInput = document.getElementById("actorSalaryEditInput");

        //Constraints to fill in all fields.
        if (actorFirstNameEditInput.value == "" || actorLastNameEditInput.value == "" || actorSalaryEditInput.value == "") {
            alert("All fields are required, please fill in all fields.")
            return;
        }

        if (actorSalaryEditInput.value < 0) {
            alert("Actor's salary can't be below 0!");
            return;
        }

        if (actorSalaryEditInput.value > 200000) {
            alert("Actor's salary can't be above 100,000!");
            return;
        }

        var request = new XMLHttpRequest();
        var reqInfo = {};

        //Set up request with actor's new first name, last name, salary, and director.
        reqInfo.actorID = value;
        reqInfo.actorFirstNameEdit = actorFirstNameEditInput.value || null;
        reqInfo.actorLastNameEdit = actorLastNameEditInput.value || null;
        reqInfo.actorSalaryEdit = actorSalaryEditInput.value || null;

        const directorValueEdit = document.getElementById("director_names_edit");
        reqInfo.directorValueEdit = directorValueEdit.value || null;


        if (directorValueEdit.value == 0) // 0 is used to signify "No director" because it is not a valid director ID
        {
            alert("Because the actor does not have an assigned director, their salary has been set to 0");
            reqInfo.actorSalaryEdit = 0;
            reqInfo.directorValueEdit = null;

        }

        //Send request to /update-actor.
        request.open("POST", "/update-actor", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.addEventListener("load", function () {
            if (request.status >= 200 && request.status < 400) {
                alert("Successfully Updated!")
                window.location.reload();
                //Actor updated in database.
            }
            else {
                alert("Error, try again." + request.statusText);
            }
        });
        request.send(JSON.stringify(reqInfo));
    })

}