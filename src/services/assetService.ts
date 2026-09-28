import { AssetItem, KitDesign } from '../types/football';

/**
 * Generates an original SVG crest for a football club based on colors, initials, and shape
 */
export function generateClubBadgeSvg(
  name: string,
  primaryColor: string = '#DC2626',
  secondaryColor: string = '#FFFFFF',
  textColor: string = '#FFFFFF',
  shape: 'shield' | 'circle' | 'diamond' = 'shield'
): string {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  if (shape === 'circle') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <circle cx="50" cy="50" r="46" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="4"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="${secondaryColor}" stroke-width="1.5" stroke-dasharray="3,3"/>
      <polygon points="50,16 53,24 62,25 55,31 57,39 50,34 43,39 45,31 38,25 47,24" fill="${secondaryColor}"/>
      <text x="50" y="62" font-family="sans-serif" font-weight="900" font-size="22" fill="${textColor}" text-anchor="middle" letter-spacing="1">${initials}</text>
    </svg>`;
  }

  // Default Shield
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <path d="M 50,6 L 86,16 L 82,62 C 80,78 50,94 50,94 C 50,94 20,78 18,62 L 14,16 Z" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="3.5"/>
    <path d="M 50,14 L 78,22 L 75,58 C 73,71 50,84 50,84 C 50,84 27,71 25,58 L 22,22 Z" fill="none" stroke="${secondaryColor}" stroke-width="1.5" opacity="0.6"/>
    <path d="M 50,16 L 50,82" stroke="${secondaryColor}" stroke-width="2" opacity="0.3"/>
    <text x="50" y="58" font-family="sans-serif" font-weight="900" font-size="20" fill="${textColor}" text-anchor="middle" letter-spacing="1">${initials}</text>
  </svg>`;
}

/**
 * Generates an original geometric portrait avatar for players or coaches with zero copyright risk
 */
export function generatePersonAvatarSvg(
  name: string,
  hairColor: string = '#1E293B',
  skinTone: string = '#F6D8B8',
  kitColor: string = '#DC2626'
): string {
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const skinTones = ['#F6D8B8', '#D89564', '#995B36', '#59341C', '#E4B384'];
  const hairColors = ['#18181B', '#451A03', '#78350F', '#B45309', '#CBD5E1'];
  
  const chosenSkin = skinTones[hash % skinTones.length] || skinTone;
  const chosenHair = hairColors[(hash >> 2) % hairColors.length] || hairColor;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <rect width="100" height="100" rx="50" fill="#0F172A"/>
    <!-- Shoulders & Jersey -->
    <path d="M 15,100 C 15,75 35,68 50,68 C 65,68 85,75 85,100 Z" fill="${kitColor}"/>
    <polygon points="50,68 42,78 58,78" fill="#FFFFFF" opacity="0.8"/>
    <!-- Head & Neck -->
    <rect x="42" y="56" width="16" height="16" fill="${chosenSkin}"/>
    <circle cx="50" cy="42" r="22" fill="${chosenSkin}"/>
    <!-- Hair -->
    <path d="M 28,38 C 28,22 40,16 50,16 C 60,16 72,22 72,38 C 72,28 64,24 50,24 C 36,24 28,28 28,38 Z" fill="${chosenHair}"/>
    <!-- Eyes -->
    <circle cx="43" cy="40" r="2" fill="#0F172A"/>
    <circle cx="57" cy="40" r="2" fill="#0F172A"/>
    <!-- Subtle Smile -->
    <path d="M 45,50 Q 50,54 55,50" stroke="#0F172A" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  </svg>`;
}

/**
 * Generates an original Kit SVG with configurable pattern, sleeves, collar, and colors
 */
export function generateKitSvg(kit: KitDesign): string {
  const { primaryColor, secondaryColor, pattern, collarStyle, numberColor } = kit;

  let patternMarkup = '';
  if (pattern === 'stripes') {
    patternMarkup = `
      <rect x="36" y="24" width="8" height="56" fill="${secondaryColor}"/>
      <rect x="56" y="24" width="8" height="56" fill="${secondaryColor}"/>
    `;
  } else if (pattern === 'hoops') {
    patternMarkup = `
      <rect x="25" y="36" width="50" height="7" fill="${secondaryColor}"/>
      <rect x="25" y="50" width="50" height="7" fill="${secondaryColor}"/>
      <rect x="25" y="64" width="50" height="7" fill="${secondaryColor}"/>
    `;
  } else if (pattern === 'sash') {
    patternMarkup = `
      <polygon points="25,24 35,24 75,80 65,80" fill="${secondaryColor}"/>
    `;
  } else if (pattern === 'halves') {
    patternMarkup = `
      <rect x="50" y="24" width="25" height="56" fill="${secondaryColor}"/>
    `;
  }

  const collarMarkup =
    collarStyle === 'v-neck'
      ? `<polygon points="50,34 42,24 58,24" fill="${secondaryColor}"/>`
      : `<circle cx="50" cy="24" r="8" fill="none" stroke="${secondaryColor}" stroke-width="3"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <!-- Sleeves -->
    <polygon points="12,38 25,24 25,48 16,56" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="1.5"/>
    <polygon points="88,38 75,24 75,48 84,56" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="1.5"/>
    <!-- Body -->
    <rect x="25" y="24" width="50" height="56" rx="2" fill="${primaryColor}" stroke="${secondaryColor}" stroke-width="1.5"/>
    <!-- Pattern overlay -->
    ${patternMarkup}
    <!-- Collar -->
    ${collarMarkup}
    <!-- Number 10 placeholder -->
    <text x="50" y="58" font-family="sans-serif" font-weight="900" font-size="18" fill="${numberColor || '#FFFFFF'}" text-anchor="middle">10</text>
  </svg>`;
}

export const INITIAL_PRESET_ASSETS: AssetItem[] = [
  {
    id: 'ast_crest_london',
    name: 'London Monarchs Official Crest',
    type: 'badge',
    license: 'Original Generated',
    source: 'In-House Football Manager Studio Generator',
    createdAt: '2026-01-01',
    content: generateClubBadgeSvg('London Monarchs', '#DC2626', '#FFFFFF', '#FFFFFF', 'shield'),
  },
  {
    id: 'ast_crest_manc',
    name: 'Manchester Blue Official Crest',
    type: 'badge',
    license: 'Original Generated',
    source: 'In-House Football Manager Studio Generator',
    createdAt: '2026-01-01',
    content: generateClubBadgeSvg('Manchester Blue', '#0284C7', '#FFFFFF', '#FFFFFF', 'circle'),
  },
  {
    id: 'ast_crest_madrid',
    name: 'Madrid Royal Official Crest',
    type: 'badge',
    license: 'Original Generated',
    source: 'In-House Football Manager Studio Generator',
    createdAt: '2026-01-01',
    content: generateClubBadgeSvg('Madrid Royal', '#FFFFFF', '#FACC15', '#1E293B', 'shield'),
  },
  {
    id: 'ast_kit_home_default',
    name: 'Modern Home Kit Stripe Edition',
    type: 'kit',
    license: 'Original Generated',
    source: 'In-House Football Manager Kit Engine',
    createdAt: '2026-01-01',
    content: generateKitSvg({
      type: 'home',
      primaryColor: '#DC2626',
      secondaryColor: '#FFFFFF',
      accentColor: '#1E293B',
      pattern: 'stripes',
      collarStyle: 'v-neck',
      shortColor: '#FFFFFF',
      sockColor: '#DC2626',
      numberColor: '#FFFFFF',
    }),
  },
];
