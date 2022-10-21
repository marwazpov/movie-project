//the API documentation site https://developers.themoviedb.org/3/
const container = document.getElementById('container');
const homePage = document.getElementById("home-page");
const home = document.getElementById("home");

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
        return data.results.map(movie => new Movie(movie))
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
        const url =`https://api.themoviedb.org/3/search/person?api_key=bae5a03c227c33b8d9842f4e6c132889&query=${searchedMovie}`
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
        movieRow.classList="row row-cols-5 d-flex justify-content-around"
      
        movies.forEach(movie => {
           
            const movieDiv = document.createElement("div");
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
            const movieRating = document.createElement("span");
            movieRating.textContent = `Rating: ${movie.voteAverage}`
            movieDiv.appendChild(movieTitle);
            movieDiv.appendChild(movieImage);
            movieDiv.appendChild(movieRating);
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
          <p id="genres">${movie.genres}</p>
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


document.addEventListener("DOMContentLoaded", App.run);