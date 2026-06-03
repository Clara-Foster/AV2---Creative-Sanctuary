/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppState = 'ready' | 'processing' | 'protected';

export type SignatureStyle = 'hexadecimal' | 'binary' | 'matrix' | 'geometric';

export interface SignatureConfig {
  artistName: string;
  artworkTitle: string;
  creationYear: string;
  style: SignatureStyle;
  color: string;
  density: 'low' | 'medium' | 'high';
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'overlay';
}

export interface PresetArtwork {
  id: string;
  title: string;
  medium: string;
  year: string;
  imageUrl: string;
  artist: string;
}

export interface ProtectedRecord {
  id: string;
  title: string;
  artist: string;
  year: string;
  timestamp: string;
  hash: string;
  signatureStyle: SignatureStyle;
  originalImage: string;
}
