//Danny Chung || chungdan@oregonstate.edu || CS340
//Hailee Hibray || hibrayh@oregonstate.edu || CS340


//STUNTPERSON AND ACTOR PAIR FUNCTIONS ----------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------

//Delete Stuntperson and Actor Pair

//Function called from 'Remove Pairing' button from stuntperson_actor_management.
function ASpairDelete(actorFirstName, actorLastName, stuntpersonFirstName, stuntpersonLastName) {
    var request = new XMLHttpRequest();
    var reqInfo = {};
    reqInfo.actorFirstName = actorFirstName;
    reqInfo.actorLastName = actorLastName;
    reqInfo.stuntpersonFirstName = stuntpersonFirstName;
    reqInfo.stuntpersonLastName = stuntpersonLastName;

    //Send request to /delete-stuntperson-actor-pair.
    request.open("POST", "/delete-stuntperson-actor-pair", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
        if (request.status >= 200 && request.status < 400) {
            console.log("succ");
            window.location.reload();
            //Pairing removed.
        }
        else {
            console.log("err");
        }
    })
    request.send(JSON.stringify(reqInfo));
}


//Add stuntperson actor pair

//Assign constants to appropriate elements.
const SAPairActor = document.getElementById("actor_names");
const SAPairStuntperson = document.getElementById("stuntperson_names");
const addSAPairButton = document.getElementById("add_actor_stuntperson_pairing");

//Event listener to addSAPairButton
addSAPairButton.addEventListener("click", function (event) {
    event.preventDefault();

    //Set up request with pairing values.
    var request = new XMLHttpRequest();
    var reqInfo = {};
    reqInfo.actorID = SAPairActor.value || null;
    reqInfo.stuntpersonID = SAPairStuntperson.value || null;

    //Send request to /insert-actor-stuntperson-pair.
    request.open("POST", "/insert-actor-stuntperson-pair", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
        if (request.status >= 200 && request.status < 400) {
            alert("Successfully Added!")
            window.location.reload();
            //Pairing added to database.
        }
        else {
            alert(request.statusText + "| An actor may only be paired with one stuntperson. A stuntperson may only be paired with one actor.");
        }
    });
    request.send(JSON.stringify(reqInfo));

});
