/** Header geometry for the profile's cover and overlapping avatar, per layout. */
export const COVER_HEIGHT = { compact: 136, wide: 216 } as const;

export const AVATAR_SIZE = { compact: 112, wide: 160 } as const;

/** How far the avatar rises into the cover, as a share of its size. */
export const AVATAR_OVERLAP = 0.5;
