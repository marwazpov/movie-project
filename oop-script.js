//the API documentation site https://developers.themoviedb.org/3/
const container = document.getElementById('container');
const homePage = document.getElementById("home-page");
const home = document.getElementById("home");
const about = document.getElementById("about");

class App {
    static async run() {
        const movies = await APIService.fetchMovies()
        HomePage.renderMovies(movies);
    }
    static async runActorsListPage(){
        const actors = await APIService.fetchActors()
        ActorsPage.renderAllActors(actors);
    }
    static async runSingleActorsPage(){
        const actor = await APIService.fetchSingleActor()
        SingleActorsPage.renderSingleActors(actor);
    }

    static async runMovieGenres(genreId){
        const genre = await APIService.fethcingMovieGenres(genreId)
        GenresPage.renderGenres(genre);
    }

    static async runMovieSearch(){
        const value = document.getElementById("searchedMovie").value;
        const search = await APIService.fethcingSearchedMovies(value)
        MovieSearchPage.renderMovieSearch(search);
    }

    static async runFilter(input){
        const filteredMovies = await APIService.fethcingFilteredMovies(input)
        MovieSearchPage.renderMovieSearch(filteredMovies);
    }
}

class APIService {
    static _constructUrl(path) {
        return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`;
    }

    static TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    static async fetchMovies() {
        const url = APIService._constructUrl(`movie/now_playing`)
        const response = await fetch(url)
        const data = await response.json()
        return data.results
    }
    static async fetchMovie(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}`)
        const response = await fetch(url)
        const data = await response.json()
        return new Movie(data)
    }
    
    //fetching movie cast
    static async fetchCast(movie_id) {
        const url = APIService._constructUrl(`movie/${movie_id}/credits`)
        const response = await fetch(url)
        const data = await response.json()
        console.log(data)
        return data.cast
    }

    //fetching all actors
    static async fetchActors(){
      const url = APIService._constructUrl(`person/popular`)
      const response = await fetch(url)
      const data = await response.json()
      return data.results
    }

    // fetching single actor
      static async fetchSingleActor(personId) {
        const url = APIService._constructUrl(`person/${personId}`)
        const response = await fetch(url)
        const data = await response.json()
        return data
    }
    
    // fetching movie genres
    static async fethcingMovieGenres(genreId) {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=bae5a03c227c33b8d9842f4e6c132889&include_adult=false&with_genres=${genreId}`);
        const data = await response.json()
        return data.results
    }

    // fetching searched movies
    static async fethcingSearchedMovies(searchedMovie) {
        const url =`https://api.themoviedb.org/3/search/movie?api_key=bae5a03c227c33b8d9842f4e6c132889&query=${searchedMovie}`
        const response = await fetch(url)
        const data = await response.json()
        return data.results
    }
    // fetching filtered movies
    static async fethcingFilteredMovies(filter) {
        const url = APIService._constructUrl(`movie/${filter}`)
        const response = await fetch(url)
        const data = await response.json()
        return data.results
    }

    //fethcing trailers
    static async fetchTrailer(movie_id){
        const url = APIService._constructUrl(`movie/${movie_id}/videos`)
        const response = await fetch(url)
        const data = await response.json()
        return data.results
    }
}

class HomePage {
    static container = document.getElementById('container');
    static renderMovies(movies) {
        const movieRow = document.createElement("div");
        movieRow.classList="row row-cols-3 d-flex justify-content-around"
        console.log(movies)
        movies.forEach(movie => {   
            const movieDiv = document.createElement("div");
            const ratingButton= document.createElement('button');
            const progressDiv= document.createElement('div');
            
            movieDiv.classList="movieDiv";
            const movieImage = document.createElement("img");
            movieImage.classList="movieImage img-fluid"
            if ('backdropUrl' in movie){
                movieImage.src = `http://image.tmdb.org/t/p/w780/${movie.backdropUrl}`;
            } else {movieImage.src = `http://image.tmdb.org/t/p/w780/${movie.backdrop_path}`;}
        
            const movieTitle = document.createElement("h3");
            movieTitle.textContent = `${movie.title}`;
            movieDiv.addEventListener("click", ()=>{
                homePage.remove();
                Movies.run(movie);
            });
    
            ratingButton.textContent = `Rating: ${movie.vote_average}`
            ratingButton.id = "ratingButton"
            ratingButton.classList = 'ratingButton btn btn-outline-light p-3'
        
            movieDiv.appendChild(movieTitle);
            movieDiv.appendChild(movieImage);
            movieDiv.appendChild(ratingButton);
    
            movieRow.appendChild(movieDiv);
            this.container.appendChild(movieRow);
        })
    }
    
}


class Movies {
    static async run(movie) {
        const movieData = await APIService.fetchMovie(movie.id)
        MoviePage.renderMovieSection(movieData);

        const movieCredits= await APIService.fetchCast(movieData.id)
        MoviePage.rendrMovieCast(movieCredits);

        const movieTrailer =await APIService.fetchTrailer(movieData.id)
        MoviePage.renderMovieTrailer(movieTrailer);
        
    }
}

class Actors {
    static async run(actors){
        const allActors = await APIService.fetchActors()
        ActorsPage.renderAllActors(allActors);

        const singleActors = await APIService.fetchSingleActor(actors.id)
        SingleActorsSection.renderSingleActors(singleActors); 
    }     
}



class MoviePage {
    static container = document.getElementById('container');
    static renderMovieSection(movie) {
        MovieSection.renderMovie(movie);
    }
    static rendrMovieCast(movie) {
        MovieSection.renderCast(movie);
    }

    static renderMovieTrailer(movie){
        MovieSection.renderTrailer(movie);

    }

}

class MovieSection {
    static renderMovie(movie) {
        MoviePage.container.innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <img id="movie-backdrop" src=${movie.backdropUrl}> 
        </div>
        <div class="col-md-6">
          <h2 id="movie-title">${movie.title}</h2>
          <p id="movie-release-date"> Release Date: ${movie.releaseDate}</p>
          <p id="movie-runtime"> Run Time: ${movie.runtime}</p>
          <h3>Overview:</h3>
          <p id="movie-overview">${movie.overview}</p>
        </div>
      </div>
      <h3>Movie Cast:</h3>
    `;
    }
    static renderCast(movie) {

        const actorDiv = document.createElement("div");
        const actors = movie.slice(0,10)
        actorDiv.classList='actorDiv'
        actors.forEach(actor => {
            const actorCard= document.createElement('div')
            actorCard.classList='col-md-2 col-sm-4 col-6 m-4'
            const actorImage = document.createElement("img");
            actorImage.src = `https://image.tmdb.org/t/p/original${actor.profile_path}`;
            actorImage.classList='img-fluid'
            const actorName = document.createElement("h6");
            actorName.textContent = `${actor.name}`;

            actorCard.appendChild(actorName);
            actorCard.appendChild(actorImage);
            actorDiv.appendChild(actorCard);
            MoviePage.container.appendChild(actorDiv);
        })

        
    }

    static renderTrailer(movies){
         const videos = movies.slice(0,1)
         videos.forEach(movie => {
            const videoDiv = document.createElement("div");
            videoDiv.classList="trailerDiv row align-items-center container-fluid ";
            const header= document.createElement('h3');
            header.innerHTML='Trailer';
            header.classList='text-center';
            const trailer=document.createElement('iframe');
            trailer.width='300';
            trailer.height='550';
            trailer.innerHTML=`${movie.id}`;
            trailer.src = `https://www.youtube.com/embed/${movie.key}`;
            videoDiv.appendChild(header);
            videoDiv.appendChild(trailer);
            MoviePage.container.appendChild(videoDiv);
        })
    }

}


class ActorsPage {
    static container = document.getElementById('container');
    static renderAllActors(actors) {
        ActorsSection.renderActors(actors);
    }
}

class SingleActorsPage{
    static container = document.getElementById('container');
    static renderSingleActors(actor) {
        SingleActorsSection.renderSingleActors(actor);
    }
}

class GenresPage{
    static container = document.getElementById('container');
    static renderGenres(genres) {
        homePage.remove();
        MoviePage.container.innerHTML=""
        HomePage.renderMovies(genres)
    }
}

class  MovieSearchPage{
    static container = document.getElementById('container');
    static renderMovieSearch(search) {
        homePage.remove();
        MoviePage.container.innerHTML=""
        HomePage.renderMovies(search)
    }

    
}





class ActorsSection{
    static renderActors(people){
             const actorsRow = document.createElement('div')
             actorsRow.classList="row row-cols-5 d-flex justify-content-around"
             people.forEach((person)=>{
                 const actorsDiv = document.createElement('div')
                 actorsDiv.classList="col-md-2 col-sm-4 col-6 m-4 actorsDiv"
                 const actorImage= document.createElement("img")
                 actorImage.src = `https://image.tmdb.org/t/p/original/${person.profile_path}`
                 actorImage.classList="img-fluid allActors"
                 const actorName = document.createElement('h3')
                 actorName.textContent = `${person.name}`
                 actorName.setAttribute('class', 'text-center')
                 actorsDiv.appendChild(actorImage);
                 actorsDiv.appendChild(actorName);
                 actorsRow.appendChild(actorsDiv)
                 ActorsPage.container.appendChild(actorsRow);
                 actorImage.addEventListener('click',()=>{
                    Actors.run(person)
                 })
         });
    }
}

class SingleActorsSection{
    static renderSingleActors(actor){
        console.log(actor)
        const image = `https://image.tmdb.org/t/p/original/${actor.profile_path}`
        ActorsPage.container.innerHTML=""
        SingleActorsPage.container.innerHTML=`
        <div class="row">

        <div class='col-6'>
        <h2>${actor.name}<h2>
        <h3>${actor.birthday} | ${actor.place_of_birth} </h3> 
        <p>${actor.biography}</p>
        </div>
        
        <div class='col-6'> 
        <img class='img-fluid'  src=${image} />
        </div>
       
        </div>
        `
    }
}


class Movie {
    static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
    constructor(json) {
        this.id = json.id;
        this.title = json.title;
        this.releaseDate = json.release_date;
        this.runtime = json.runtime + " minutes";
        this.overview = json.overview;
        this.backdropPath = json.backdrop_path;
    }

get backdropUrl() {
        return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : "";
    }
}

const actorsListButton = document.getElementById('actors').addEventListener('click',()=>{
homePage.remove();
MoviePage.container.innerHTML=""
App.runActorsListPage()
})

const moviesButton = home.addEventListener('click', ()=>{
    MoviePage.container.innerHTML=""
    App.run();
})

const aboutButton = about.addEventListener('click', ()=>{
    homePage.remove();
    container.innerHTML=`
    <div class="text-center p-2">
    <h1>Website Content</h1>
    <h2>Home Page</h2>
    <p>Displays movies now playing as a default</p>
    <p>You can use <strong>Filter dropdown </strong> to filter movies according to popular, top rated, now playing and upcoming movies</p>
    <p>You can also use <strong> Movie Genres</strong> to filter movies acording the genres you like </p>
    <h2>Single Movie Page</h2>
    <p>Clicking on movie card will display the selected movie details including:</P>
    <p>Title, release date, run time, overview, main cast and a trailer</p>
    <h2>Actors Page</h2>
    <p>Displays the popular actors</p>
    <p>Each actor card takes you to single actor page when clicked</p>
    <h2>Search Bar</h2>
    <p>Takes the given input and displays all matching movies</p>
    <h2>Mode Switch</h2>
    <p>Toggles websites between light and dark mode</p>
    </div>

    `
})

let isBlack = false;
 document.getElementById("modeButton").addEventListener("click", ()=>{
    if(isBlack){
                document.body.style.background= "white";
                document.body.style.color="black"
                document.getElementById('nav').classList='navbar navbar-expand-lg bg-light fixed-top'
                document.getElementById("modeButton").classList='btn btn-outline-info'
                document.getElementsByClassName("ratingButton").classList='ratingButton btn btn-outline-info p-3'
                document.getElementById("modeButton").innerHTML=' Mode Switch <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-toggle-on" viewBox="0 0 16 16"><path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10H5zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/></svg>'
            } 
            else{
                document.body.style.background= "black";
                document.body.style.color="white"
                document.getElementById('nav').classList='navbar navbar-expand-lg  navbar-dark bg-dark fixed-top'
                document.getElementById("modeButton").classList='btn btn-outline-light'
                document.getElementsByClassName("ratingButton").classList='ratingButton btn btn-outline-danger p-3'
                document.getElementById("modeButton").innerHTML=' Mode Switch <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-toggle-off" viewBox="0 0 16 16"> <path d="M11 4a4 4 0 0 1 0 8H8a4.992 4.992 0 0 0 2-4 4.992 4.992 0 0 0-2-4h3zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5z"/></svg>'
            }
            isBlack = !isBlack
})


document.addEventListener("DOMContentLoaded", App.run);