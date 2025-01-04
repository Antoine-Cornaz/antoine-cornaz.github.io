

import { Game } from "./game.js";


// Initialize the application when the DOM is loaded
async function main() {
    const game = new Game();
    await game.init();
    game.prepare();
}

main();
