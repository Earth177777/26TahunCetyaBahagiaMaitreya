# How to Edit Your Digital Book

This guide explains how to customize your Digital Book by editing the `Code_bases/content.js` file. You can change everything from the website title to the individual pages and their specific audio files without touching any core code!

## 1. Opening the Configuration File
Locate the `content.js` file inside the `Code_bases` folder. You can open it with any standard text editor (like Notepad on Windows, TextEdit on Mac, or VS Code).

## 2. Global Settings
At the top of the file, you will find the **Global Settings**. These control the general look and feel of your book outside of the pages themselves:

```javascript
// Example from content.js
title: "Digital Ebook", 
favicon: "public/Assets/favicon.ico", 
headerText: "My Digital Book", 
defaultFlipSound: "Audio/page-flip-01a.mp3", 
```

- **`title`**: This is the text that appears on the browser tab when someone opens your book.
- **`favicon`**: This is the small icon that appears next to the title on the browser tab. Ensure the path points to an actual `.ico` or `.png` file.
- **`headerText`**: This is the text displayed on the top-left of the navigation bar above the book.
- **`defaultFlipSound`**: This is the audio file that plays automatically every time a user turns a standard page.

## 3. Changing Pages and Images
To add, remove, or change pages, look at the `pages: [...]` list. Every line inside this list represents a single page in your book, starting from the front cover and ending with the back cover.

To add a normal page, use:
```javascript
{ type: "page", src: "public/Pages/YOUR_IMAGE_NAME.png" },
```
*Tip: Place all your new images (PNG, JPG, or WEBP) into the `Code_bases/public/Pages/` folder so you can keep everything organized!*

### Special Page Types
Depending on where the page is in the book, you can assign it a special `type` to make the physics engine treat it differently:
- **`cover`**: Use this for your very first page. It turns it into a hard, thick 3D cover board. 
- **`back-cover`**: Use this for the very last page of your book.
- **`blank-hard`**: Creates a thick, blank cardboard page (useful for the inside covers).

## 4. Adding Per-Page Audio (Narration or Music)
If you want a specific page to play a voiceover, ambient music, or a custom sound effect when the reader lands on it, you can add an `audio` property to that page! 

```javascript
{ type: "page", src: "public/Pages/3.png", audio: "Audio/my-narration.mp3" },
```
- When the reader turns **to** this page, your custom audio (`my-narration.mp3`) will automatically play.
- If the reader turns **away** from this page, the audio will automatically pause and stop instantly, ensuring sounds never overlap! 
- *Make sure to place your custom audio files in the `Code_bases/Audio/` folder.*

## 5. Saving and Viewing
Once you have made your text or path changes in `content.js`:
1. Save the file.
2. Go to the main folder and double-click the large `digitalbook.html` file to launch and test your totally customized offline book!
