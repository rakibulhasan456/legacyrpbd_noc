// Disable Right Click
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
}, false);

// Disable Keys
document.addEventListener("keydown", function (e) {

    // Disable F12
    if (e.key === "F12") {
        e.preventDefault();
        return false;
    }

    // Disable Ctrl+U
    if (e.ctrlKey && e.key.toLowerCase() === "u") {
        e.preventDefault();
        return false;
    }

    // Disable Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
        return false;
    }

    // Disable Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
        return false;
    }

    // Disable Ctrl+S
    if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        return false;
    }

    // Disable Ctrl+C
    if (e.ctrlKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        return false;
    }
});
