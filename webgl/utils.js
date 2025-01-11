function loadImageAndCreateTexture(regl, src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = src;
        image.onload = () => {
            const texture = regl.texture(image);
            resolve({
                texture,
                width: image.width,
                height: image.height,
            });
        };
        image.onerror = (err) => reject(err);
    });
}