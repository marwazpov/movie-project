//the API documentation site https://developers.themoviedb.org/3/

class App {
    static async run() {
        const movies = await APIService.fetchMovies()
        HomePage.renderMovies(movies);
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
    static async fetchActors(movie_id) {
        const url = APIService._constructUrl(`movie/${movie_id}/credits`)
        const response = await fetch(url)
        const data = await response.json()
        return data.cast
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

        const movieCredits= await APIService.fetchActors(movieData.id)
        MoviePage.rendrMovieCast(movieCredits);
        
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
        actorDiv.classList='row gx-3 my-2'
        movie.forEach(movie => {

            const actorCard= document.createElement('div')
            actorCard.classList=' col-md-2 col-sm-4 col-6"'
            const actorImage = document.createElement("img");
            actorImage.src = `https://image.tmdb.org/t/p/original${movie.profile_path}`;
            actorImage.classList='img-fluid'
            const actorName = document.createElement("h6");
            actorName.textContent = `${movie.name}`;
            actorCard.appendChild(actorName);
            actorCard.appendChild(actorImage);
            actorDiv.appendChild(actorCard);
            MoviePage.container.appendChild(actorDiv);
        })

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

document.addEventListener("DOMContentLoaded", App.run);