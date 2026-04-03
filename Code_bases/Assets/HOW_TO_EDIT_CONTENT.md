# How to Edit Your Digital Book

This guide explains how to customize your Digital Book by editing the `Code_bases/content.js` file. You can change everything from the website title to the individual pages and their specific audio files without touching any core code!

## 1. Opening the Configuration File
Locate the `content.js` file inside the `Code_bases` folder. You can open it with any standard text editor (like Notepad on Windows, TextEdit on Mac, or VS Code).

## 2. Global Settings
At the top of the file, you will find the **Global Settings**. These control the general look and feel of your book outside of the pages themselves:

```javascript
// Example from content.js
title: "26 Tahun Cetya Bahagia Maitreya",
headerText: "慧樂佛堂 - 26 Tahun Cetya Bahagia Maitreya",
defaultFlipSound: "Assets/flip.mp3",
autoFlipDelay: 3000,
globalBackgroundAudio: "Audio/LAGU BaoGuiDeFoTang Lagu.mp3",
pageTitle: "26 Tahun Cetya Bahagia Maitreya",
```

- **`title`**: The title of your book used in various places.
- **`headerText`**: This is the text displayed on the top-left of the navigation bar above the book.
- **`defaultFlipSound`**: This is the audio file that plays automatically every time a user turns a standard page.
- **`autoFlipDelay`**: This controls the speed of the automatic slideshow (Auto-Scroll) feature. The number is in milliseconds. `3000` means it will wait 3 seconds before automatically turning to the next page. Change it to `5000` for 5 seconds, etc.
- **`globalBackgroundAudio`**: This is the background music that plays seamlessly throughout the entire book on an endless loop. *(Note: Browsers block sound natively until a user interacts with the page. The background music will completely hide itself and then instantly autoplay the very first time the reader clicks or swipes the book!)*
- **`pageTitle`**: This is the text that appears on the browser tab when someone opens your book. It updates dynamically when the page loads.

## 3. Social Media Meta Tags (Open Graph & Twitter)
When you share your digital book on social media platforms like WhatsApp, Facebook, Twitter, or LinkedIn, the following meta tags control how your link appears:

### Edit in HTML Files
These settings are located in both `index.html` and `Code_bases/content.html` in the `<head>` section:

```html
<meta property="og:title" content="Your Book Title" />
<meta property="og:description" content="Your Book Description" />
<meta property="og:image" content="http://yoursite.com/path/to/image.webp" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="http://yoursite.com/path/to/image.webp" />
```

- **`og:title`**: The title that appears when sharing on Facebook, LinkedIn, etc.
- **`og:description`**: The description text shown in the preview.
- **`og:image`**: The image URL that appears in the social media preview (must be a full URL, not a relative path).
- **`og:type`**: The content type (usually `website` for digital books).
- **`twitter:card`**: Controls how the link appears on Twitter (`summary_large_image` shows the preview image).
- **`twitter:image`**: The image URL for Twitter shares.

**Important**: These must be **static values in the HTML** for social media crawlers to read them correctly. Social media bots do not execute JavaScript.

## 4. Favicon
The favicon (small icon on the browser tab) is configured in both `index.html` and `Code_bases/content.html`:

```html
<link rel="icon" type="image/x-icon" href="Code_bases/public/Assets/favicon.ico" />
```

To change the favicon:
1. Replace the image file at `Code_bases/public/Assets/favicon.ico` (or create a new `.ico` file in that location)
2. The favicon automatically updates on page reload (you may need to clear browser cache with Cmd+Shift+R on Mac or Ctrl+Shift+R on Windows)

## 5. Changing Pages and Images
To add, remove, or change pages, look at the `pages: [...]` list. Every line inside this list represents a single page in your book, starting from the front cover and ending with the back cover.

To add a normal page, use:
```javascript
{ type: "page", src: "Pages/YOUR_IMAGE_NAME.png" },
```
*Tip: Place all your new images (PNG, JPG, or WEBP) into the appropriate designated folder (e.g. `Pages/` or `Assets/`) so you can keep everything organized!*

### Special Page Types
Depending on where the page is in the book, you can assign it a special `type` to make the physics engine treat it differently:
- **`cover`**: Use this for your very first page. It turns it into a hard, thick 3D cover board. 
- **`back-cover`**: Use this for the very last page of your book.
- **`blank-hard`**: Creates a thick, blank cardboard page (useful for the inside covers).

## 6. Advanced Audio Settings (Narration, Background Music, and Overlapping)
You can assign specific audio files (`audio: ...`) to any page. The system is incredibly smart and handles everything automatically:

### Adding Voiceover or Music to a Specific Page
```javascript
{ type: "page", src: "Pages/3.png", audio: "Audio/my-narration.mp3" },
```
- When the reader turns **to** this page, your custom audio will automatically play.
- If the reader turns **away** from this page, the audio will automatically pause and stop instantly, ensuring sounds never overlap! 

### Muting Background Music vs. Overlapping
By default, playing a specific page's narration will **automatically pause** your `globalBackgroundAudio` so that the voiceover can be heard clearly. However, if you want them to mix and play at the same time, set `overlapGlobalAudio: true`:
```javascript
{ type: "page", src: "Pages/4.png", audio: "Audio/sound-effect.mp3", overlapGlobalAudio: true },
```

### Continuous Audio Across Multiple Pages (Seamless Playback)
If you want an audio file (like a 3-minute narration) to keep playing smoothly while the user reads across **multiple consecutive pages**, simply assign the **exact same audio path** to every page in the sequence:
```javascript
{ type: "page", src: "Pages/5.png", audio: "Audio/long-story.mp3" },
{ type: "page", src: "Pages/6.png", audio: "Audio/long-story.mp3" },
{ type: "page", src: "Pages/7.png", audio: "Audio/long-story.mp3" },
```
The system recognizes it's the exact same file, and will stream it perfectly without restarting, stuttering, or pausing when the user turns the page!

## 7. Saving and Viewing
Once you have made your text or path changes in `content.js`:
1. Save the file.
2. Go to the main folder and double-click the large `digitalbook.html` file to launch and test your totally customized offline book!
