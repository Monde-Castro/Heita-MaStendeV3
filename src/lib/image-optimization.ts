export function getOptimizedImageUrl(url: string, width: number = 800) {
  // If it's an Unsplash image, use their optimization API
  if (url.includes("unsplash.com")) {
    const baseUrl = url.split("?")[0];
    return `${baseUrl}?w=${width}&q=80&auto=format`;
  }

  // For other images, you could integrate with a service like Cloudinary or imgix
  return url;
}

export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}
