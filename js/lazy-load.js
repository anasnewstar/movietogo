// Lazy Loading Script for MovieToGO
document.addEventListener('DOMContentLoaded', function () {
    // Initialize lazy loading for background images
    const lazyBackgroundObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const dataSrc = target.getAttribute('data-bg');

                if (dataSrc) {
                    // Create a new image to preload
                    const img = new Image();
                    img.onload = function () {
                        // Apply background only after image is loaded
                        target.style.backgroundImage = `url(${dataSrc})`;
                        target.classList.add('loaded');
                    };
                    img.onerror = function () {
                        // If image fails to load, try to use a placeholder
                        console.warn(`Failed to load image: ${dataSrc}`);

                        // Try alternate images
                        const alternateImages = [
                            'images/movies/avengers.jpg',
                            'images/movies/joker.jpg',
                            'images/movies/inception.jpg',
                            'images/movies/lionking.jpg',
                            'images/placeholder-poster.jpg'
                        ];

                        tryLoadAlternate(alternateImages, 0, target);
                    };
                    img.src = dataSrc;

                    // Stop observing the element after loading
                    observer.unobserve(target);
                }
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    // Function to try loading alternate images
    function tryLoadAlternate(images, index, target) {
        if (index >= images.length) {
            // If all alternatives fail, use fallback gradient
            target.classList.add('loaded');
            return;
        }

        const img = new Image();
        img.onload = function () {
            target.style.backgroundImage = `url(${images[index]})`;
            target.classList.add('loaded');
        };
        img.onerror = function () {
            tryLoadAlternate(images, index + 1, target);
        };
        img.src = images[index];
    }

    // Get all elements with data-bg attribute
    const lazyBackgrounds = document.querySelectorAll('[data-bg]');
    lazyBackgrounds.forEach(element => {
        lazyBackgroundObserver.observe(element);
    });

    // Initialize lazy loading for regular images
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');

                if (src) {
                    img.src = src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    // Get all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        lazyImageObserver.observe(img);
    });
});

// Helper function to convert all background images to lazy loading format
function convertToLazyLoading() {
    // Get all elements with background-image style
    const elementsWithBgImage = document.querySelectorAll('[style*="background-image"]');

    elementsWithBgImage.forEach(element => {
        const style = getComputedStyle(element);
        const bgImage = style.backgroundImage;

        if (bgImage && bgImage !== 'none') {
            // Extract the URL from the background-image
            const url = bgImage.replace(/url\(['"]?([^'"]*)['"]?\)/i, '$1');

            // Remove the background-image style
            element.style.backgroundImage = 'none';

            // Add a placeholder color or low-quality image
            element.style.backgroundColor = '#222';

            // Set data-bg attribute for lazy loading
            element.setAttribute('data-bg', url);

            // Add a class for styling
            element.classList.add('lazy-background');
        }
    });
}

// Check all movie posters after page load
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        const moviePosters = document.querySelectorAll('.movie-poster');
        moviePosters.forEach(poster => {
            const bgImage = poster.style.backgroundImage;
            if (!bgImage || bgImage === 'none' || bgImage === '') {
                console.log('Found poster with missing background, adding fallback');

                // Try to get movie ID from parent movie-card
                const movieCard = poster.closest('.movie-card');
                let movieId = '1';

                if (movieCard) {
                    const watchLink = movieCard.querySelector('a[href^="movie.html?id="]');
                    if (watchLink) {
                        const match = watchLink.href.match(/id=(\d+)/);
                        if (match && match[1]) {
                            movieId = match[1];
                        }
                    }
                }

                // Try these images in order
                const imagesToTry = [
                    `images/movies/${movieId}.jpg`,
                    'images/movies/avengers.jpg',
                    'images/movies/joker.jpg',
                    'images/movies/inception.jpg',
                    'images/movies/lionking.jpg'
                ];

                tryImages(poster, imagesToTry, 0);
            }
        });
    }, 500);
});

function tryImages(element, images, index) {
    if (index >= images.length) {
        // Set a fallback gradient if all images fail
        element.classList.add('poster-fallback');
        return;
    }

    const img = new Image();
    img.onload = function () {
        element.style.backgroundImage = `url('${images[index]}')`;
    };
    img.onerror = function () {
        tryImages(element, images, index + 1);
    };
    img.src = images[index];
} 