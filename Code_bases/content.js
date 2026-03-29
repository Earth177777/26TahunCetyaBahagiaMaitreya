const bookConfig = {
    title: "26 Tahun Cetya Bahagia Maitreya",
    favicon: "public/Assets/favicon.ico",
    headerText: "My Digital Book",
    defaultFlipSound: "Assets/flip.mp3",
    
    // How many milliseconds to wait between pages when Auto-Flip is turned on (3000 = 3 seconds)
    autoFlipDelay: 3000, 

    globalBackgroundAudio: "Audio/LAGU BaoGuiDeFoTang Lagu.mp3",

    pages: [
        { type: "cover", src: "public/Pages/1.png" },

        { type: "page", src: "Assets/blank.png" },

        { type: "page", src: "public/Pages/2.png" },

        { type: "page", src: "public/Pages/3.png" },

        { type: "page", src: "public/Pages/4.png" },

        { type: "page", src: "public/Pages/5.png" },

        { type: "page", src: "public/Pages/6.png" },

        { type: "page", src: "public/Pages/7.png" },

        { type: "blank-hard", src: "public/Pages/8.png" },

        { type: "back-cover" },
    ]
};

window.bookConfig = bookConfig;
