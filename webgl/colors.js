// Utility function to convert hex color to RGB normalized values
const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;
    return [r, g, b, 1.0];
};

export const colors = {
    white: hexToRgb('#FFFFFF'),
    sky: hexToRgb('#87CEEB'), // Light Sky Blue
    sea: hexToRgb('#006994'), // Dark Blue
    barrier: hexToRgb('#ffffff'), // White
    wall: hexToRgb('#ce702d'), // Orange
    floor: hexToRgb('#ce862d'), // Light Orange
    lightingColor: hexToRgb('#FFFFFF'),
    wood: hexToRgb('#A47449'),
    blueSky: hexToRgb('#87ceeb'),
};