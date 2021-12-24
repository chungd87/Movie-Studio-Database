//Danny Chung || chungdan@oregonstate.edu || CS340
//Hailee Hibray || hibrayh@oregonstate.edu || CS340

var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 61231);

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('index');
});

//DIRECTOR FUNCTIONS ----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------

app.get('/director', function (req, res) {
    res.render('director');
});


app.get('/view_directors', function (req, res) {
    context = {};

    //If query is not a search query, selects all directors.
    //If query is a search query, selects based on req.query.name.
    var query = "SELECT * FROM directors;";
    if (req.query.name != undefined) {
        query = `SELECT * FROM directors WHERE CONCAT(directorFirstName, ' ', directorLastName) LIKE '%${req.query.name}%'`
    }
    mysql.pool.query(query, (error, rows, fields) => {
        context.results = rows;
        console.log(context.results);
        return res.render('view_directors', context);
    })
})


app.get('/view_director_movies', function (req, res) {
    // Declare Query 1
    let query1;
    let query2;

    var context = {};

    query1 = `SELECT movieID, movieName, movieBudget FROM movies WHERE director_id = ${req.query.directorID}`;
    console.log(query1);

    query2 = `SELECT actorID, actorFirstName, actorLastName, actorSalary FROM actors WHERE director_id = ${req.query.directorID}`;
    console.log(query2);

    query3 = `SELECT directorFirstName, directorLastName FROM directors WHERE directorID = ${req.query.directorID}`;

    // Run the 1st query
    mysql.pool.query(query1, function (err, rows, fields) {

        if (err) {
            next(err);
            return;
        }
        context.movies = rows;
        console.log(context.movies);

        mysql.pool.query(query2, function (err, rows, fields) {

            if (err) {
                next(err);
                return;
            }
            context.actors = rows;

            mysql.pool.query(query3, function (err, rows, fields) {
                if (err) {
                    next(err);
                    return;
                }
                context.director = rows;
                res.render('view_director_movies', context);
                console.log(context);
            })
        })
    })
});


app.post('/search-directors', function (req, res) {
    var context = {};
    //Search "'directorFirstName' 'directorLastName'"" based on req.body.name.
    mysql.pool.query("SELECT * FROM directors WHERE CONCAT(directorFirstName, ' ', directorLastName) LIKE '%s%'", [req.body.name], function (err, rows) {
        if (err) {
            next(err);
            return;
        }
        context.results = rows;
        console.log(context.results);
        res.render('view_directors', context);
        console.log(req.body.name);
    })
});


app.post('/delete-director', function (req, res, next) {
    //Delete based on directorID from req.body.id.
    mysql.pool.query('DELETE FROM directors WHERE directorID = ?', [req.body.id], function (err, result) {
        if (err) {
            next(err);
            return
        }
        res.send();
    })
})

app.post('/insert-director', function (req, res, next) {
    //Insert into directors from req.body.
    mysql.pool.query('INSERT INTO directors (directorFirstName, directorLastName, directorSalary) VALUES (?, ?, ?)',
        [req.body.directorFirstName, req.body.directorLastName, req.body.directorSalary], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            res.send();
        })
})

app.post('/update-director', function (req, res, next) {
    //Update directors based on req.body.
    mysql.pool.query("UPDATE directors SET directorFirstName=?, directorLastName=?, directorSalary=? WHERE directorID = ?",
        [req.body.directorFirstNameEdit, req.body.directorLastNameEdit, req.body.directorSalaryEdit, req.body.directorID], function (err, result) {
            if (err) {
                next(err);
                return
            }
            res.send();
        })
})

//END OF DIRECTOR FUNCTIONS ----------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------

//ACTOR FUNCTIONS ----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------

app.get('/actor', function (req, res) {
    //Populate drop-down box listing directors which can be tied to actors.
    context = {};
    var query = "SELECT directorID, CONCAT(directorFirstName, ' ', directorLastName) AS director_name FROM directors";

    mysql.pool.query(query, (error, rows, fields) => {
        context.results = rows;
        console.log(context.results);
        return res.render('actor', context);
    })
});

app.post('/delete-actor', function (req, res, next) {
    //Delete from actors based on actorID from req.body.id.
    mysql.pool.query('DELETE FROM actors WHERE actorID = ?', [req.body.id], function (err, result) {
        if (err) {
            next(err);
            return
        }
        res.send();
    })
})

app.get('/view_actors', function (req, res) {
    //If query is not a search query, selects all actors.
    //If query is a search query, selects based on req.query.name.
    context = {};
    var query = "SELECT * FROM actors LEFT JOIN directors ON actors.director_id = directors.directorID;";
    if (req.query.name != undefined) {
        query = `SELECT * FROM actors LEFT JOIN directors ON actors.director_id = directors.directorID WHERE CONCAT(actorFirstName, ' ', actorLastName) LIKE '%${req.query.name}%'`
    }

    mysql.pool.query(query, (error, rows, fields) => {
        if (error) {
            next(error);
            return;
        }
        context.results = rows;
        console.log(context.results);
        var query2 = "SELECT directorID, CONCAT(directorFirstName, ' ', directorLastName) AS director_name FROM directors";

        mysql.pool.query(query2, function (err, rows, fields) {
            if (err) {
                next(err);
                return;
            }

            context.resultsDirectors = rows;
            res.render('view_actors', context);

        })
    })
});

app.get('/view_actor_movies', function (req, res) {
    // Declare Query 1
    let query1;

    var context = {};
    //Selection for populating table for view_actor_movies.
    query1 = `SELECT movies.movieID, movies.movieName, movies.movieBudget FROM movies
    JOIN actor_movie_pairs ON movies.movieID = actor_movie_pairs.movieID
    JOIN actors ON actor_movie_pairs.actorID = actors.actorID AND actors.actorID = ${req.query.actorID};`
    console.log(query1);

    // Run the 1st query
    mysql.pool.query(query1, function (err, rows, fields) {

        if (err) {
            next(err);
            return;
        }
        context.movies = rows;

        mysql.pool.query(`SELECT actorFirstName, actorLastName from actors WHERE actorID = ${req.query.actorID}`, function (err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            context.actor = rows;
            console.log(context);
            res.render('view_actor_movies', context);
        })
    })
});

app.post('/insert-actor', function (req, res, next) {
    //Insert into actors from req.body.

    mysql.pool.query('INSERT INTO actors (actorFirstName, actorLastName, actorSalary, director_ID) VALUES (?, ?, ?, ?)',
        [req.body.actorFirstName, req.body.actorLastName, req.body.actorSalary, req.body.directorID], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            res.send();

            mysql.pool.query('INSERT INTO actor_movie_pairs (actorID, movieID) VALUES ((SELECT actorID FROM actors WHERE actorFirstName = ? AND actorLastName = ?), NULL)',
                [req.body.actorFirstName, req.body.actorLastName], function (err, result) {
                    if (err) {
                        next(err);
                        return;
                    }
                    res.send();
                })
        })
});

app.post('/update-actor', function (req, res, next) {
    //Update actors based on req.body.
    mysql.pool.query("UPDATE actors SET actorFirstName=?, actorLastName=?, actorSalary=?, director_ID=? WHERE actorID = ?",
        [req.body.actorFirstNameEdit, req.body.actorLastNameEdit, req.body.actorSalaryEdit, req.body.directorValueEdit, req.body.actorID], function (err, result) {
            if (err) {
                next(err);
                return
            }
            res.send();
        })
})

//END OF ACTOR FUNCTIONS ----------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------

//MOVIE FUNCTIONS ----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------

app.get('/movie', function (req, res) {
    //Populate drop-down box listing directors which can be tied to movies.
    context = {};
    var query = "SELECT directorID, CONCAT(directorFirstName, ' ', directorLastName) AS director_name FROM directors";

    mysql.pool.query(query, (error, rows, fields) => {
        context.results = rows;
        console.log(context.results);
        return res.render('movie', context);
    })
});


app.post('/insert-movie', function (req, res, next) {
    //Insert into movies based on req.query.
    mysql.pool.query('INSERT INTO movies (movieName, movieBudget, director_ID) VALUES (?, ?, ?)',
        [req.body.movieName, req.body.movieBudget, req.body.directorID], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            res.send();

            mysql.pool.query('INSERT INTO actor_movie_pairs (actorID, movieID) VALUES (NULL, (SELECT movieID from movies WHERE movieName = ?))',
                [req.body.movieName], function (err, result) {
                    if (err) {
                        next(err);
                        return;
                    }
                    res.send();
                })
        })
});


app.get('/view_movies', function (req, res) {
    //If query is not a search query, selects all movies.
    //If query is a search query, selects based on req.query.name.
    context = {};
    var query = "SELECT * FROM movies JOIN directors ON movies.director_id = directors.directorID;";
    if (req.query.name != undefined) {
        query = `SELECT * FROM movies WHERE movieName LIKE '%${req.query.name}%'`
    }
    mysql.pool.query(query, (error, rows, fields) => {
        context.results = rows;
        console.log(context.results);

        var query2 = "SELECT directorID, CONCAT(directorFirstName, ' ', directorLastName) AS director_name FROM directors";

        mysql.pool.query(query2, function (err, rows, fields) {
            if (err) {
                next(err);
                return;
            }

            context.resultsDirectors = rows;
            console.log(context.resultsDirectors);

            //For displaying total movie budget allocated.
            var query3 = "SELECT SUM(movieBudget) allocated_budget FROM movies";

            mysql.pool.query(query3, function (err, rows, fields) {
                if (err) {
                    next(err);
                    return
                }
                context.budget = rows[0].allocated_budget;
                if (context.budget > 10000000) {
                    context.budget = "Please adjust budgeting accordingly. $" + context.budget;
                }

                if (context.budget < 10000000) {
                    context.budget = "$" + context.budget;
                }

                res.render('view_movies', context);
            })
        })
    })
});


app.get('/view_movie_info', function (req, res) {
    // Declare Query 1
    let query1;
    let query2;

    var context = {};

    //Query for populating table to show movie info, based on req.query.movieID.
    query1 = `SELECT actors.actorID, actors.actorFirstName, actors.actorLastName, actors.actorSalary FROM actors
        JOIN actor_movie_pairs ON actors.actorID = actor_movie_pairs.actorID
        JOIN movies ON actor_movie_pairs.movieID = movies.movieID AND movies.movieID = ${req.query.movieID}`;

    console.log(query1);

    // Run the 1st query
    mysql.pool.query(query1, function (err, rows, fields) {

        if (err) {
            next(err);
            return;
        }
        context.actors = rows;
        console.log(context.actors);

        //Query for movie's title based on req.query.movieID.
        mysql.pool.query(`SELECT movieName FROM movies WHERE movieID = ${req.query.movieID}`, function (err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            context.movie = rows;

            //Query to select specific movie's budget based on req.query.movieID.
            mysql.pool.query(`SELECT movieBudget from movies WHERE movieID = ${req.query.movieID}`, function (err, rows, fields) {
                if (err) {
                    next(err);
                    return;
                }
                context.totalBudget = rows;

                //Query to select specific director's salary based on req.query.movieID.
                mysql.pool.query(`SELECT directorSalary FROM movies
                JOIN directors ON directors.directorID = movies.director_id
                WHERE movies.movieID = ${req.query.movieID}`, function (err, rows, fields) {
                    if (err) {
                        next(err);
                        return;
                    }
                    context.directorBudget = rows;

                    //Query to select sum of all actors salaries involved in specific movie based on req.query.movieID.
                    mysql.pool.query(`SELECT SUM(actorSalary) actorSalary FROM movies
                    JOIN actor_movie_pairs ON actor_movie_pairs.movieID = movies.movieID
                    JOIN actors ON actor_movie_pairs.actorID = actors.actorID
                    WHERE movies.movieID = ${req.query.movieID}`, function (err, rows, fields) {
                        if (err) {
                            next(err);
                            return;
                        }
                        context.actorBudget = rows;

                        //Query to select sum of all stuntpersons salaries involved in specific movie based on req.query.movieID.
                        mysql.pool.query(`SELECT SUM(stuntpersonSalary) stuntpersonSalary FROM movies
                        JOIN actor_movie_pairs ON actor_movie_pairs.movieID = movies.movieID
                        JOIN actors ON actor_movie_pairs.actorID = actors.actorID
                        JOIN stuntperson_actor_pairs ON stuntperson_actor_pairs.actorID = actors.actorID
                        JOIN stuntpersons ON stuntpersons.stuntpersonID = stuntperson_actor_pairs.stuntpersonID
                        WHERE movies.movieID = ${req.query.movieID}`, function (err, rows, fields) {
                            if (err) {
                                next(err);
                                return;
                            }
                            context.stuntpersonBudget = rows;
                            console.log(context);
                            var total = context.directorBudget[0].directorSalary + context.actorBudget[0].actorSalary + context.stuntpersonBudget[0].stuntpersonSalary;
                            if (total > context.totalBudget[0].movieBudget) {
                                total = total + ", which exceeds the movie's budget. Please adjust budgeting and salary accordingly.";
                            }
                            //Total of all director, actors, and stuntpersons salaries involved in movie.
                            context.total = total;
                            console.log(context.totalBudget[0].movieBudget);
                            res.render('view_movie_info', context);
                        })
                    })
                })

            })
        })

    })
});


app.post('/delete-movie', function (req, res, next) {
    //Delete from movies based on req.bodyid's movieID.
    mysql.pool.query('DELETE FROM movies WHERE movieID = ?', [req.body.id], function (err, result) {
        if (err) {
            next(err);
            return
        }
        res.send();
    })
});

app.post('/update-movie', function (req, res, next) {
    //Update movie based on req.body.
    mysql.pool.query("UPDATE movies SET movieName=?, movieBudget=?, director_ID=? WHERE movieID = ?",
        [req.body.movieNameEdit, req.body.movieBudgetEdit, req.body.directorValueEditMovie, req.body.movieID], function (err, result) {
            if (err) {
                next(err);
                return
            }
            res.send();
        })
})

//END OF MOVIE FUNCTIONS ----------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------

//STUNTPERSON FUNCTIONS ----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------

app.get('/stuntperson', function (req, res) {
    res.render('stuntperson');
});

app.post('/insert-stuntperson', function (req, res, next) {
    //Insert stuntperson based on req.body.
    mysql.pool.query('INSERT INTO stuntpersons (stuntpersonFirstName, stuntpersonLastName, stuntpersonSalary, stuntpersonAvailable) VALUES (?, ?, ?, ?)',
        [req.body.stuntpersonFirstName, req.body.stuntpersonLastName, req.body.stuntpersonSalary, req.body.stuntpersonAvailable], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            res.send();
        })
})

app.post('/update-stuntperson', function (req, res, next) {
    //Update stuntperson based on req.body.
    mysql.pool.query("UPDATE stuntpersons SET stuntpersonFirstName=?, stuntpersonLastName=?, stuntpersonSalary=?, stuntpersonAvailable=? WHERE stuntpersonID = ?",
        [req.body.stuntpersonFirstNameEdit, req.body.stuntpersonLastNameEdit, req.body.stuntpersonSalaryEdit, req.body.stuntpersonAvailableEdit, req.body.stuntpersonID], function (err, result) {
            if (err) {
                next(err);
                return
            }
            res.send();
        })
})

app.post('/delete-stuntperson', function (req, res, next) {
    //Remove stuntperson based on stuntpersonID from req.body.id.
    mysql.pool.query('DELETE FROM stuntpersons WHERE stuntpersonID = ?', [req.body.id], function (err, result) {
        if (err) {
            next(err);
            return
        }
        res.send();
    })
})

app.get('/view_stuntpersons', function (req, res) {
    //If query is not a search query, selects all stuntpersons.
    //If query is a search query, selects based on req.query.name.
    context = {};
    var query = "SELECT * FROM stuntpersons;";
    if (req.query.name != undefined) {
        query = `SELECT * FROM stuntpersons WHERE CONCAT(stuntpersonFirstName, ' ', stuntpersonLastName) LIKE '%${req.query.name}%'`
    }
    mysql.pool.query(query, (error, rows, fields) => {
        context.results = rows;
        console.log(context.results);
        return res.render('view_stuntpersons', context);
    })
})


//END OF STUNTPERSON FUNCTIONS ----------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------

//MOVIE ACTOR MANAGEMENT FUNCTIONS ----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------

app.get('/add_movie_actor', function (req, res) {
    context = {};

    //Populate dropdown box for movies.
    var query1 = "SELECT movieID, movieName FROM movies";

    mysql.pool.query(query1, (error, rows, fields) => {
        context.movies = rows;
        console.log(context.movies);

        //Populate dropdown box for actors.
        var query2 = "SELECT actorID, CONCAT(actorFirstName, ' ', actorLastName) AS actorName FROM actors";

        mysql.pool.query(query2, function (err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            context.actors = rows;
            console.log(context.actors);

            return res.render('add_movie_actor', context);
        })
    })
});

app.post('/insert-movie-actor-pair', function (req, res, next) {
    //Insert movie and actor pairing into database, based on actorID, movieID.
    mysql.pool.query('INSERT INTO actor_movie_pairs (actorID, movieID) VALUES (?, ?)',
        [req.body.actorID, req.body.movieID], function (err, result) {
            if (err) {
                next(err);
                return;
            }

            //make sure to remove nulls
            mysql.pool.query("DELETE FROM actor_movie_pairs WHERE actorID = ? AND movieID IS NULL",
                [req.body.actorID], function (err, result) {
                    if (err) {
                        next(err);
                        return
                    }


                    mysql.pool.query("DELETE FROM actor_movie_pairs WHERE actorID IS NULL AND movieID = ?",
                        [req.body.movieID], function (err, result) {
                            if (err) {
                                next(err);
                                return
                            }
                            res.send();
                        })


                })
        })
});

app.get('/movie_actor_management', function (req, res) {
    //For displaying movie's and actor's names.

    let query1;

    // display all by default

    var context = {};
    query1 = `SELECT movies.movieID, movies.movieName, movies.movieBudget, actors.actorID, actors.actorFirstName, actors.actorLastName FROM actors
                JOIN actor_movie_pairs ON actors.actorID = actor_movie_pairs.actorID
                JOIN movies ON actor_movie_pairs.movieID = movies.movieID
                ORDER BY movies.movieID`;


    // else, display search results
    if (req.query.movieName != undefined && req.query.movieName != "") {
        query1 = `SELECT movies.movieID, movies.movieName, movies.movieBudget, actors.actorID, actors.actorFirstName, actors.actorLastName FROM actors
                    JOIN actor_movie_pairs ON actors.actorID = actor_movie_pairs.actorID
                    JOIN movies ON actor_movie_pairs.movieID = movies.movieID AND movies.movieID IN (SELECT movieID FROM movies WHERE movieName LIKE "%${req.query.movieName}%")
                    ORDER BY movies.movieID`;

    }

    console.log(query1);

    // Run the query
    mysql.pool.query(query1, function (err, rows, fields) {

        if (err) {
            next(err);
            return;
        }
        context.results = rows;

        console.log(context.results);
        res.render('movie_actor_management', context);

    })

});


app.post('/delete-movie-actor-pair', function (req, res, next) {
    //Delete actor-movie pairin based on req.body.
    mysql.pool.query("DELETE FROM actor_movie_pairs WHERE actorID = ? AND movieID = ?",
        [req.body.actorID, req.body.movieID], function (err, result) {
            if (err) {
                next(err);
                return
            }
            res.send();
        })
});

//END OF MOVIE ACTOR MANAGEMENT FUNCTIONS ----------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------

//STUNTPERSON ACTOR MANAGEMENT FUNCTIONS ----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------

app.get('/add_stuntperson_actor', function (req, res) {
    context = {};

    //Populate dropdown box for stuntpersons.
    var query = "SELECT stuntpersonID, CONCAT(stuntpersonFirstName, ' ', stuntpersonLastName) AS stuntperson_name FROM stuntpersons";

    mysql.pool.query(query, (error, rows, fields) => {
        context.stuntperson_names = rows;
        console.log(context.stuntperson_names);

        //Populate dropdown box for actors.
        var query2 = "SELECT actorID, CONCAT(actorFirstName, ' ', actorLastName) AS actor_name FROM actors";

        mysql.pool.query(query2, function (err, rows, fields) {
            if (err) {
                next(err);
                return;
            }
            context.actor_names = rows;
            console.log(context.actor_names);

            return res.render('add_stuntperson_actor', context);
        })
    })
});


app.post('/insert-actor-stuntperson-pair', function (req, res, next) {
    //Insert actor and stuntperson pairing into database, based on values actorID, stuntpersonID.
    mysql.pool.query('INSERT INTO stuntperson_actor_pairs (actorID, stuntpersonID) VALUES (?, ?)',
        [req.body.actorID, req.body.stuntpersonID], function (err, result) {
            if (err) {
                next(err);
                return;
            }
            res.send();
        })
});

app.get('/stuntperson_actor_management', function (req, res) {
    //For displaying actor's and stuntperson's names.
    context = {};
    var query = "SELECT actorFirstName,actorLastName, stuntpersonFirstName, stuntpersonLastName \
        FROM stuntperson_actor_pairs \
        JOIN actors ON stuntperson_actor_pairs.actorID = actors.actorID \
        JOIN stuntpersons ON stuntperson_actor_pairs.stuntpersonID = stuntpersons.stuntpersonID"

    mysql.pool.query(query, (error, rows, fields) => {
        context.results = rows;
        console.log(context.results);

        res.render('stuntperson_actor_management', context);
    })
});

app.post('/delete-stuntperson-actor-pair', function (req, res, next) {
    //Delete stuntperson and actor pairing based on req.body.
    mysql.pool.query("DELETE FROM stuntperson_actor_pairs WHERE stuntpersonID = \
    (SELECT stuntpersonID FROM stuntpersons WHERE stuntpersonFirstName = ? AND stuntpersonLastName = ?) \
    AND actorID = (SELECT actorID FROM actors WHERE actorFirstName = ? AND actorLastName = ?)", [req.body.stuntpersonFirstName, req.body.stuntpersonLastName,
    req.body.actorFirstName, req.body.actorLastName], function (err, result) {
        if (err) {
            next(err);
            return
        }
        res.send();
    })
});

//END OF STUNTPERSON ACTOR MANAGEMENT FUNCTIONS ----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------

app.listen(app.get('port'), function () {
    console.log('Express started on http://flip3.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl - C to terminate.');
});