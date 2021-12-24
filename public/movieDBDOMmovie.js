//Danny Chung || chungdan@oregonstate.edu || CS340
//Hailee Hibray || hibrayh@oregonstate.edu || CS340


//MOVIEFUNCTIONS ----------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------

//Delete Movie

//Function called from Delete button from view_movies. 'value' assigned from button based on movieID.
function deleteMovie(value) {
    var request = new XMLHttpRequest();
    var reqInfo = {};
    reqInfo.id = value;

    //Send request to /delete-movie with 'value' in reqInfo.
    request.open("POST", "/delete-movie", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
        if (request.status >= 200 && request.status < 400) {
            console.log("succ");
            window.location.reload();
            //Movie deleted based on movieID.
        }
        else {
            console.log("err");
        }
    })
    request.send(JSON.stringify(reqInfo));
}


//Add movie

//Assign constants to appropriate elements.
const movieName = document.getElementById("movieName");
const movieBudget = document.getElementById("movieBudget");
const addmovieButton = document.getElementById("addMovie");

//Event listener to addmovieButton.
addmovieButton.addEventListener("click", function (event) {
    event.preventDefault();

    //Constraints to fill in all fields.
    if (movieName.value == "" || movieBudget.value == "") {
        alert("All fields are required, please fill in all fields.")
        return;
    }

    if (movieBudget.value < 0) {
        alert("Movie's budget can't be below 0!");
        return;
    }

    if (movieBudget.value > 10000000) {
        alert("Movie's budget can't be above 10,000,000!");
        return;
    }

    //Set up request with movie's name, budget, and director.
    var request = new XMLHttpRequest();
    var reqInfo = {};
    reqInfo.movieName = movieName.value || null;
    reqInfo.movieBudget = movieBudget.value || null;

    const directorValueMovie = document.getElementById("director_names_movies");

    reqInfo.directorID = directorValueMovie.value || null;

    //Send request to //insert-movie.
    request.open("POST", "/insert-movie", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
        if (request.status >= 200 && request.status < 400) {
            alert("Successfully Added!");
            movieBudget.value = "";
            movieName.value = "";
            window.location.reload();
            //Movie added to database.
        }
        else {
            alert(request.statusText);
        }
    });
    request.send(JSON.stringify(reqInfo));

});

//Update Movie

////Function called from popup after clicking Edit button in view_movies.
////Removes the added update button which gets added from when function openEditMovie was clicked.
////Closes popup div for edit/update.
function closeEditMovie() {
    const popupEditMovie = document.getElementById("popupEditMovie");
    const editFieldMovie = document.getElementById("edit_movie_field");
    popupEditMovie.style.display = "none";
    editFieldMovie.removeChild(editFieldMovie.lastChild);
}

////Function called from Edit button from view_movies. 'value' assigned from button based on movieID.
function openEditMovie(value, movieName, movieBudget, directorID) {

    document.getElementById("movieNameEditInput").value = movieName;
    document.getElementById("movieBudgetEditInput").value = movieBudget;

    var dropdown = document.getElementById("director_names_edit_movie").children;

    for (let option of dropdown) {
        if (option.value == directorID) {
            option.selected = "selected"
        }

        if (option.value != directorID) {
            option.selected = "";
        }
    }

    //Shows and adds update button to the popup div menu.
    const popupEditMovie = document.getElementById("popupEditMovie");
    popupEditMovie.style.display = "block";
    const editFieldMovie = document.getElementById("edit_movie_field");
    var updateButtonmovie = document.createElement("button");
    updateButtonmovie.value
    updateButtonmovie.textContent = "Update Movie " + value;
    editFieldMovie.appendChild(updateButtonmovie);

    //Add functionality to the update button.
    updateButtonmovie.addEventListener("click", function (event) {

        const movieNameEditInput = document.getElementById("movieNameEditInput");
        const movieBudgetEditInput = document.getElementById("movieBudgetEditInput");

        event.preventDefault();

        //Constraints to fill in all fields.
        if (movieNameEditInput.value == "" || movieBudgetEditInput.value == "") {
            alert("All fields are required, please fill in all fields.")
            return;
        }

        if (movieBudgetEditInput.value < 0) {
            alert("Movie's Budget can't be below 0!");
            return;
        }

        if (movieBudgetEditInput.value > 10000000) {
            alert("Movie's salary can't be above 10,000,000!");
            return;
        }

        var request = new XMLHttpRequest();
        var reqInfo = {};

        //Set up request with movie's new name, budget, and director.
        reqInfo.movieID = value;
        reqInfo.movieNameEdit = movieNameEditInput.value || null;
        reqInfo.movieBudgetEdit = movieBudgetEditInput.value || null;

        const directorValueEditMovie = document.getElementById("director_names_edit_movie");

        reqInfo.directorValueEditMovie = directorValueEditMovie.value || null;

        //Send request to /update-movie.
        request.open("POST", "/update-movie", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.addEventListener("load", function () {
            if (request.status >= 200 && request.status < 400) {
                alert("Successfully Updated!")
                window.location.reload();
                //Movie updated in database.
            }
            else {
                alert("Error, try again." + request.statusText);
            }
        });
        request.send(JSON.stringify(reqInfo));
    })

}