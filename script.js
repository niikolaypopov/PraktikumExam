//Variable which will keep information from AJAX query
let responseInfo = null;

//Variables which are going to be used like parameters in API link 
let year = 2020,
    page = 1,
    sort_by = "release_date.desc",
    api_key = "e587a41118b54c9011ec5e946a771845",
    with_genres = "";

//Genres
let genres = [{
        id: 28,
        name: "Action",
    },
    {
        id: 12,
        name: "Adventure",
    },
    {
        id: 16,
        name: "Animation",
    },
    {
        id: 35,
        name: "Comedy",
    },
    {
        id: 80,
        name: "Crime",
    },
    {
        id: 99,
        name: "Documentary",
    },
    {
        id: 18,
        name: "Drama",
    },
    {
        id: 10751,
        name: "Family",
    },
    {
        id: 14,
        name: "Fantasy",
    },
    {
        id: 36,
        name: "History",
    },
    {
        id: 27,
        name: "Horror",
    },
    {
        id: 10402,
        name: "Music",
    },
    {
        id: 9648,
        name: "Mystery",
    },
    {
        id: 10749,
        name: "Romance",
    },
    {
        id: 878,
        name: "Science Fiction",
    },
    {
        id: 10770,
        name: "TV Movie",
    },
    {
        id: 53,
        name: "Thriller",
    },
    {
        id: 10752,
        name: "War",
    },
    {
        id: 37,
        name: "Western",
    },
];

//String processing function responsible for API link
function getAPILink() {
    return (
        "https://api.themoviedb.org/3/discover/movie" + "?year=" + year + "&page=" + page + "&sort_by=" + sort_by + "&with_genres=" + with_genres + "&api_key=" + api_key
    );
}

//Function for AJAX Call
function makeRequest() {
    $.ajax({
            method: "GET",
            url: getAPILink(), //Getting the API link 
            dataType: "json",
        })
        .done(function(response) {
            responseInfo = response;
            displayMovieInformation(responseInfo);
        })
        .fail(function() {
            console.log("Something went wrong!");
        })
        .always(function() {
            console.log("Request has been made!");
        });
}

//Getting ganre name by ID from genres variable
function getGenre(id) {
    for (var i = 0; i < genres.length; i++) {
        if (genres[i].id == id) {
            return genres[i].name;
        }
    }
}

//Getting the html code for a movie
function getSingleMovieHtml(movie) {
    //If there is no image for a movie, the to be used a standard image that says - No poster available
    let posterPath = "assets/noPoster.jpg";
    if (movie.poster_path != null)
        posterPath = "https://image.tmdb.org/t/p/original" + movie.poster_path;

    //Setting data format (month day, year)
    let date = new Date(movie.release_date + "T00:00:00");
    date = date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    //Variable that contains the HTML of a movie, which is returned as a result by function in displayMovieInformation
    let html = '';
    html +=
        '<div class="col-12 col-md-6 pl-4 pr-4 pb-3">' +
        '<div class="movieSection row">' +
        //Poster
        '<div class="col-12 col-md-5 pl-0 pr-0">' +
        '<img src="' + posterPath + '"style="width:100%;"/>' +
        "</div>" +
        //Movie Information
        '<div class="col-12 col-md-7 p-3">' +
        movie.vote_average + '/10 (' + movie.vote_count + ')<br>' +
        //Rating
        '<a href="https://www.themoviedb.org/movie/' + movie.id + '" target="_blank"><h6>' + movie.title + '</h6></a>'; //Movie name with link to Themoviedb
    movie.genre_ids.forEach(function(element, idx, array) { //Every ganre of the movie, to be showed on the screen under the movie name
        html += getGenre(element);
        if (idx !== array.length - 1) {
            html += ', ';
        }
    });
    let overview = movie.overview; //If the movie description has to many symbols, to be limited to 390 symbols
    if (overview.length > 390) {
        overview = overview.slice(0, 389) + "...";
    }
    html +=
        "<br><strong>" +
        date +
        '</strong><br><br><font style="font-style:italic; font-size:12px;">' +
        overview +
        "</font>";

    html += "</div>" + "</div>" + "</div>";
    return html;
}

//Showing the whole information after successful query to API
function displayMovieInformation(response) {
    console.log(response);

    $("#page").html("");
    for (let i = 1; i <= response.total_pages; i++) {
        $("#page").append(
            $("<option>", {
                value: i,
                text: "Страница " + i,
            })
        );
    }

    let html = '<div class="row">';
    for (let i = 0; i < response.results.length; i++) {
        html += getSingleMovieHtml(response.results[i]);
    }
    html += "</div>";
    $("#result").html(html);
}

//Getting all genres selected from checkboxes
function getWithGenres() {
    let output = "";
    let arr = [];
    $(".input").each(function(i, obj) {
        if ($(obj).data("id") !== undefined) {
            if ($(obj).is(":checked")) arr.push($(obj).data("id"));
        }
    });
    for (let i = 0; i < arr.length; i++) {
        output += arr[i];
        if (i != arr.length - 1) output += ",";
    }
    return output;
}

//Dynamically add checkbox elements
function prepareCheckBoxes() {
    let html = '<div class="row pr-3">';
    for (var i = 0; i < genres.length; i++) {
        html +=
            '<div class="col-4"><div class="form-check">' +
            '<input type="checkbox" class="input form-check-input" id="' +
            genres[i].name +
            '" name="' +
            genres[i].name +
            '" data-id="' +
            genres[i].id +
            '">' +
            '<label class="form-check-label" for="' +
            genres[i].name +
            '">' +
            genres[i].name +
            "</label>" +
            "</div></div>";
    }
    html += "</div>";
    $("#checkboxes").html(html);
}

//When page loads to add the checkbox elements and to make 1 AJAX Request to load movies
$(document).ready(function() {
    prepareCheckBoxes();
    makeRequest();

    //Event when some of the input fields is changed (year, sort by, ganre, page) 
    $(".input").on("change", function() {
        year = $("#year").val();
        sort_by = $("#sort-by").val();
        page = $("#page").val();
        with_genres = getWithGenres();
        makeRequest();
        console.log(getAPILink());
    });
});