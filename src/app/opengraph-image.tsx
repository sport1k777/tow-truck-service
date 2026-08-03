import { ImageResponse } from 'next/og';
import { baseAppConfig } from '@/config/base.config';

export const runtime = 'edge';
export const alt = baseAppConfig.defaultSiteName;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 64,
          background: 'linear-gradient(135deg, #030712 0%, #0a1628 45%, #1e3a5f 100%)',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 28, color: '#7dd3fc', marginBottom: 16 }}>Евакуатор 24/7</div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, maxWidth: 900 }}>
          Швидка евакуація автомобілів по Україні
        </div>
        <div style={{ fontSize: 28, color: '#94a3b8', marginTop: 24, maxWidth: 800 }}>
          Онлайн-калькулятор · Миттєве замовлення · WhatsApp-підтвердження
        </div>
      </div>
    ),
    size,
  );
}
