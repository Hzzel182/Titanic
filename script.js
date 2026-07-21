const API_KEY = '0ba50b1a0e817c1f5e8ba94951a3a3c2'; 

function cargarReparto(movieId, movieTitle) {
    const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=es-MX&api_key=${API_KEY}`;

    fetch(creditsUrl)
        .then(response => response.json())
        .then(data => {
            const widget = document.getElementById('movieWidget');
            
            if (data.cast && data.cast.length > 0) {
                const topCast = data.cast.slice(0, 18);
                
                let castHtml = `<div class="widget-title">${movieTitle}</div><div class="cast-list">`;
                
                topCast.forEach(actor => {
                    const profileUrl = actor.profile_path 
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` 
                        : 'https://via.placeholder.com/150/000000/333333?text=N/D';
                    
                    castHtml += `
                        <div class="cast-item">
                            <img class="cast-photo" src="${profileUrl}" alt="${actor.name}">
                            <div class="cast-info">
                                <span class="cast-name" title="${actor.name}">${actor.name}</span>
                                <span class="cast-character" title="${actor.character || 'Sin personaje'}">${actor.character || 'Sin personaje'}</span>
                            </div>
                        </div>
                    `;
                });
                
                castHtml += `</div>`;
                widget.innerHTML = castHtml;
            } else {
                widget.innerHTML = '<div class="error-msg">No hay información de reparto disponible.</div>';
            }
        })
        .catch(error => {
            console.error('Error al cargar el reparto:', error);
            document.getElementById('movieWidget').innerHTML = '<div class="error-msg">Error al conectar con la API.</div>';
        });
}

function buscarPeliculaPorNombre(query, year) {
    if (query.trim() !== '') {
        let searchUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=es-MX&api_key=${API_KEY}`;
        if (year) {
            searchUrl += `&primary_release_year=${year}`;
        }

        fetch(searchUrl)
            .then(response => response.json())
            .then(data => {
                const widget = document.getElementById('movieWidget');
                if (data.results && data.results.length > 0) {
                    const movie = data.results[0];
                    cargarReparto(movie.id, movie.title);
                } else {
                    widget.innerHTML = '<div class="error-msg">No se encontró ninguna película con ese nombre.</div>';
                }
            })
            .catch(error => {
                console.error('Error en la búsqueda:', error);
            });
    }
}

function buscarPeliculaPorId(id) {
    const idStr = id.toString();
    let url;
    
    if (idStr.startsWith('tt')) {
        url = `https://api.themoviedb.org/3/find/${idStr}?external_source=imdb_id&language=es-MX&api_key=${API_KEY}`;
    } else {
        url = `https://api.themoviedb.org/3/movie/${idStr}?language=es-MX&api_key=${API_KEY}`;
    }
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let movie = null;
            if (idStr.startsWith('tt')) {
                if (data.movie_results && data.movie_results.length > 0) {
                    movie = data.movie_results[0];
                }
            } else {
                movie = data;
            }

            if (movie && movie.id && movie.title) {
                cargarReparto(movie.id, movie.title);
            } else {
                document.getElementById('movieWidget').innerHTML = '<div class="error-msg">Película no encontrada por ID.</div>';
            }
        })
        .catch(error => {
            console.error('Error al buscar por ID:', error);
        });
}

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieIdParam = urlParams.get('id');
    const movieParam = urlParams.get('movie');
    const yearParam = urlParams.get('year');

    if (movieIdParam) {
        buscarPeliculaPorId(movieIdParam);
    } else if (movieParam) {
        buscarPeliculaPorNombre(movieParam, yearParam);
    } else {
        buscarPeliculaPorNombre('Titanic');
    }
};
