const API_KEY = '0ba50b1a0e817c1f5e8ba94951a3a3c2'; 

function cargarDetalles(movieId) {
    const detailUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=es-MX&api_key=${API_KEY}`;

    fetch(detailUrl)
        .then(response => response.json())
        .then(movie => {
            const widget = document.getElementById('movieWidget');
            const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=Sin+Imagen';
            const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/D';
            const genresHtml = movie.genres.map(g => `<span class="genre-tag">${g.name}</span>`).join('');
            const hours = Math.floor(movie.runtime / 60);
            const minutes = movie.runtime % 60;
            const runtimeStr = movie.runtime ? `${hours}h ${minutes}m` : 'N/D';
            
            widget.innerHTML = `
                <img class="tmdb-poster" src="${posterUrl}" alt="${movie.title}">
                <div class="tmdb-content">
                    <h2 class="tmdb-title">${movie.title}</h2>
                    <div class="tmdb-genres">${genresHtml}</div>
                    <div class="tmdb-info">
                        <span>📅 ${releaseYear}</span>
                        <span>⏱️ ${runtimeStr}</span>
                        <span>⭐ ${movie.vote_average.toFixed(1)}</span>
                    </div>
                    <p class="tmdb-overview">${movie.overview || 'Sin descripción disponible.'}</p>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error al cargar detalles:', error);
        });
}

function buscarPelicula() {
    const query = document.getElementById('searchInput').value;
    if (query.trim() !== '') {
        const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=es-MX&api_key=${API_KEY}`;

        fetch(searchUrl)
            .then(response => response.json())
            .then(data => {
                const widget = document.getElementById('movieWidget');
                if (data.results && data.results.length > 0) {
                    cargarDetalles(data.results[0].id);
                } else {
                    widget.innerHTML = '<p style="padding:20px; color: #f59e0b; text-align:center;">No se encontró ninguna película.</p>';
                }
            })
            .catch(error => {
                console.error('Error en la búsqueda:', error);
            });
    }
}

// Carga inicial con Titanic (ID: 597)
cargarDetalles(597);
