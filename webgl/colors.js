// Utility function to convert hex color to RGB normalized values
const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;
    return [r, g, b];
};

export const colors = {
    sky: hexToRgb('#87CEEB'), // Light Sky Blue
    water: hexToRgb('#006994'), // Dark Blue
    barrier: hexToRgb('#ffffff'), // White
    text_color: hexToRgb('#2c3e50') // Dark Slate Gray
};
