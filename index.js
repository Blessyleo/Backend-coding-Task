const express = require('express');
const app = new express();

const logger = require('morgan'); 
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'));


var db = require('./config');


// GET /api/v1/longest-duration-movies
// This route returns as JSON the top 10 movies with the longest runTime
// The output should contain tconst, primaryTitle, runtimeMinutes & genres

app.get('/api/v1/longest-duration-movies', function (req, res) {
    db.query("select tconst, primaryTitle, runtimeMinutes , genres from movies order by runtimeMinutes DESC limit 10", function (err, result) {
        if (err) throw err;
        else {
            console.log(result);
            res.json(result);
        }
    })
})


// POST /api/v1/new-movie (use frontend  testing tool like postman)
// This route takes JSON as input for new movie and saves it into the database
// On successful save, it returns “success”

app.post('/api/v1/new-movie', function (req, res) {

    var tconst = req.body.tconst;
    var titleType = req.body.titleType;
    var primaryTitle = req.body.primaryTitle;
    var runtimeMinutes = req.body.runtimeMinutes;
    var genres = req.body.genres;
    db.query("insert into movies(tconst,titleType,primaryTitle,runtimeMinutes,genres) values(?,?,?,?,?) ", [tconst, titleType, primaryTitle, runtimeMinutes, genres], function (err, rows, fields) {
        if (err) {
            console.log("error" + err);
        }
        else {
            res.json("Success");

        }
    });

})


// GET /api/v1/top-rated-movies
// This route returns as JSON the movies with an averageRating > 6.0, in sorted
// order by averageRating
// The output should contain tconst, primaryTitle, genre & averageRating.

app.get('/api/v1/top-rated-movies', function (req, res) {
    db.query("select movies.tconst, movies.primaryTitle , movies.genres,ratings.averageRating from ratings join movies on ratings.tconst=movies.tconst where averageRating>6.0 order by averageRating DESC", function (err, result) {
        if (err) throw err;
        else {

            console.log(result);
            res.json(result);

        }
    })
})


app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
})