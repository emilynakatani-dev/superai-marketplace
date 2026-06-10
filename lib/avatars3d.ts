/** 3D avatar + downloadable asset-pack files per agent. Agents without a glb
 *  fall back to static art in the Avatar & Assets tab. */
export interface AvatarSheets {
  /** Full-resolution sprite sheets (the purchasable downloads). */
  stance: string;
  motion: string;
  /** Small webp previews shown in the tab. */
  stancePreview: string;
  motionPreview: string;
}

export interface Avatar3D {
  /** Rigged, animated GLB served from public/avatars-3d. */
  glb?: string;
  /** Concept-art poster shown while loading and as the no-WebGL fallback. */
  poster?: string;
  /** Lionclaw-ready pixel sprite sheets (stance poses + walk cycle). */
  sheets?: AvatarSheets;
}

const sheets = (id: string): AvatarSheets => ({
  stance: `/avatars-3d/sheets/${id}-stance.png`,
  motion: `/avatars-3d/sheets/${id}-motion.png`,
  stancePreview: `/avatars-3d/sheets/${id}-stance-preview.webp`,
  motionPreview: `/avatars-3d/sheets/${id}-motion-preview.webp`,
});

export const avatars3d: Record<string, Avatar3D> = {
  emily: {
    glb: "/avatars-3d/emily.glb",
    poster: "/avatars-3d/emily-poster.webp",
    sheets: sheets("emily"),
  },
  eugene: {
    glb: "/avatars-3d/eugene.glb",
    poster: "/avatars-3d/eugene-poster.webp",
    sheets: sheets("eugene"),
  },
  carlos: {
    glb: "/avatars-3d/carlos.glb",
    poster: "/avatars-3d/carlos-poster.webp",
    sheets: sheets("carlos"),
  },
  marcus: { sheets: sheets("marcus") },
  scarlett: { sheets: sheets("scarlett") },
};
