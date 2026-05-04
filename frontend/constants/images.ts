import type { ImageSourcePropType } from 'react-native';

import { API_URL } from '@/lib/api';

/* Bundled image assets — sourced from the Yatara Ceylon website */

export const HeroImages = {
  dawn: require('@/assets/images/heroes/journey-dawn.webp'),
  dusk: require('@/assets/images/heroes/journey-dusk.webp'),
  sustainability: require('@/assets/images/heroes/sustainability-hero.webp'),
};

export const DestinationImages: Record<string, ImageSourcePropType> = {
  ella: require('@/assets/districts/ella.webp'),
  galle: require('@/assets/districts/galle.webp'),
  kandy: require('@/assets/districts/kandy.webp'),
  sigiriya: require('@/assets/districts/sigiriya.webp'),
  yala: require('@/assets/districts/yala.webp'),
};

export const PackageImages: Record<string, ImageSourcePropType> = {
  'adventure-and-highlands': require('@/assets/packages/adventure-and-highlands/hero.webp'),
  'ayurveda-wellness-sanctuary': require('@/assets/packages/ayurveda-wellness-sanctuary-hero.webp'),
  'ceylon-grand-circuit': require('@/assets/packages/ceylon-grand-circuit-hero.png'),
  'colombo-city-coastal-weekend': require('@/assets/packages/colombo-city-coastal-weekend-hero.webp'),
  'cultural-triangle-express': require('@/assets/packages/cultural-triangle-express-hero.webp'),
  'deep-dive-into-the-wild': require('@/assets/packages/deep-dive-into-the-wild-hero.webp'),
  'east-coast-marine-days': require('@/assets/packages/east-coast-marine-days-hero.webp'),
  'east-coast-summer-escape': require('@/assets/packages/east-coast-summer-escape-hero.webp'),
  'east-coast-surf-and-sun': require('@/assets/packages/east-coast-surf-and-sun/hero.webp'),
  'family-escape-in-paradise': require('@/assets/packages/family-escape-in-paradise-hero.webp'),
  'heritage-triangle-private-edition': require('@/assets/packages/heritage-triangle-private-edition-hero.webp'),
  'hill-country-tea-rail-retreat': require('@/assets/packages/hill-country-tea-rail-retreat-hero.png'),
  'honeymoon-private-villa-experiences': require('@/assets/packages/honeymoon-private-villa-experiences-hero.webp'),
  'luxe-rail-villa-journey': require('@/assets/packages/luxe-rail-villa-journey-hero.webp'),
  'luxury-sri-lanka-in-10-days': require('@/assets/packages/luxury-sri-lanka-in-10-days-hero.webp'),
  'photographers-golden-hours': require('@/assets/packages/photographers-golden-hours-hero.webp'),
  'quick-escape-to-the-hills': require('@/assets/packages/quick-escape-to-the-hills-hero.webp'),
  'ramayana-trail': require('@/assets/packages/ramayana-trail-deluxe-hero.webp'),
  'ramayana-trail-deluxe': require('@/assets/packages/ramayana-trail-deluxe-hero.webp'),
  'tea-trails-waterfalls': require('@/assets/packages/tea-trails-waterfalls-hero.webp'),
  'wellness-reset-ayurveda-lite': require('@/assets/packages/wellness-reset-ayurveda-lite-hero.webp'),
  'whale-coast-galle-fort': require('@/assets/packages/whale-coast-galle-fort-hero.webp'),
  'wildlife-coastal-luxe': require('@/assets/packages/wildlife-coastal-luxe-hero.webp'),
};

export const VehicleImages: Record<string, ImageSourcePropType> = {
  'city-sedan': require('@/assets/vehicles/city-sedan.png'),
  'city-suv': require('@/assets/vehicles/city-suv.png'),
  'classic-car': require('@/assets/vehicles/classic-car.png'),
  'executive-sedan': require('@/assets/vehicles/executive-sedan.png'),
  'executive-van': require('@/assets/vehicles/executive-van.png'),
  'luxury-suv': require('@/assets/vehicles/luxury-suv.png'),
  'mini-coach': require('@/assets/vehicles/mini-coach.png'),
  'premium-van': require('@/assets/vehicles/premium-van.png'),
  'ultra-suv': require('@/assets/vehicles/ultra-suv.png'),
};

function slugify(value?: string) {
  return (value || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getAbsoluteUploadUrl(value: string) {
  if (!value) return undefined;
  const apiBase = API_URL.replace(/\/api\/?$/, '');
  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      if ((url.hostname === 'localhost' || url.hostname === '127.0.0.1') && url.pathname.startsWith('/uploads/')) {
        return `${apiBase}${url.pathname}`;
      }
    } catch {
      return value;
    }
    return value;
  }
  if (value.startsWith('/uploads/')) {
    return `${apiBase}${value}`;
  }
  return undefined;
}

function getUploadedImage(images?: string[]) {
  const uploadUrl = images?.find((value) => value.includes('/uploads/') || value.startsWith('/uploads/'));
  const absoluteUrl = uploadUrl ? getAbsoluteUploadUrl(uploadUrl) : undefined;
  return absoluteUrl ? { uri: absoluteUrl } : undefined;
}

function getFirstRemoteImage(images?: string[]) {
  const imageUrl = images?.map(getAbsoluteUploadUrl).find(Boolean);
  return imageUrl ? { uri: imageUrl } : undefined;
}

export function getPackageImage(item: { title?: string; slug?: string; style?: string; images?: string[] }): ImageSourcePropType {
  const uploaded = getUploadedImage(item.images);
  if (uploaded) return uploaded;

  const slug = item.slug || slugify(item.title);
  const local = PackageImages[slug];
  if (local) return local;

  const style = slugify(item.style);
  const styleFallbacks: Record<string, ImageSourcePropType> = {
    adventure: PackageImages['adventure-and-highlands'],
    beach: PackageImages['whale-coast-galle-fort'],
    cultural: PackageImages['cultural-triangle-express'],
    heritage: PackageImages['heritage-triangle-private-edition'],
    hillcountry: PackageImages['hill-country-tea-rail-retreat'],
    luxury: PackageImages['luxury-sri-lanka-in-10-days'],
    marine: PackageImages['east-coast-marine-days'],
    wellness: PackageImages['ayurveda-wellness-sanctuary'],
    wildlife: PackageImages['wildlife-coastal-luxe'],
  };
  return styleFallbacks[style] || getFirstRemoteImage(item.images) || HeroImages.dawn;
}

export function getDestinationImage(item: { title?: string; slug?: string; images?: string[] }): ImageSourcePropType {
  const local = DestinationImages[item.slug || slugify(item.title)];
  return getUploadedImage(item.images) || local || getFirstRemoteImage(item.images) || HeroImages.dawn;
}

export function getVehicleImage(item: { type?: string; model?: string; images?: string[] }): ImageSourcePropType {
  const model = slugify(item.model);
  if (model.includes('hiace') || model.includes('van')) return VehicleImages['premium-van'];
  if (model.includes('coach') || model.includes('bus')) return VehicleImages['mini-coach'];
  if (model.includes('land-cruiser') || model.includes('prado') || model.includes('suv')) return VehicleImages['luxury-suv'];
  if (model.includes('sedan') || model.includes('camry') || model.includes('premio')) return VehicleImages['executive-sedan'];

  const type = slugify(item.type);
  const typeFallbacks: Record<string, ImageSourcePropType> = {
    bus: VehicleImages['mini-coach'],
    luxury: VehicleImages['ultra-suv'],
    sedan: VehicleImages['city-sedan'],
    suv: VehicleImages['city-suv'],
    van: VehicleImages['executive-van'],
  };
  return getUploadedImage(item.images) || typeFallbacks[type] || getFirstRemoteImage(item.images) || VehicleImages['city-sedan'];
}
