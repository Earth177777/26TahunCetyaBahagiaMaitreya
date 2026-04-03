const bookConfig = {
    title: "26 Tahun Cetya Bahagia Maitreya",
    favicon: "public/Assets/favicon.ico",
    headerText: "慧樂佛堂 - 26 Tahun Cetya Bahagia Maitreya",
    defaultFlipSound: "Assets/flip.mp3",
    autoFlipDelay: 3000,
    globalBackgroundAudio: "Audio/LAGU BaoGuiDeFoTang Lagu.mp3",
    ogImage: "public/Pages/1.webp",
    ogTitle: "慧樂佛堂 - 26 Tahun Cetya Bahagia Maitreya",
    ogDescription: "26 Tahun Cetya Bahagia Maitreya 慧樂佛堂",
    ogType: "website",
    twitterCard: "summary_large_image",
    pageTitle: "26 Tahun Cetya Bahagia Maitreya",
    


    pages: [
        { type: "cover", src: "public/Pages/1.webp" },

        { type: "page", src: "public/Pages/2.webp" },

        { type: "page", src: "public/Pages/3.webp" },

        { type: "page", src: "public/Pages/4.webp" },

        { type: "page", src: "public/Pages/5.webp" },

        { type: "page", src: "public/Pages/6.webp" },

        { type: "page", src: "public/Pages/7.webp" },

        { type: "page", src: "public/Pages/8.webp" },

        { type: "page", src: "public/Pages/9.webp" },
        
        { type: "page", src: "public/Pages/10.webp" },

        { type: "blank-hard", src: "public/Pages/11.webp" },

        { type: "back-cover", src: "public/Pages/12.webp" },
    ]
};

window.bookConfig = bookConfig;

// Update meta tags and title dynamically
document.addEventListener('DOMContentLoaded', function() {
    // Set page title
    if (window.bookConfig.pageTitle) {
        document.title = window.bookConfig.pageTitle;
    }
    
    // Set OG meta tags
    const metaMappings = {
        'og:title': 'ogTitle',
        'og:description': 'ogDescription',
        'og:image': 'ogImage',
        'og:type': 'ogType'
    };
    
    Object.keys(metaMappings).forEach(property => {
        const configKey = metaMappings[property];
        const meta = document.querySelector(`meta[property="${property}"]`);
        if (meta && window.bookConfig[configKey]) {
            meta.setAttribute('content', window.bookConfig[configKey]);
        }
    });
    
    // Set Twitter meta tags
    const twitterMappings = {
        'twitter:card': 'twitterCard',
        'twitter:image': 'ogImage'  // Use same as OG image
    };
    
    Object.keys(twitterMappings).forEach(name => {
        const configKey = twitterMappings[name];
        const meta = document.querySelector(`meta[name="${name}"]`);
        if (meta && window.bookConfig[configKey]) {
            meta.setAttribute('content', window.bookConfig[configKey]);
        }
    });
});
