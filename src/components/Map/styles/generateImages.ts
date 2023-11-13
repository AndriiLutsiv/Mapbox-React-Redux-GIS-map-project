export const generateImages = (map: any, svg: string, layerId: string) => {
    return new Promise<void>((resolve, reject) => {
        const img = new Image(64, 64);
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

        img.onload = () => {
            const imageId = `svg-icon-${layerId}`; // Unique image ID for each layer
            if (map.hasImage(imageId)) {
                map.removeImage(imageId);  // Remove the existing image
            }
            map.addImage(imageId, img); // Add the new image
            resolve(imageId as any); // return the unique image ID
        };

        img.onerror = (error) => {
            reject(new Error('Failed to load the SVG image'));
        };
    });
};