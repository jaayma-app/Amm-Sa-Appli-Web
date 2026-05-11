
const defaultLang = 'fr';

// Initialize language
function initializeLanguage() {
    // Only set default language if no language is stored
    if (!localStorage.getItem('lang')) {
        localStorage.setItem('lang', defaultLang);
    }
    
    // Get language from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    
    // Only update language from URL if it's valid and no language is stored
    if (urlLang && 
        ['en', 'bs', 'fr', 'wo'].includes(urlLang) && 
        !localStorage.getItem('lang')) {
        localStorage.setItem('lang', urlLang);
    }
    
    // Apply the language
    applyLanguage();
    updateActiveLanguage();
    initializeReadMoreButtons();
}

// Function to apply language to the page
function applyLanguage() {
    const currentLang = localStorage.getItem('lang');
    let translations;
    
    // Select appropriate translation file
    switch(currentLang) {
        case 'bs':
            translations = bs;
            break;
        case 'en':
            translations = en;
            break;
        case 'wo':
            translations = wo;
            break;
        default:
            translations = fr;
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
    
    // Update all elements with data-lang attribute
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[key]) {
            // Check if element has child elements with data-lang
            const hasTranslatableChildren = element.querySelector('[data-lang]');
            
            if (hasTranslatableChildren) {
                // Get all child nodes
                const childNodes = Array.from(element.childNodes);
                
                // Replace only the text nodes, preserve child elements
                childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.textContent = translations[key];
                    }
                });
            } else {
                // If no translatable children, update entire content
                element.textContent = translations[key];
            }
        }
    });

    initializeTypedText();
    initializeReadMoreButtons();
    translatePlaceholders();
}

function updateActiveLanguage() {
    const currentLang = localStorage.getItem('lang');
    
    // Remove active class from all language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to current language button
    const activeBtn = document.querySelector(`.lang-btn[onclick*="'${currentLang}'"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Function to change language
function changeLanguage(lang) {
    if (['en', 'bs', 'fr', 'wo'].includes(lang)) {
        localStorage.setItem('lang', lang);
        applyLanguage();
        updateActiveLanguage();
        initializeReadMoreButtons();
    }
}

/*==================== typed js ====================*/
function initializeTypedText() {
    const currentLang = localStorage.getItem('lang');
    let translations;
    
    // Select appropriate translation file
    switch(currentLang) {
        case 'en':
            translations = en;
            break;
        case 'wo':
            translations = wo;
            break;
        default:
            translations = fr;
    }

    // If there's an existing typed instance, destroy it
    if (window.typed) {
        window.typed.destroy();
    }

    // Create new typed instance
    window.typed = new Typed('.multiple-text', {
        strings: [
            translations['home-multi-1'],
            translations['home-multi-2'],
            translations['home-multi-3'],
            translations['home-multi-4']
        ],
        typeSpeed: 100,
        backSpeed: 100,
        backDelay: 1000,
        loop: true
    });
}

/*==================== read more====================*/
function initializeReadMoreButtons() {
    // First, remove existing event listeners to prevent duplicates
    document.querySelectorAll('.read-more-btn').forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });

    const currentLang = localStorage.getItem('lang');
    let translations;
    
    // Select appropriate translation file
    switch(currentLang) {
        case 'en':
            translations = en;
            break;
        case 'wo':
            translations = wo;
            break;
        default:
            translations = fr;
    }

    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', function() {
            const servicesBox = this.closest('.services-box');
            const content = servicesBox.querySelector('.content');
            const readMoreText = servicesBox.querySelector('.read-more-text');
            
            content.classList.toggle('expanded');
            
            // Toggle visibility of read-more-text
            if (readMoreText) {
                readMoreText.style.display = content.classList.contains('expanded') ? 'block' : 'none';
            }
            
            if (content.classList.contains('expanded')) {
                this.textContent = translations['service-button-less'];
                this.setAttribute('data-lang', 'service-button-less');
            } else {
                this.textContent = translations['service-button'];
                this.setAttribute('data-lang', 'service-button');
            }
        });
    });
}

function translatePlaceholders() {
    const currentLang = localStorage.getItem('lang');
    let translations;
    
    // Select appropriate translation file
    switch(currentLang) {
        case 'bs':
            translations = bs;
            break;
        case 'en':
            translations = en;
            break;
        case 'wo':
            translations = wo;
            break;
        default:
            translations = fr;
    }

    document.querySelectorAll('input[data-lang]').forEach(input => {
        const key = input.getAttribute('data-lang');
        if (translations[key]) {
            input.setAttribute('placeholder', translations[key]);
        }
    });
}

function setArticleData(identifier) {
    console.log('Function called with identifier:', identifier);
    
    const currentLang = localStorage.getItem('lang') || 'en';
    const titleElement = document.getElementById('title' + identifier);
    const descriptionElement = document.getElementById('description' + identifier);
    
    if (!titleElement || !descriptionElement) {
        console.error('Could not find elements for identifier:', identifier);
        return;
    }
    
    const data = {
        title: titleElement.textContent,
        description: descriptionElement.textContent
    };
    
    // Save to localStorage before navigation
    localStorage.setItem('articleData', JSON.stringify(data));
    console.log('Data saved to localStorage:', data);
    
    // Navigate to read-more page with language parameter
    window.location.href = `read-more.html?lang=${currentLang}`;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeLanguage);
