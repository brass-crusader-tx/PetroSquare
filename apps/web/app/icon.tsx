import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#3B82F6',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2L2 9V23L16 30L30 23V9L16 2Z" fill="#0F172A" stroke="#3B82F6" strokeWidth="2"/>
            <path d="M16 8L8 12V20L16 24L24 20V12L16 8Z" fill="#1E293B" stroke="#3B82F6" strokeWidth="1"/>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
