// Fetch listings data
async function fetchListings() {
    try {
        const response = await fetch('/data/listings.json');
        const data = await response.json();
        return data.listings;
    } catch (error) {
        console.error('Error fetching listings:', error);
        return [];
    }
}

// Format price to USD
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(price);
}

// Format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Create listing card HTML
function createListingCard(listing) {
    const amenitiesHtml = listing.amenities
        .slice(0, 3)
        .map(amenity => `
            <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                ${amenity}
            </span>
        `).join('');

    const extraAmenities = listing.amenities.length > 3 
        ? `<span class="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
             +${listing.amenities.length - 3} more
           </span>`
        : '';

    return `
        <div class="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div class="relative h-56 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80"
                    alt="${listing.title}"
                    class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div class="absolute top-4 left-4 flex gap-2">
                    ${listing.is_verified ? `
                        <div class="bg-white/90 backdrop-blur-sm text-patriot-blue px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-lg">
                            ✓ Verified
                        </div>
                    ` : ''}
                    ${listing.is_featured ? `
                        <div class="bg-patriot-red/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-lg">
                            ★ Featured
                        </div>
                    ` : ''}
                </div>
                <div class="absolute bottom-4 left-4">
                    <div class="bg-white/90 backdrop-blur-sm text-patriot-red px-3 py-1 rounded-full text-lg font-bold flex items-center shadow-lg">
                        ${formatPrice(listing.price)}
                    </div>
                </div>
            </div>

            <div class="p-6">
                <h3 class="text-xl font-bold text-navy mb-2 group-hover:text-patriot-blue transition-colors">
                    ${listing.title}
                </h3>
                
                <div class="space-y-2 mb-4">
                    <div class="flex items-center text-gray-600">
                        <span class="mr-2">📍</span>
                        <span class="text-sm">${listing.location}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                        <span class="mr-2">📅</span>
                        <span class="text-sm">${formatDate(listing.created_at)}</span>
                    </div>
                </div>

                <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                    ${listing.description}
                </p>

                <div class="flex flex-wrap gap-2 mb-4">
                    ${amenitiesHtml}
                    ${extraAmenities}
                </div>

                <button
                    onclick="showListingDetails(${JSON.stringify(listing).replace(/"/g, '&quot;')})"
                    class="w-full bg-navy text-white py-2 rounded-lg hover:bg-navy-light transition-colors flex items-center justify-center group-hover:bg-patriot-blue"
                >
                    View Details
                </button>
            </div>
        </div>
    `;
}

// Show listing details modal
function showListingDetails(listing) {
    const amenitiesHtml = listing.amenities
        .map(amenity => `
            <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                ${amenity}
            </span>
        `).join('');

    const modalHtml = `
        <div class="bg-white rounded-lg overflow-hidden max-w-3xl w-full">
            <div class="relative h-96">
                <img
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80"
                    alt="${listing.title}"
                    class="w-full h-full object-cover"
                />
                <button
                    onclick="closeListingDetails()"
                    class="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                >
                    <span class="text-gray-600 text-xl">×</span>
                </button>
            </div>

            <div class="p-8">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-2xl font-bold text-navy">${listing.title}</h2>
                    <div class="text-2xl font-bold text-patriot-red">
                        ${formatPrice(listing.price)}
                    </div>
                </div>

                <div class="space-y-4 mb-6">
                    <div class="flex items-center text-gray-600">
                        <span class="mr-2">📍</span>
                        <span>${listing.location}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                        <span class="mr-2">📅</span>
                        <span>Listed on ${formatDate(listing.created_at)}</span>
                    </div>
                </div>

                <p class="text-gray-600 mb-6">
                    ${listing.description}
                </p>

                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-navy mb-3">Amenities</h3>
                    <div class="flex flex-wrap gap-2">
                        ${amenitiesHtml}
                    </div>
                </div>

                <div class="flex gap-4">
                    <a href="mailto:support@lrvforum.com?subject=Inquiry about ${encodeURIComponent(listing.title)}"
                        class="flex-1 bg-patriot-blue text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-center"
                    >
                        Contact Owner
                    </a>
                    <button
                        onclick="closeListingDetails()"
                        class="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;

    const modal = document.createElement('div');
    modal.id = 'listing-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    modal.innerHTML = modalHtml;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Close listing details modal
function closeListingDetails() {
    const modal = document.getElementById('listing-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Filter listings based on search query
function filterListings(listings, query) {
    if (!query) return listings;
    
    query = query.toLowerCase();
    return listings.filter(listing => {
        return listing.title.toLowerCase().includes(query) ||
               listing.location.toLowerCase().includes(query) ||
               listing.description.toLowerCase().includes(query) ||
               listing.amenities.some(amenity => amenity.toLowerCase().includes(query));
    });
}

// Initialize listings display
async function initializeListings(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const listings = await fetchListings();
    let displayListings = listings;

    // Apply filters based on options
    if (options.featuredOnly) {
        displayListings = listings.filter(listing => listing.is_featured);
    }
    if (options.maxItems) {
        displayListings = displayListings.slice(0, options.maxItems);
    }
    if (options.type === 'rent') {
        displayListings = displayListings.filter(listing => listing.price <= 5000);
    }
    if (options.type === 'buy') {
        displayListings = displayListings.filter(listing => listing.price > 5000);
    }

    // Render listings
    container.innerHTML = displayListings
        .map(listing => createListingCard(listing))
        .join('');

    // Initialize search if search form exists
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value;
            const filteredListings = filterListings(listings, query);
            container.innerHTML = filteredListings
                .map(listing => createListingCard(listing))
                .join('');
        });
    }
}
