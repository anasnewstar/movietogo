// ===== GLOBAL VARIABLES =====
const apiBaseUrl = 'https://api.example.com'; // This would be replaced with a real API
let currentSlide = 0;
let movies = [];
let categories = [];

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function () {
    // Initialize DOM elements after the DOM is fully loaded
    initDOMElements();

    // Initialize the application
    init();

    // Add event listeners
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                handleSearch();
            }
        });
    }

    if (mobileMenu) {
        mobileMenu.addEventListener('click', toggleMobileMenu);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', previousSlide);
        nextBtn.addEventListener('click', nextSlide);
    }

    // Initialize dot click events for slider
    if (dotsElements && dotsElements.length > 0) {
        dotsElements.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });
    }

    // Initialize page-specific functionality
    initCurrentPage();
});

// ===== DOM ELEMENTS =====
let searchInput;
let searchBtn;
let mobileMenu;
let featuredMoviesGrid;
let latestMoviesGrid;
let slideElements;
let dotsElements;
let prevBtn;
let nextBtn;

// Initialize DOM elements
function initDOMElements() {
    searchInput = document.getElementById('search-input');
    searchBtn = document.getElementById('search-btn');
    mobileMenu = document.querySelector('.mobile-menu');
    featuredMoviesGrid = document.getElementById('featured-movies-grid');
    latestMoviesGrid = document.getElementById('latest-movies-grid');
    slideElements = document.querySelectorAll('.slide');
    dotsElements = document.querySelectorAll('.dot');
    prevBtn = document.querySelector('.prev');
    nextBtn = document.querySelector('.next');
}

// ===== INITIALIZATION =====
function init() {
    // Set up slider autoplay if slider exists
    if (slideElements && slideElements.length > 0) {
        setInterval(nextSlide, 5000);
    }

    // Fetch initial data
    fetchMovies();
    fetchCategories();
}

function initCurrentPage() {
    const path = window.location.pathname;

    if (path.includes('index.html') || path === '/' || path === '') {
        // Home page
        setupHomePage();
    } else if (path.includes('categories.html')) {
        // Categories page
        setupCategoriesPage();
    } else if (path.includes('movie.html')) {
        // Movie details page
        setupMovieDetailsPage();
    } else if (path.includes('search.html')) {
        // Search results page
        setupSearchPage();
    } else if (path.includes('about.html')) {
        // About page
        // No special setup needed
    }
}

// ===== SLIDER FUNCTIONALITY =====
function showSlide(index) {
    // Check if we have slides
    if (!slideElements || slideElements.length === 0) return;

    // Hide all slides
    slideElements.forEach(slide => {
        slide.classList.remove('active');
    });

    // Remove active class from all dots if they exist
    if (dotsElements && dotsElements.length > 0) {
        dotsElements.forEach(dot => {
            dot.classList.remove('active');
        });
    }

    // Show the correct slide and dot
    if (slideElements[index]) {
        slideElements[index].classList.add('active');
    }

    if (dotsElements && dotsElements[index]) {
        dotsElements[index].classList.add('active');
    }

    // Update current slide index
    currentSlide = index;
}

function nextSlide() {
    // Check if we have slides
    if (!slideElements || slideElements.length === 0) return;

    // Calculate next slide index
    const nextIndex = (currentSlide + 1) % slideElements.length;
    showSlide(nextIndex);
}

function previousSlide() {
    // Check if we have slides
    if (!slideElements || slideElements.length === 0) return;

    // Calculate previous slide index
    const prevIndex = (currentSlide - 1 + slideElements.length) % slideElements.length;
    showSlide(prevIndex);
}

// ===== API FUNCTIONS =====
function fetchMovies() {
    // For demo purposes, we'll use mock data
    // In a real application, you would fetch data from an API

    // Simulate API delay
    setTimeout(() => {
        movies = [
            {
                id: 1,
                title: 'Avengers: Endgame',
                year: 2019,
                poster: 'images/movies/avengers.jpg',
                genre: ['Action', 'Adventure', 'Sci-Fi'],
                rating: 8.4,
                duration: '3h 1m',
                quality: 'HD',
                plot: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
                sources: [
                    { name: 'Source 1', url: 'https://example.com/avengers' },
                    { name: 'Source 2', url: 'https://example2.com/avengers' }
                ]
            },
            {
                id: 2,
                title: 'Joker',
                year: 2019,
                poster: 'images/movies/joker.jpg',
                genre: ['Crime', 'Drama', 'Thriller'],
                rating: 8.5,
                duration: '2h 2m',
                quality: 'HD',
                plot: 'In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime. This path brings him face-to-face with his alter-ego: the Joker.',
                sources: [
                    { name: 'Source 1', url: 'https://example.com/joker' },
                    { name: 'Source 2', url: 'https://example2.com/joker' }
                ]
            },
            {
                id: 3,
                title: 'The Lion King',
                year: 2019,
                poster: 'images/movies/lionking.jpg',
                genre: ['Animation', 'Adventure', 'Drama'],
                rating: 6.9,
                duration: '1h 58m',
                quality: 'HD',
                plot: 'After the murder of his father, a young lion prince flees his kingdom only to learn the true meaning of responsibility and bravery.',
                sources: [
                    { name: 'Source 1', url: 'https://example.com/lionking' },
                    { name: 'Source 2', url: 'https://example2.com/lionking' }
                ]
            },
            {
                id: 4,
                title: 'Inception',
                year: 2010,
                poster: 'images/movies/inception.jpg',
                genre: ['Action', 'Adventure', 'Sci-Fi'],
                rating: 8.8,
                duration: '2h 28m',
                quality: '4K',
                plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
                sources: [
                    { name: 'Source 1', url: 'https://example.com/inception' },
                    { name: 'Source 2', url: 'https://example2.com/inception' }
                ]
            },
            {
                id: 5,
                title: 'Parasite',
                year: 2019,
                poster: 'images/movies/parasite.jpg',
                genre: ['Comedy', 'Drama', 'Thriller'],
                rating: 8.6,
                duration: '2h 12m',
                quality: 'HD',
                plot: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
                sources: [
                    { name: 'Source 1', url: 'https://example.com/parasite' },
                    { name: 'Source 2', url: 'https://example2.com/parasite' }
                ]
            },
            {
                id: 6,
                title: 'The Dark Knight',
                year: 2008,
                poster: 'images/movies/darkknight.jpg',
                genre: ['Action', 'Crime', 'Drama'],
                rating: 9.0,
                duration: '2h 32m',
                quality: 'HD',
                plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
                sources: [
                    { name: 'Source 1', url: 'https://example.com/darkknight' },
                    { name: 'Source 2', url: 'https://example2.com/darkknight' }
                ]
            }
        ];

        // Update UI with fetched movies
        updateMoviesUI();
    }, 100); // Reduced timeout from 500ms to 100ms for faster loading
}

function fetchCategories() {
    // For demo purposes, we'll use mock data
    setTimeout(() => {
        categories = [
            { id: 1, name: 'Action', count: 245 },
            { id: 2, name: 'Comedy', count: 189 },
            { id: 3, name: 'Drama', count: 312 },
            { id: 4, name: 'Horror', count: 167 },
            { id: 5, name: 'Sci-Fi', count: 114 },
            { id: 6, name: 'Romance', count: 103 },
            { id: 7, name: 'Animation', count: 87 },
            { id: 8, name: 'Thriller', count: 153 },
            { id: 9, name: 'Documentary', count: 76 },
            { id: 10, name: 'Fantasy', count: 94 },
            { id: 11, name: 'Mystery', count: 82 },
            { id: 12, name: 'Family', count: 65 }
        ];
    }, 500);
}

function fetchMovieDetails(id) {
    // In a real application, you would fetch specific movie details
    return movies.find(movie => movie.id === parseInt(id));
}

function searchMovies(query) {
    // In a real application, you would send a request to the server
    // For demo purposes, we'll filter the mock data
    return movies.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
    );
}

// ===== UI UPDATE FUNCTIONS =====
function updateMoviesUI() {
    console.log('Updating movies UI...'); // Debug log

    // Update featured movies
    if (featuredMoviesGrid) {
        // Clear existing content to avoid duplicates
        featuredMoviesGrid.innerHTML = '';

        // Check if movies are available
        if (movies && movies.length > 0) {
            console.log(`Found ${movies.length} movies to display`); // Debug log

            const featuredMovies = movies.slice(0, 4);
            featuredMovies.forEach(movie => {
                const card = createMovieCard(movie);
                featuredMoviesGrid.appendChild(card);
            });
        } else {
            console.warn('No movies available to display.'); // Warning if no movies
        }
    } else {
        console.warn('Featured movies grid element not found.'); // Warning if element not found
    }

    // Update latest movies
    if (latestMoviesGrid) {
        latestMoviesGrid.innerHTML = '';

        if (movies && movies.length > 0) {
            const latestMovies = [...movies].reverse().slice(0, 4);
            latestMovies.forEach(movie => {
                latestMoviesGrid.appendChild(createMovieCard(movie));
            });
        }
    }
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';

    // Create movie poster
    const posterElement = document.createElement('div');
    posterElement.className = 'movie-poster';

    // Handle the poster image loading more reliably
    if (movie.poster) {
        // Check if the poster path is a full URL or a relative path
        if (movie.poster.startsWith('http')) {
            // For external URLs, create an image element first to check if it loads
            const imgLoader = new Image();
            imgLoader.onload = function () {
                posterElement.style.backgroundImage = `url('${movie.poster}')`;
            };
            imgLoader.onerror = function () {
                // If external image fails, try local fallback or use placeholder
                const localPath = `images/movies/${movie.id}.jpg`;
                const fallbackImg = new Image();
                fallbackImg.onload = function () {
                    posterElement.style.backgroundImage = `url('${localPath}')`;
                };
                fallbackImg.onerror = function () {
                    posterElement.style.backgroundImage = "url('images/placeholder-poster.jpg')";
                };
                fallbackImg.src = localPath;
            };
            imgLoader.src = movie.poster;
        } else {
            // For local path, use it directly
            posterElement.style.backgroundImage = `url('${movie.poster}')`;
        }
    } else {
        // Use a placeholder if no poster
        posterElement.style.backgroundImage = "url('images/placeholder-poster.jpg')";
    }

    // Create quality tag
    const qualityTag = document.createElement('span');
    qualityTag.className = 'quality-tag';
    qualityTag.textContent = movie.quality || 'HD';
    posterElement.appendChild(qualityTag);

    // Create movie overlay
    const overlay = document.createElement('div');
    overlay.className = 'movie-overlay';
    posterElement.appendChild(overlay);

    // Add poster to card
    card.appendChild(posterElement);

    // Create movie info
    const infoElement = document.createElement('div');
    infoElement.className = 'movie-info';

    // Create movie title
    const titleElement = document.createElement('h3');
    titleElement.className = 'movie-title';
    titleElement.textContent = movie.title;
    infoElement.appendChild(titleElement);

    // Create movie metadata
    const metaElement = document.createElement('div');
    metaElement.className = 'movie-meta';

    // Add year
    const yearElement = document.createElement('span');
    yearElement.textContent = movie.year;
    metaElement.appendChild(yearElement);

    // Add rating
    const ratingElement = document.createElement('span');
    const starIcon = document.createElement('i');
    starIcon.className = 'fas fa-star';
    starIcon.style.color = 'gold';
    ratingElement.appendChild(starIcon);
    ratingElement.append(` ${movie.rating}`);
    metaElement.appendChild(ratingElement);

    infoElement.appendChild(metaElement);

    // Create movie buttons
    const buttonsElement = document.createElement('div');
    buttonsElement.className = 'movie-buttons';

    // Add watch button
    const watchLink = document.createElement('a');
    watchLink.href = `movie.html?id=${movie.id}`;
    watchLink.className = 'btn';
    const playIcon = document.createElement('i');
    playIcon.className = 'fas fa-play';
    watchLink.appendChild(playIcon);
    watchLink.append(' Watch');
    buttonsElement.appendChild(watchLink);

    infoElement.appendChild(buttonsElement);

    // Add info to card
    card.appendChild(infoElement);

    return card;
}

// ===== PAGE SETUP FUNCTIONS =====
function setupHomePage() {
    // Home page specific setup
    console.log('Home page loaded');

    // Make sure to update the UI with movies
    updateMoviesUI();

    // For faster loading, preload the hero slider images
    const preloadSliderImages = () => {
        const slideImgs = document.querySelectorAll('.slide-img');
        slideImgs.forEach(img => {
            // Extract the background image URL
            const style = getComputedStyle(img);
            const bgImage = style.backgroundImage;
            // Create a new image element to preload
            if (bgImage && bgImage !== 'none') {
                const url = bgImage.replace(/url\(['"]?([^'"]*)['"]?\)/i, '$1');
                const image = new Image();
                image.src = url;
            }
        });
    };

    // Ensure poster images are displayed properly
    const ensureMoviePosters = () => {
        document.querySelectorAll('.movie-poster').forEach(poster => {
            const bgImage = poster.style.backgroundImage;

            if (!bgImage || bgImage === 'none' || bgImage === '') {
                // Try to extract movie ID from the button link
                const movieButton = poster.closest('.movie-card').querySelector('a[href^="movie.html?id="]');
                let movieId = '1'; // Default fallback

                if (movieButton) {
                    const hrefMatch = movieButton.getAttribute('href').match(/id=(\d+)/);
                    if (hrefMatch && hrefMatch[1]) {
                        movieId = hrefMatch[1];
                    }
                }

                // Try existing images
                const imagesToTry = [
                    `images/movies/${movieId}.jpg`,
                    'images/movies/avengers.jpg',
                    'images/movies/joker.jpg',
                    'images/movies/inception.jpg',
                    'images/movies/lionking.jpg',
                    'images/placeholder-poster.jpg'
                ];

                // Try each image until one loads
                function tryNextImage(index) {
                    if (index >= imagesToTry.length) {
                        poster.style.backgroundImage = 'none'; // None worked, use CSS fallback
                        return;
                    }

                    const imgTest = new Image();
                    imgTest.onload = function () {
                        poster.style.backgroundImage = `url('${imagesToTry[index]}')`;
                    };
                    imgTest.onerror = function () {
                        tryNextImage(index + 1);
                    };
                    imgTest.src = imagesToTry[index];
                }

                tryNextImage(0);
            }
        });
    };

    // Call preload functions
    preloadSliderImages();
    ensureMoviePosters();

    // Set a timeout to check posters again after any dynamic content has loaded
    setTimeout(ensureMoviePosters, 500);
}

function setupCategoriesPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const genre = urlParams.get('genre');
    const type = urlParams.get('type');

    const categoryTitle = document.getElementById('category-title');
    const allCategoriesSection = document.getElementById('all-categories-section');
    const categoryMoviesGrid = document.getElementById('category-movies-grid');
    const moviesLoader = document.getElementById('movies-loader');
    const noResults = document.getElementById('no-results');

    if (genre) {
        // Show specific genre
        if (categoryTitle) {
            categoryTitle.textContent = genre.charAt(0).toUpperCase() + genre.slice(1) + ' Movies';
        }

        if (allCategoriesSection) {
            allCategoriesSection.style.display = 'none';
        }

        // Filter movies by genre
        const genreMovies = movies.filter(movie =>
            movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        );

        // Update UI
        if (categoryMoviesGrid) {
            if (genreMovies.length > 0) {
                genreMovies.forEach(movie => {
                    categoryMoviesGrid.appendChild(createMovieCard(movie));
                });

                if (moviesLoader) moviesLoader.style.display = 'none';
                if (noResults) noResults.style.display = 'none';
            } else {
                if (moviesLoader) moviesLoader.style.display = 'none';
                if (noResults) noResults.style.display = 'block';
            }
        }
    } else if (type) {
        // Show movies by type (featured, latest, etc.)
        let typeMovies = [];
        let typeTitle = '';

        switch (type) {
            case 'featured':
                typeMovies = movies.slice(0, 6);
                typeTitle = 'Featured Movies';
                break;
            case 'latest':
                typeMovies = [...movies].reverse().slice(0, 6);
                typeTitle = 'Latest Movies';
                break;
            case 'top':
                typeMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 6);
                typeTitle = 'Top Rated Movies';
                break;
            case 'new':
                typeMovies = [...movies].sort((a, b) => b.year - a.year).slice(0, 6);
                typeTitle = 'New Releases';
                break;
            default:
                typeMovies = movies;
                typeTitle = 'All Movies';
        }

        if (categoryTitle) {
            categoryTitle.textContent = typeTitle;
        }

        if (allCategoriesSection) {
            allCategoriesSection.style.display = 'none';
        }

        // Update UI
        if (categoryMoviesGrid) {
            if (typeMovies.length > 0) {
                typeMovies.forEach(movie => {
                    categoryMoviesGrid.appendChild(createMovieCard(movie));
                });

                if (moviesLoader) moviesLoader.style.display = 'none';
                if (noResults) noResults.style.display = 'none';
            } else {
                if (moviesLoader) moviesLoader.style.display = 'none';
                if (noResults) noResults.style.display = 'block';
            }
        }
    } else {
        // Show all categories
        if (categoryTitle) {
            categoryTitle.textContent = 'All Categories';
        }

        if (allCategoriesSection) {
            allCategoriesSection.style.display = 'block';
        }

        if (categoryMoviesGrid) {
            categoryMoviesGrid.style.display = 'none';
        }

        if (moviesLoader) {
            moviesLoader.style.display = 'none';
        }
    }
}

function setupMovieDetailsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (movieId) {
        const movie = fetchMovieDetails(parseInt(movieId));

        if (movie) {
            // Update movie details
            updateMovieDetails(movie);

            // Set up custom source input
            setupCustomSourceInput(movie);

            // Load related movies
            loadRelatedMovies(movie);
        } else {
            // Handle movie not found
            showPlayerError('Movie not found', 'The requested movie could not be found.');
        }
    } else {
        // Handle no movie ID
        showPlayerError('Invalid request', 'No movie ID specified.');
    }
}

function updateMovieDetails(movie) {
    // Update title and metadata
    const titleElement = document.getElementById('movie-title');
    const yearElement = document.getElementById('movie-year');
    const durationElement = document.getElementById('movie-duration');
    const ratingElement = document.getElementById('movie-rating');
    const genreElement = document.getElementById('movie-genre');
    const plotElement = document.getElementById('movie-plot');
    const posterElement = document.getElementById('movie-poster');
    const sourcesListElement = document.getElementById('sources-list');
    const castGridElement = document.getElementById('cast-grid');
    const qualityTagElement = document.getElementById('quality-tag');

    if (titleElement) titleElement.textContent = movie.title;
    if (yearElement) yearElement.textContent = movie.year;
    if (durationElement) durationElement.textContent = movie.duration;
    if (ratingElement) ratingElement.textContent = `IMDb ${movie.rating}`;

    if (genreElement) {
        genreElement.innerHTML = '';
        movie.genre.forEach(genre => {
            const genreSpan = document.createElement('span');
            genreSpan.textContent = genre;
            genreElement.appendChild(genreSpan);
        });
    }

    if (plotElement) plotElement.textContent = movie.plot;

    if (posterElement && movie.poster) {
        posterElement.innerHTML = `<img src="${movie.poster}" alt="${movie.title}">`;
    }

    if (qualityTagElement) qualityTagElement.textContent = movie.quality || 'HD';

    // Add sources
    if (sourcesListElement && movie.sources) {
        sourcesListElement.innerHTML = '';

        movie.sources.forEach((source, index) => {
            const sourceButton = document.createElement('a');
            sourceButton.href = '#';
            sourceButton.className = 'source-button';
            sourceButton.innerHTML = `<i class="fas fa-play-circle"></i> ${source.name}`;
            sourceButton.setAttribute('data-url', source.url);
            sourceButton.addEventListener('click', function (e) {
                e.preventDefault();
                loadMovieSource(source.url);
            });

            sourcesListElement.appendChild(sourceButton);
        });
    }

    // Mock cast data
    if (castGridElement) {
        castGridElement.innerHTML = '';

        const mockCast = [
            { name: 'Actor 1', role: 'Character 1', image: 'https://via.placeholder.com/100' },
            { name: 'Actor 2', role: 'Character 2', image: 'https://via.placeholder.com/100' },
            { name: 'Actor 3', role: 'Character 3', image: 'https://via.placeholder.com/100' },
            { name: 'Actor 4', role: 'Character 4', image: 'https://via.placeholder.com/100' }
        ];

        mockCast.forEach(actor => {
            const castCard = document.createElement('div');
            castCard.className = 'cast-card';

            const castImg = document.createElement('div');
            castImg.className = 'cast-img';
            castImg.innerHTML = `<img src="${actor.image}" alt="${actor.name}">`;

            const castName = document.createElement('div');
            castName.className = 'cast-name';
            castName.textContent = actor.name;

            const castRole = document.createElement('div');
            castRole.className = 'cast-role';
            castRole.textContent = actor.role;

            castCard.appendChild(castImg);
            castCard.appendChild(castName);
            castCard.appendChild(castRole);

            castGridElement.appendChild(castCard);
        });
    }

    // Load first source by default
    if (movie.sources && movie.sources.length > 0) {
        loadMovieSource(movie.sources[0].url);
    }
}

function loadMovieSource(sourceUrl) {
    const playerContainer = document.getElementById('player-container');
    const playerLoader = document.getElementById('player-loader');
    const playerError = document.getElementById('player-error');

    if (playerContainer && playerLoader) {
        // Show loader
        playerLoader.style.display = 'flex';
        playerContainer.innerHTML = '';

        if (playerError) {
            playerError.style.display = 'none';
        }

        // Simulate loading time
        setTimeout(() => {
            try {
                // Create iframe element
                const iframe = document.createElement('iframe');
                iframe.allowFullscreen = true;

                // For demo purposes, we'll use a placeholder video
                // In a real application, you would use the actual source URL
                iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ';

                // Add iframe to container
                playerContainer.appendChild(iframe);

                // Hide loader
                playerLoader.style.display = 'none';
            } catch (error) {
                // Show error message
                showPlayerError('Error loading movie', 'There was a problem loading this source. Please try another one.');
            }
        }, 1500);
    }
}

function showPlayerError(title, message) {
    const playerContainer = document.getElementById('player-container');
    const playerLoader = document.getElementById('player-loader');
    const playerError = document.getElementById('player-error');
    const errorTitle = playerError ? playerError.querySelector('h3') : null;
    const errorMessage = playerError ? playerError.querySelector('p') : null;

    if (playerLoader) {
        playerLoader.style.display = 'none';
    }

    if (playerContainer) {
        playerContainer.innerHTML = '';
    }

    if (playerError) {
        if (errorTitle) errorTitle.textContent = title;
        if (errorMessage) errorMessage.textContent = message;
        playerError.style.display = 'flex';
    }
}

function setupCustomSourceInput(movie) {
    const customSourceInput = document.getElementById('custom-source-input');
    const addSourceBtn = document.getElementById('add-source-btn');

    if (customSourceInput && addSourceBtn) {
        addSourceBtn.addEventListener('click', function () {
            const sourceUrl = customSourceInput.value.trim();

            if (sourceUrl) {
                loadMovieSource(sourceUrl);

                // Add to sources list
                const sourcesListElement = document.getElementById('sources-list');

                if (sourcesListElement) {
                    const sourceButton = document.createElement('a');
                    sourceButton.href = '#';
                    sourceButton.className = 'source-button';
                    sourceButton.innerHTML = `<i class="fas fa-play-circle"></i> Custom Source`;
                    sourceButton.setAttribute('data-url', sourceUrl);
                    sourceButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        loadMovieSource(sourceUrl);
                    });

                    sourcesListElement.appendChild(sourceButton);
                }

                // Clear input
                customSourceInput.value = '';
            }
        });
    }
}

function loadRelatedMovies(movie) {
    const relatedMoviesGrid = document.getElementById('related-movies-grid');

    if (relatedMoviesGrid) {
        // Get movies with similar genres
        const relatedMovies = movies.filter(m =>
            m.id !== movie.id &&
            m.genre.some(g => movie.genre.includes(g))
        ).slice(0, 4);

        if (relatedMovies.length > 0) {
            relatedMoviesGrid.innerHTML = '';

            relatedMovies.forEach(relatedMovie => {
                relatedMoviesGrid.appendChild(createMovieCard(relatedMovie));
            });
        }
    }
}

function setupSearchPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');

    if (query) {
        const searchQueryElement = document.getElementById('search-query');
        const searchResultsGrid = document.getElementById('search-results-grid');
        const searchLoader = document.getElementById('search-loader');
        const noResults = document.getElementById('no-results');
        const countElement = document.getElementById('count');

        if (searchQueryElement) {
            searchQueryElement.textContent = query;
        }

        // Simulate search delay
        setTimeout(() => {
            const results = searchMovies(query);

            if (searchResultsGrid) {
                searchResultsGrid.innerHTML = '';

                if (results.length > 0) {
                    results.forEach(movie => {
                        searchResultsGrid.appendChild(createMovieCard(movie));
                    });

                    if (countElement) {
                        countElement.textContent = results.length;
                    }

                    if (searchLoader) {
                        searchLoader.style.display = 'none';
                    }

                    if (noResults) {
                        noResults.style.display = 'none';
                    }
                } else {
                    if (countElement) {
                        countElement.textContent = '0';
                    }

                    if (searchLoader) {
                        searchLoader.style.display = 'none';
                    }

                    if (noResults) {
                        noResults.style.display = 'block';
                    }
                }
            }
        }, 1000);
    }
}

// ===== EVENT HANDLERS =====
function handleSearch() {
    const query = searchInput.value.trim();

    if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
}

function toggleMobileMenu() {
    const nav = document.querySelector('nav');
    const searchBox = document.querySelector('.search-box');

    if (nav) {
        nav.classList.toggle('show');
    }

    if (searchBox) {
        searchBox.classList.toggle('show');
    }
}

// ===== UTILITY FUNCTIONS =====
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
} 