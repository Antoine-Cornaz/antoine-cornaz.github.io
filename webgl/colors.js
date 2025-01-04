// Utility function to convert hex color to RGB normalized values
const hexToRgba = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = ((bigint >> 16) & 255) / 255;
    const g = ((bigint >> 8) & 255) / 255;
    const b = (bigint & 255) / 255;
    return [r, g, b, 1];
};

export const COLORS = {
    white: hexToRgba('#FFFFFF'),
    sky: hexToRgba('#87CEEB'), // Light Sky Blue
    sea: hexToRgba('#006994'), // Dark Blue
    barrier: hexToRgba('#ffffff'), // White
    wall: hexToRgba('#ce702d'), // Orange
    floor: hexToRgba('#ce862d'), // Light Orange
    lightingColor: hexToRgba('#FFFFFF'),
    wood: hexToRgba('#A47449'),
    blueSky: hexToRgba('#87ceeb'),
};