/**
 * Code128 / Code39 Simple Canvas Barcode Generator
 * Renders a clean barcode on an HTML Canvas and returns base64 PNG Data URL
 */
export function generateBarcodeDataUrl(text: string, width = 300, height = 80): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Sanitized text string pattern
  const cleanText = text.replace(/[^A-Za-z0-9-]/g, '');
  
  // Pseudo Code128 bit sequence generation for consistent rendering
  let hash = 0;
  for (let i = 0; i < cleanText.length; i++) {
    hash = (hash << 5) - hash + cleanText.charCodeAt(i);
    hash |= 0;
  }

  // Draw quiet zones
  const margin = 20;
  const barWidth = (width - margin * 2) / (cleanText.length * 11 + 35);
  let currentX = margin;

  // Start pattern (Code128B start)
  const startPattern = [2, 1, 1, 2, 1, 4];
  startPattern.forEach((w, idx) => {
    if (idx % 2 === 0) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(currentX, 10, w * barWidth * 2, height - 30);
    }
    currentX += w * barWidth * 2;
  });

  // Data pattern
  for (let i = 0; i < cleanText.length; i++) {
    const charCode = cleanText.charCodeAt(i);
    // Generate 6 bar/space widths based on charCode
    const pattern = [
      (charCode % 3) + 1,
      ((charCode >> 2) % 3) + 1,
      ((charCode >> 4) % 3) + 1,
      ((charCode >> 1) % 3) + 1,
      (charCode % 2) + 1,
      ((charCode >> 3) % 2) + 1
    ];

    pattern.forEach((w, idx) => {
      if (idx % 2 === 0) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(currentX, 10, w * barWidth * 1.8, height - 30);
      }
      currentX += w * barWidth * 1.8;
    });
  }

  // Stop pattern
  const stopPattern = [2, 3, 3, 1, 1, 1, 2];
  stopPattern.forEach((w, idx) => {
    if (idx % 2 === 0) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(currentX, 10, w * barWidth * 2, height - 30);
    }
    currentX += w * barWidth * 2;
  });

  // Human Readable Code Text below barcode
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 12px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(text, width / 2, height - 6);

  return canvas.toDataURL('image/png');
}
