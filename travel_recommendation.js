
const imageMap = {
    "enter_your_image_for_sydney.jpg": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80",
    "enter_your_image_for_melbourne.jpg": "https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=600&q=80",
    "enter_your_image_for_tokyo.jpg": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
    "enter_your_image_for_kyoto.jpg": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    "enter_your_image_for_rio.jpg": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=600&q=80",
    "enter_your_image_for_sao-paulo.jpg": "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&w=600&q=80",
    "enter_your_image_for_angkor-wat.jpg": "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=600&q=80",
    "enter_your_image_for_taj-mahal.jpg": "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80",
    "enter_your_image_for_bora-bora.jpg": "https://images.unsplash.com/photo-1532408840957-031d8034aeef?auto=format&fit=crop&w=600&q=80",
    "enter_your_image_for_copacabana.jpg": "https://images.unsplash.com/photo-1590418606746-018840f9cd0f?auto=format&fit=crop&w=600&q=80"
};

function getImageUrl(url) {
    return imageMap[url] || url;
}


const sections = {
    home: document.getElementById('section-home'),
    about: document.getElementById('section-about'),
    contact: document.getElementById('section-contact'),
    results: document.getElementById('section-results')
};

const navLinks = {
    home: document.getElementById('nav-home'),
    about: document.getElementById('nav-about'),
    contact: document.getElementById('nav-contact')
};

let currentActiveSection = 'home';

function showSection(sectionName) {
    
    Object.values(sections).forEach(sec => sec.classList.add('hidden'));
    
    
    if (sections[sectionName]) {
        sections[sectionName].classList.remove('hidden');
    }
    
    
    Object.keys(navLinks).forEach(name => {
        if (name === sectionName) {
            navLinks[name].classList.add('active');
        } else {
            navLinks[name].classList.remove('active');
        }
    });
    
  
    if (sectionName !== 'results') {
        currentActiveSection = sectionName;
    }
}


navLinks.home.addEventListener('click', (e) => {
    e.preventDefault();
    showSection('home');
});

navLinks.about.addEventListener('click', (e) => {
    e.preventDefault();
    showSection('about');
});

navLinks.contact.addEventListener('click', (e) => {
    e.preventDefault();
    showSection('contact');
});


document.getElementById('footer-home').addEventListener('click', (e) => {
    e.preventDefault();
    showSection('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('footer-about').addEventListener('click', (e) => {
    e.preventDefault();
    showSection('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('footer-contact').addEventListener('click', (e) => {
    e.preventDefault();
    showSection('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


const searchInput = document.getElementById('search-input');
const btnSearch = document.getElementById('btn-search');
const btnClear = document.getElementById('btn-clear');
const searchResultsGrid = document.getElementById('search-results-grid');

function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
        alert('Please enter a destination or keyword (e.g., beach, temple, Japan).');
        return;
    }
    
    fetch('travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let results = [];
            
          
            if (query === 'beach' || query === 'beaches') {
                results = data.beaches;
            } else if (query === 'temple' || query === 'temples') {
                results = data.temples;
            } else if (query === 'country' || query === 'countries') {
                
                data.countries.forEach(country => {
                    results = results.concat(country.cities);
                });
            } else {
                
                const matchedCountry = data.countries.find(c => c.name.toLowerCase() === query);
                if (matchedCountry) {
                    results = matchedCountry.cities;
                } else {
                    
                    data.countries.forEach(country => {
                        country.cities.forEach(city => {
                            if (city.name.toLowerCase().includes(query) || city.description.toLowerCase().includes(query)) {
                                results.push(city);
                            }
                        });
                    });
                    
                    data.temples.forEach(temple => {
                        if (temple.name.toLowerCase().includes(query) || temple.description.toLowerCase().includes(query)) {
                            results.push(temple);
                        }
                    });
                    
                    data.beaches.forEach(beach => {
                        if (beach.name.toLowerCase().includes(query) || beach.description.toLowerCase().includes(query)) {
                            results.push(beach);
                        }
                    });
                }
            }
            
            displayResults(results);
        })
        .catch(error => {
            console.error('Error fetching travel recommendations:', error);
            alert('Failed to retrieve search results. Please try again.');
        });
}

function displayResults(results) {
    searchResultsGrid.innerHTML = '';
    
    if (results.length === 0) {
        searchResultsGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 40px 0; font-size: 18px; color: rgba(255, 255, 255, 0.75);">
                No travel recommendations found for this keyword. Try searching for "beach", "temple", or "Japan".
            </div>
        `;
    } else {
        results.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('result-card');
            
            card.innerHTML = `
                <img src="${getImageUrl(item.imageUrl)}" alt="${item.name}">
                <div class="result-card-content">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <button onclick="alert('Booking for ${item.name.replace(/'/g, "\\'")} is currently under construction!');">Book Now</button>
                </div>
            `;
            
            searchResultsGrid.appendChild(card);
        });
    }
    
    
    showSection('results');
}

function clearSearch() {
    searchInput.value = '';
    searchResultsGrid.innerHTML = '';
    showSection(currentActiveSection);
}


btnSearch.addEventListener('click', handleSearch);
btnClear.addEventListener('click', clearSearch);


searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});


showSection('home');
