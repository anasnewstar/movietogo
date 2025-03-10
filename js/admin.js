// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');

            // Remove active class from all buttons and tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to the clicked button and corresponding tab
            button.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });

    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const modalCloseButtons = document.querySelectorAll('.modal-close, .modal-cancel');
    const addMovieBtn = document.getElementById('add-movie-btn');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const addUserBtn = document.getElementById('add-user-btn');

    // Open modals
    if (addMovieBtn) {
        addMovieBtn.addEventListener('click', function () {
            // Reset the form
            document.getElementById('movie-form').reset();

            // Reset poster preview to default
            const previewContainer = document.getElementById('poster-preview');
            if (previewContainer) {
                const previewImage = previewContainer.querySelector('img');
                previewImage.src = 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg';
            }

            // Update modal title
            document.getElementById('movie-modal-title').textContent = 'Add New Movie';

            // Reset file upload field
            document.getElementById('file-name').textContent = 'No file chosen';

            // Open the modal
            openModal('movie-modal');
        });
    }

    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', () => {
            openModal('category-modal');
            document.getElementById('category-modal-title').textContent = 'Add New Category';
            document.getElementById('category-form').reset();
        });
    }

    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => {
            openModal('user-modal');
            document.getElementById('user-modal-title').textContent = 'Add New User';
            document.getElementById('user-form').reset();
        });
    }

    // Close modals
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            modals.forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });

    // Handle clicks outside modal to close it
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Edit buttons functionality
    const editButtons = document.querySelectorAll('.edit-btn');

    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemId = button.getAttribute('data-id');
            const parentRow = button.closest('tr');

            if (parentRow.closest('#movies-table-body')) {
                // Edit movie
                openModal('movie-modal');
                document.getElementById('movie-modal-title').textContent = 'Edit Movie';
                populateMovieForm(itemId, parentRow);
            } else if (parentRow.closest('#categories-table-body')) {
                // Edit category
                openModal('category-modal');
                document.getElementById('category-modal-title').textContent = 'Edit Category';
                populateCategoryForm(itemId, parentRow);
            } else if (parentRow.closest('#users-table-body')) {
                // Edit user
                openModal('user-modal');
                document.getElementById('user-modal-title').textContent = 'Edit User';
                populateUserForm(itemId, parentRow);
            } else if (parentRow.closest('#comments-table-body')) {
                // Edit comment
                // Implementation would depend on specific requirements
                alert('Comment editing feature will be implemented based on requirements');
            }
        });
    });

    // Delete buttons functionality
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemId = button.getAttribute('data-id');
            const itemType = getItemType(button);

            openModal('confirm-modal');
            document.getElementById('confirm-message').textContent = `Are you sure you want to delete this ${itemType}?`;

            // Set up confirm buttons
            document.getElementById('confirm-yes').onclick = () => {
                deleteItem(itemId, itemType);
                document.getElementById('confirm-modal').classList.remove('active');
            };

            document.getElementById('confirm-no').onclick = () => {
                document.getElementById('confirm-modal').classList.remove('active');
            };
        });
    });

    // View buttons functionality
    const viewButtons = document.querySelectorAll('.view-btn');

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const itemId = button.getAttribute('data-id');
            // Open the movie in a new tab/window
            window.open(`movie.html?id=${itemId}`, '_blank');
        });
    });

    // Comment approval buttons
    const approveButtons = document.querySelectorAll('.approve-btn');
    const rejectButtons = document.querySelectorAll('.reject-btn');

    approveButtons.forEach(button => {
        button.addEventListener('click', () => {
            const commentId = button.getAttribute('data-id');
            approveComment(commentId);
        });
    });

    rejectButtons.forEach(button => {
        button.addEventListener('click', () => {
            const commentId = button.getAttribute('data-id');
            rejectComment(commentId);
        });
    });

    // File upload handling
    const moviePosterUpload = document.getElementById('movie-poster-upload');
    const categoryImageUpload = document.getElementById('category-image-upload');

    if (moviePosterUpload) {
        moviePosterUpload.addEventListener('change', function (e) {
            const fileName = e.target.files[0]?.name || 'No file chosen';
            document.getElementById('file-name').textContent = fileName;

            // Update the preview with the uploaded image
            if (e.target.files && e.target.files[0]) {
                const previewContainer = document.getElementById('poster-preview');
                const previewImage = previewContainer.querySelector('img');

                // Set the image source
                const reader = new FileReader();
                reader.onload = function (e) {
                    previewImage.src = e.target.result;
                    // Clear the URL input since we're using an uploaded file
                    const posterUrlInput = document.getElementById('poster-url');
                    if (posterUrlInput) posterUrlInput.value = '';
                }
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }

    if (categoryImageUpload) {
        categoryImageUpload.addEventListener('change', function (e) {
            const fileName = e.target.files[0]?.name || 'No file chosen';
            document.getElementById('category-file-name').textContent = fileName;
        });
    }

    // Form submissions
    const movieForm = document.getElementById('movie-form');
    const categoryForm = document.getElementById('category-form');
    const userForm = document.getElementById('user-form');
    const settingsForm = document.getElementById('site-settings-form');

    if (movieForm) {
        movieForm.addEventListener('submit', function (e) {
            e.preventDefault();
            saveMovie();
        });
    }

    if (categoryForm) {
        categoryForm.addEventListener('submit', function (e) {
            e.preventDefault();
            saveCategory();
        });
    }

    if (userForm) {
        userForm.addEventListener('submit', function (e) {
            e.preventDefault();
            saveUser();
        });
    }

    if (settingsForm) {
        settingsForm.addEventListener('submit', function (e) {
            e.preventDefault();
            saveSettings();
        });
    }

    // Filters functionality
    const filterCategory = document.getElementById('filter-category');
    const filterStatus = document.getElementById('filter-status');
    const filterRole = document.getElementById('filter-role');
    const filterCommentStatus = document.getElementById('filter-comment-status');
    const movieSearch = document.getElementById('movie-search');
    const userSearch = document.getElementById('user-search');
    const commentSearch = document.getElementById('comment-search');

    // Add event listeners to all filters
    [filterCategory, filterStatus, filterRole, filterCommentStatus].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });

    [movieSearch, userSearch, commentSearch].forEach(search => {
        if (search) {
            search.addEventListener('input', applyFilters);
        }
    });

    // Pagination functionality
    const pageNumbers = document.querySelectorAll('.page-number');
    const prevPageBtn = document.querySelector('.prev-page');
    const nextPageBtn = document.querySelector('.next-page');

    pageNumbers.forEach(pageNumber => {
        pageNumber.addEventListener('click', () => {
            pageNumbers.forEach(btn => btn.classList.remove('active'));
            pageNumber.classList.add('active');

            // In a real app, this would load the page data
            console.log('Loading page ' + pageNumber.textContent);
        });
    });

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => {
            const activePage = document.querySelector('.page-number.active');
            if (activePage && activePage.previousElementSibling) {
                activePage.previousElementSibling.click();
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => {
            const activePage = document.querySelector('.page-number.active');
            if (activePage && activePage.nextElementSibling) {
                activePage.nextElementSibling.click();
            }
        });
    }

    // Fix any form display issues by ensuring all modal elements are properly initialized
    const movieModal = document.getElementById('movie-modal');
    const categoryModal = document.getElementById('category-modal');
    const userModal = document.getElementById('user-modal');
    const confirmModal = document.getElementById('confirm-modal');

    // Initialize modals if they exist
    if (movieModal) initializeModal(movieModal);
    if (categoryModal) initializeModal(categoryModal);
    if (userModal) initializeModal(userModal);
    if (confirmModal) initializeModal(confirmModal);

    // Add poster style selector functionality
    const posterStyleSelect = document.getElementById('poster-style');
    if (posterStyleSelect) {
        posterStyleSelect.addEventListener('change', function () {
            updatePosterPreview(this.value);
        });
    }

    // Handle poster URL input for preview
    const posterUrlInput = document.getElementById('poster-url');
    if (posterUrlInput) {
        posterUrlInput.addEventListener('input', function () {
            updatePosterPreview(this.value);
        });
    }

    // Function to update the poster preview based on URL
    function updatePosterPreview(imageUrl) {
        const previewContainer = document.getElementById('poster-preview');
        if (previewContainer) {
            const previewImage = previewContainer.querySelector('img');

            if (imageUrl && isValidUrl(imageUrl)) {
                previewImage.src = imageUrl;
            } else {
                // Use default placeholder if URL is invalid
                previewImage.src = 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg';
            }
        }
    }

    // Check if URL is valid
    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Admin Login Functionality
    const adminLoginOverlay = document.getElementById('admin-login');
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('admin-password');
    const loginError = document.getElementById('login-error');

    // Check if already logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        adminLoginOverlay.style.display = 'none';
    }

    // Handle login form submission
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const password = passwordInput.value.trim();

        // Check password
        if (password === 'admin001') {
            // Correct password
            sessionStorage.setItem('adminLoggedIn', 'true');
            adminLoginOverlay.style.display = 'none';
            loginError.style.display = 'none';
        } else {
            // Incorrect password
            loginError.style.display = 'block';
            passwordInput.value = '';
            passwordInput.focus();
        }
    });
});

// Helper functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');

        // Reset form if opening add modal
        if (modalId === 'movie-modal') {
            const titleElement = document.getElementById('movie-modal-title');
            if (titleElement && titleElement.textContent.includes('Add')) {
                document.getElementById('movie-form').reset();
                // Reset poster preview to placeholder
                const preview = document.getElementById('poster-preview').querySelector('img');
                if (preview) preview.src = 'images/placeholder-poster.jpg';
                document.getElementById('file-name').textContent = 'No file chosen';
            }
        }
    }
}

function getItemType(button) {
    const parentRow = button.closest('tr');

    if (parentRow.closest('#movies-table-body')) {
        return 'movie';
    } else if (parentRow.closest('#categories-table-body')) {
        return 'category';
    } else if (parentRow.closest('#users-table-body')) {
        return 'user';
    } else if (parentRow.closest('#comments-table-body')) {
        return 'comment';
    }

    return 'item';
}

function populateMovieForm(movieId, row) {
    if (row) {
        const title = row.querySelector('td:nth-child(3)').textContent;
        const year = row.querySelector('td:nth-child(4)').textContent;
        const genres = row.querySelector('td:nth-child(5)').textContent.split(', ');
        const rating = row.querySelector('td:nth-child(6)').textContent;
        const status = row.querySelector('.status').classList.contains('status-active') ? 'active' :
            row.querySelector('.status').classList.contains('status-featured') ? 'featured' : 'inactive';

        // Get poster image URL
        const posterImg = row.querySelector('td:nth-child(2) img');
        const posterUrl = posterImg ? posterImg.src : '';

        // Set form values
        document.getElementById('movie-title-input').value = title;
        document.getElementById('movie-year').value = year;
        document.getElementById('movie-rating').value = rating;
        document.getElementById('movie-status').value = status;

        // Set poster URL and update preview
        const posterUrlInput = document.getElementById('poster-url');
        if (posterUrlInput && posterUrl) {
            posterUrlInput.value = posterUrl;
        }

        // Update poster preview
        const previewContainer = document.getElementById('poster-preview');
        if (previewContainer) {
            const previewImg = previewContainer.querySelector('img');
            if (previewImg && posterUrl) {
                previewImg.src = posterUrl;
            }
        }

        // Set genres (multi-select)
        const genreSelect = document.getElementById('movie-genres');
        if (genreSelect) {
            Array.from(genreSelect.options).forEach(option => {
                option.selected = genres.some(genre => genre.toLowerCase().includes(option.value.toLowerCase()));
            });
        }

        // For demo purposes, set some placeholder values for fields we don't have data for
        document.getElementById('movie-duration').value = '120'; // Placeholder duration
        document.getElementById('movie-plot').value = 'This is a placeholder plot summary for ' + title + '.';
        document.getElementById('movie-sources').value = 'https://example.com/movies/' + title.toLowerCase().replace(/\s+/g, '-');

        // Reset file upload field
        document.getElementById('file-name').textContent = 'No file chosen';
    }
}

function populateCategoryForm(categoryId, row) {
    const name = row.querySelector('td:nth-child(3)').textContent;
    document.getElementById('category-name').value = name;
}

function populateUserForm(userId, row) {
    const name = row.querySelector('td:nth-child(3)').textContent;
    const email = row.querySelector('td:nth-child(4)').textContent;
    const role = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
    const status = row.querySelector('.status').textContent.toLowerCase();

    document.getElementById('user-name').value = name;
    document.getElementById('user-email').value = email;

    // Set user role
    const roleSelect = document.getElementById('user-role');
    for (let i = 0; i < roleSelect.options.length; i++) {
        if (roleSelect.options[i].value === role.toLowerCase()) {
            roleSelect.selectedIndex = i;
            break;
        }
    }

    // Set status
    const statusSelect = document.getElementById('user-status');
    for (let i = 0; i < statusSelect.options.length; i++) {
        if (statusSelect.options[i].value === status) {
            statusSelect.selectedIndex = i;
            break;
        }
    }

    // Clear password for editing (would be handled differently in a real app)
    document.getElementById('user-password').value = '';
    document.getElementById('user-password').placeholder = 'Leave blank to keep current password';
}

function deleteItem(itemId, itemType) {
    // In a real app, this would send a request to the server
    console.log(`Deleting ${itemType} with ID: ${itemId}`);

    // For demo purposes, just remove the row from the table
    const button = document.querySelector(`.delete-btn[data-id="${itemId}"]`);
    if (button) {
        const row = button.closest('tr');
        if (row) {
            row.remove();
        }
    }

    // Show a success message
    alert(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} deleted successfully!`);
}

function approveComment(commentId) {
    // In a real app, this would send a request to the server
    console.log(`Approving comment with ID: ${commentId}`);

    // For demo purposes, update the UI
    const button = document.querySelector(`.approve-btn[data-id="${commentId}"]`);
    if (button) {
        const row = button.closest('tr');
        if (row) {
            const statusCell = row.querySelector('td:nth-child(6)');
            const actionsCell = row.querySelector('.actions');

            if (statusCell) {
                statusCell.innerHTML = '<span class="status status-approved">Approved</span>';
            }

            if (actionsCell) {
                // Remove approve/reject buttons and add edit/delete
                actionsCell.innerHTML = `
                    <button class="action-btn edit-btn" data-id="${commentId}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" data-id="${commentId}"><i class="fas fa-trash"></i></button>
                `;
            }
        }
    }
}

function rejectComment(commentId) {
    // In a real app, this would send a request to the server
    console.log(`Rejecting comment with ID: ${commentId}`);

    // For demo purposes, remove the comment from the table
    const button = document.querySelector(`.reject-btn[data-id="${commentId}"]`);
    if (button) {
        const row = button.closest('tr');
        if (row) {
            row.remove();
        }
    }
}

function saveMovie() {
    const title = document.getElementById('movie-title-input').value;
    const year = document.getElementById('movie-year').value;
    const duration = document.getElementById('movie-duration').value;
    const rating = document.getElementById('movie-rating').value;
    const status = document.getElementById('movie-status').value;

    // Get poster URL - either from input or from image preview
    const posterUrlInput = document.getElementById('poster-url');
    const previewImg = document.getElementById('poster-preview').querySelector('img');
    const posterUrl = posterUrlInput.value || (previewImg ? previewImg.src : '');

    // Get selected genres
    const genreSelect = document.getElementById('movie-genres');
    const selectedGenres = Array.from(genreSelect.selectedOptions).map(option => option.text);
    const genreStr = selectedGenres.join(', ');

    // For demo purposes, we'll just add a new row to the table
    const table = document.getElementById('movies-table-body');
    if (table) {
        // Get the last ID and increment by 1
        const rows = table.querySelectorAll('tr');
        const lastRow = rows[rows.length - 1];
        const lastId = lastRow ? parseInt(lastRow.querySelector('td:first-child').textContent) : 0;
        const newId = lastId + 1;

        // Create new row
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${newId}</td>
            <td><img src="${posterUrl}" alt="${title}" width="50" height="75" style="object-fit: cover; border-radius: 4px;"></td>
            <td>${title}</td>
            <td>${year}</td>
            <td>${genreStr}</td>
            <td>${rating}</td>
            <td><span class="status status-${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
            <td class="actions">
                <button class="action-btn edit-btn" data-id="${newId}"><i class="fas fa-edit"></i></button>
                <button class="action-btn delete-btn" data-id="${newId}"><i class="fas fa-trash"></i></button>
                <button class="action-btn view-btn" data-id="${newId}"><i class="fas fa-eye"></i></button>
            </td>
        `;

        // Add new row to table
        table.appendChild(newRow);

        // Close the modal
        document.getElementById('movie-modal').classList.remove('active');

        // Add event listeners to the new buttons
        const newEditBtn = newRow.querySelector('.edit-btn');
        const newDeleteBtn = newRow.querySelector('.delete-btn');
        const newViewBtn = newRow.querySelector('.view-btn');

        if (newEditBtn) {
            newEditBtn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                document.getElementById('movie-modal-title').textContent = 'Edit Movie';
                populateMovieForm(id, this.closest('tr'));
                openModal('movie-modal');
            });
        }

        if (newDeleteBtn) {
            newDeleteBtn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                document.getElementById('confirm-message').textContent = 'Are you sure you want to delete this movie?';

                const confirmYesBtn = document.getElementById('confirm-yes');
                confirmYesBtn.onclick = function () {
                    deleteItem(id, 'movie');
                    document.getElementById('confirm-modal').classList.remove('active');
                };

                openModal('confirm-modal');
            });
        }

        if (newViewBtn) {
            newViewBtn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                window.location.href = `movie.html?id=${id}`;
            });
        }
    }
}

function saveCategory() {
    // In a real app, this would send form data to the server
    console.log('Saving category...');

    // Get form values
    const name = document.getElementById('category-name').value;

    // Log the collected data (for demo purposes)
    console.log({ name });

    // Close the modal
    document.getElementById('category-modal').classList.remove('active');

    // Show success message
    alert('Category saved successfully!');

    // In a real app, this would refresh the categories list
}

function saveUser() {
    // In a real app, this would send form data to the server
    console.log('Saving user...');

    // Get form values
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;
    const role = document.getElementById('user-role').value;
    const status = document.getElementById('user-status').value;

    // Log the collected data (for demo purposes)
    console.log({
        name,
        email,
        password: password ? '[REDACTED]' : '[UNCHANGED]',
        role,
        status
    });

    // Close the modal
    document.getElementById('user-modal').classList.remove('active');

    // Show success message
    alert('User saved successfully!');

    // In a real app, this would refresh the users list
}

function saveSettings() {
    // In a real app, this would send form data to the server
    console.log('Saving settings...');

    // Get form values
    const siteTitle = document.getElementById('site-title').value;
    const siteDescription = document.getElementById('site-description').value;
    const moviesPerPage = document.getElementById('movies-per-page').value;
    const featuredCount = document.getElementById('featured-count').value;
    const apiKey = document.getElementById('api-key').value;
    const apiEndpoint = document.getElementById('api-endpoint').value;
    const facebookUrl = document.getElementById('facebook-url').value;
    const twitterUrl = document.getElementById('twitter-url').value;
    const instagramUrl = document.getElementById('instagram-url').value;

    // Log the collected data (for demo purposes)
    console.log({
        siteTitle,
        siteDescription,
        moviesPerPage,
        featuredCount,
        apiKey,
        apiEndpoint,
        socialMedia: {
            facebook: facebookUrl,
            twitter: twitterUrl,
            instagram: instagramUrl
        }
    });

    // Show success message
    alert('Settings saved successfully!');
}

function applyFilters() {
    // In a real app, this would filter the data based on selected criteria
    console.log('Applying filters...');

    // Get filter values
    const category = document.getElementById('filter-category')?.value;
    const status = document.getElementById('filter-status')?.value;
    const role = document.getElementById('filter-role')?.value;
    const commentStatus = document.getElementById('filter-comment-status')?.value;
    const movieSearchQuery = document.getElementById('movie-search')?.value.toLowerCase();
    const userSearchQuery = document.getElementById('user-search')?.value.toLowerCase();
    const commentSearchQuery = document.getElementById('comment-search')?.value.toLowerCase();

    console.log({
        category,
        status,
        role,
        commentStatus,
        movieSearchQuery,
        userSearchQuery,
        commentSearchQuery
    });

    // For demo purposes, we'll just log the selected filters
    // In a real app, this would update the displayed data
}

// Function to initialize modal
function initializeModal(modal) {
    const closeButtons = modal.querySelectorAll('.modal-close, .modal-cancel');
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            modal.classList.remove('active');
        });
    });
} 