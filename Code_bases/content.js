const bookConfig = {
    title: "26 Tahun Cetya Bahagia Maitreya",
    favicon: "public/Assets/favicon.ico",
    headerText: "My Digital Book",
    defaultFlipSound: "Assets/flip.mp3",
    autoFlipDelay: 3000,
    globalBackgroundAudio: "Audio/LAGU BaoGuiDeFoTang Lagu.mp3",

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
