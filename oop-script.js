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
}

class APIService {
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
    static _constructUrl(path) {
        return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`;
    }
    //fetching movie cast
    static async fetchCast(movie_id) {
        const url = APIService._constructUrl(`movie/${movie_id}/credits`)
        const response = await fetch(url)
        const data = await response.json()
        return data.cast
    }

    //fetching all actors
    static async fetchActors(){
      const url = APIService._constructUrl(`person/popular`)
      const response = await fetch(url)
      const data = await response.json()
      console.log(data)
      return data.results
    }

    // fetching single actor
      static async fetchSingleActor(personId) {
        const url = APIService._constructUrl(`person/${personId}`)
        const response = await fetch(url)
        const data = await response.json()
        console.log(data)
        return new SingleActor(data)
    }
    
}

class HomePage {
    static container = document.getElementById('container');
    static renderMovies(movies) {
        const movieRow = document.createElement("div");
        movieRow.classList="row row-cols-5"
        movies.forEach(movie => {
            const movieDiv = document.createElement("div");
            movieDiv.classList="movieDiv";
            const movieImage = document.createElement("img");
            movieImage.classList="movieImage"
            movieImage.src = `${movie.backdropUrl}`;
            const movieTitle = document.createElement("h3");
            movieTitle.textContent = `${movie.title}`;
            movieImage.addEventListener("click", function() {
                homePage.remove();
                Movies.run(movie);
            });


            movieDiv.appendChild(movieTitle);
            movieDiv.appendChild(movieImage);
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
    }
}

class Actors {
    static async run(){
        const allActors = await APIService.fetchActors()
        ActorsPage.renderAllActors(allActors)
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
}

class MovieSection {
    static renderMovie(movie) {
        MoviePage.container.innerHTML = `
      <div class="row">
        <div class="col-md-4">
          <img id="movie-backdrop" src=${movie.backdropUrl}> 
        </div>
        <div class="col-md-8">
          <h2 id="movie-title">${movie.title}</h2>
          <p id="genres">${movie.genres}</p>
          <p id="movie-release-date">${movie.releaseDate}</p>
          <p id="movie-runtime">${movie.runtime}</p>
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
}


class ActorsPage {
    static container = document.getElementById('container');
    static renderAllActors(movie) {
        // console.log(movie);
        ActorsSection.renderActors(movie);
    }
}

class ActorsSection{
    static renderActors(actors){
             const actorsRow = document.createElement('div')
             actorsRow.classList="row row-cols-5"
             actors.forEach((actor)=>{
                 const actorsDiv = document.createElement('div')
                 actorsDiv.classList="col-md-2 col-sm-4 col-6 m-4 actorsDiv"
                 const actorImage= document.createElement("img")
                 actorImage.src = `https://image.tmdb.org/t/p/original/${actor.profile_path}`
                 actorImage.classList="img-fluid"
                 actorImage.addEventListener('click', function(){
                    container.innerHTML = ''
                    SingleActorSection.renderSingleActor(actor)
                 })
                 const actorName = document.createElement('h3')
                 actorName.textContent = `${actor.name}`
                 actorName.setAttribute('class', 'text-center')
                 actorsDiv.appendChild(actorImage);
                 actorsDiv.appendChild(actorName);
                 actorsRow.appendChild(actorsDiv)
                 ActorsPage.container.appendChild(actorsRow);
         });
    }
}

class SingleActorSection{
    // static async fetchSingleActor(){
    //     const url = `https://api.themoviedb.org/3/person/${person_id}?api_key=542003918769df50083a13c415bbc602`
    //     const response = await fetch(url)
    //     const data = await response.json()
    //     console.log(data)
    //   }
      
    static renderSingleActor(actor){
            const singleActorDiv = document.createElement('div')
            const singleActorImage= document.createElement("img")
            singleActorImage.src = `https://image.tmdb.org/t/p/original/${actor.profile_path}`
            singleActorImage.classList="img-fluid"
            const singleActorName = document.createElement('h3')
            singleActorName.textContent = `${actor.name}`
            const singleActorAge = document.createElement('h3')
            singleActorAge.textContent = `${actor.age}`
            singleActorName.setAttribute('class', 'text-center')
            singleActorDiv.appendChild(singleActorImage);
            singleActorDiv.appendChild(singleActorName);
            singleActorDiv.appendChild(singleActorAge);
            ActorsPage.container.appendChild(singleActorDiv);
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