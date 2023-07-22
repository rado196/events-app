import imgNoImage from '~assets/no-image.jpeg';

export { imgNoImage };

// export const currency = '$';
export const currency = '₽';

export const shadow = '0px 0px 10px 0px rgba(0,0,0,0.2)';

export function getImageUrl(imageUrl) {
  if (!imageUrl) {
    return imgNoImage;
  }

  return `${import.meta.env.VITE_STORAGE}/${imageUrl}`;
}

export function buildMapUrl(lat, lng) {
  return `https://www.google.com/maps/@${lat},${lng},15z`;
}
