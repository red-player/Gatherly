function getRandomColor() {
    // Generate random color value
    let color = Math.floor(Math.random() * 0xFFFFFF).toString(16);
    // Pad with zeros to ensure 6 characters
    while (color.length < 6) {
        color = '0' + color;
    }
    return '#' + color;
}

function isDarkColor(color: string) {
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);

    // Calculate brightness using luminance formula
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // Return true if color is dark, false if light
    return luminance < 128;
}

export function generateBgFgColors() {
    let bgColor, fgColor;

    do {
        // Generate random color
        bgColor = getRandomColor();
        // Check if the generated color is dark
        if (isDarkColor(bgColor)) {
            // If dark, set font color to light
            fgColor = '#ffffff'; // White
        } else {
            // If light, set font color to dark
            fgColor = '#000000'; // Black
        }
    } while (Math.abs(parseInt(bgColor.substring(1), 16) - parseInt(fgColor.substring(1), 16)) < 100); // Ensure contrast

    return { bgColor, fgColor };
}
