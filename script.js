const API_KEY = '0ba50b1a0e817c1f5e8ba94951a3a3c2'; 

function cargarReparto(movieId, movieTitle) {
    const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=es-MX&api_key=${API_KEY}`;

    fetch(creditsUrl)
        .then(response => response.json())
        .then(data => {
            const widget = document.getElementById('movieWidget');
            
            if (data.cast && data.cast.length > 0) {
                // Tomamos los primeros 8 actores principales
                const topCast = data.cast.slice(0, 8);
                
                let castHtml = `<div class="widget-title">Reparto: ${movieTitle}</div><div class="cast-list">`;
                
                topCast.forEach(actor => {
                    const profileUrl = actor.profile_path 
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` 
                        : 'https://via.placeholder.com/150/000000/333333?text=N/D';
                    
                    castHtml += `
                        <div class="cast-item">
                            <img class="cast-photo" src="${profileUrl}" alt="${actor.name}">
                            <div class="cast-info">
                                <span class="cast-name">${actor.name}</span>
                                <span class="cast-character">${actor.character || 'Sin personaje'}</span>
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

function buscarPelicula() {
    const query = document.getElementById('searchInput').value;
    if (query.trim() !== '') {
        const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=es-MX&api_key=${API_KEY}`;

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

// Carga inicial con Titanic (ID: 597)
cargarReparto(597, 'Titanic');
