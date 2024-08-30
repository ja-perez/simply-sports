'use client';
import type { ImageLoaderProps } from 'next/image';

export default function myImageLoader({ src, width, quality } : ImageLoaderProps) {
    return `https://portfolios.talentsprint.com/team19/${src}?w=${width}&q=${quality || 75}`
}