//Danny Chung || chungdan@oregonstate.edu || CS340
//Hailee Hibray || hibrayh@oregonstate.edu || CS340


//Delete Movie and Actor Pair

//Function called from 'Remove Pairing' button from movie_actor_management.
function MApairDelete(movieID, actorID) {

    var request = new XMLHttpRequest();
    var reqInfo = {};
    reqInfo.movieID = movieID;
    reqInfo.actorID = actorID

    //Send request to /delete-movie-actor-pair.
    request.open("POST", "/delete-movie-actor-pair", true);
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


//Add movie actor pair

//Assign constants to appropriate elements.
const MAPairMovie = document.getElementById("movieNames");
const MAPairActor = document.getElementById("actorNames");
const addMAPairButton = document.getElementById("add_movie_actor_pairing");

//Event listener to addMAPairButton
addMAPairButton.addEventListener("click", function (event) {
    event.preventDefault();

    //Set up request with pairing values.
    var request = new XMLHttpRequest();
    var reqInfo = {};

    reqInfo.movieID = MAPairMovie.value || null;
    reqInfo.actorID = MAPairActor.value || null;

    //Send request to /insert-movie-actor-pair.
    request.open("POST", "/insert-movie-actor-pair", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
        if (request.status >= 200 && request.status < 400) {
            alert("Successfully Added!")
            window.location.reload();
            //Pairing added to database.
        }
        else {
            alert(request.statusText + "| Please make sure that the actor and movie have not already been paired.");
        }
    });
    request.send(JSON.stringify(reqInfo));

});
