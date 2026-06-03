/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PresetArtwork, ProtectedRecord } from './types';

export const PRESET_ARTWORKS: PresetArtwork[] = [
  {
    id: 'art-1',
    title: 'Pinheiros Sussurrantes',
    artist: 'Elena Vance',
    medium: 'Digital Watercolor',
    year: '2024',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuVMxKjWVR7PFdSFnlNYqYBiL11Xw9DuNn-w2B1qtxW81D-fyBc54o-2fKJXWNAoUJU2aW3PEhuvFQ6PDM-CB9fcaruhrMRanDEtt-75ig6JOE-ZNe8TbX6L33M5Ub7m9LwiLP9sPx6RCdp23wGCLp4jWMHxyAQfpIBmdcuFvHdvqghRlc5TZ6J4y5sQBXpQU30hhHW1Eta2_B7Oc7zt_j1K-OMdqQfjG_VjrXxBCL2hHfxdqDGgx6cwXoqxIf2uD7nTZ1afiPap0'
  },
  {
    id: 'art-2',
    title: 'Pétalas da Manhã',
    artist: 'Elena Vance',
    medium: 'Macro Digital Photography',
    year: '2024',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrJQ2FHwWaFCk-JkamAr2hbFQZPSNWo6Jka1G-KPuUBjrVXxN8f89q0s7ziDe51MsGh_JK9ihTDhGZABte4fzd14uTZk9rrVvd9HOCQ6GoxcmcyEnRXsnX-5q1WRqkgA-4wUD5a-9jOUUuKerPNNVxlgxGyrWUyOU_2pL0XHSXc2yN2u5GnWtjmg9bJduU9PXkygq35R9mIu6m-WpTmYrx2a3PPDPbq1eqwr86SgtH-7SpSSXbBY6isyK_S2Mai2lOD5jDd6oGRM0'
  },
  {
    id: 'art-3',
    title: 'Planícies Etéreas',
    artist: 'Henrique Souza',
    medium: 'Abstract Generative Art',
    year: '2023',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDw0JGoDi_Tbmj3xbinxUClQCDSUxBEXHmwG4bONw6G8E2j_173xT6Wm0YWbqHWGnzDdnOFUXubGRhi6_3saEEVaORYRvIN_sc5iFua7SA23ifI_ENpJfOouoDggWfNUc8vXist2Suvz74fkBMY2xROz_DakO5td3TBJfqnPKpssk55Hx9QKr7QgC6s66EhfV4WyKVyu93tKS981-ev0psKWpBgE0hPWoq9RLraFcSafINfaKJ4bgwEmJbGLoLIW3KBzRgm86Z5wtk'
  }
];

export const INITIAL_RECORDS: ProtectedRecord[] = [
  {
    id: 'rec-1',
    title: 'Pinheiros Sussurrantes',
    artist: 'Elena Vance',
    year: '2024',
    timestamp: '2026-05-29 14:15:32',
    hash: '0x1C4A5...9B22F',
    signatureStyle: 'geometric',
    originalImage: PRESET_ARTWORKS[0].imageUrl
  },
  {
    id: 'rec-2',
    title: 'Pétalas da Manhã',
    artist: 'Elena Vance',
    year: '2024',
    timestamp: '2026-05-29 18:22:10',
    hash: '0x71C0B...4E2A1',
    signatureStyle: 'hexadecimal',
    originalImage: PRESET_ARTWORKS[1].imageUrl
  }
];
