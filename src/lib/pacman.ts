export function drawPacman(
  ctx: CanvasRenderingContext2D,
  size: number,
  bearing: number,
  mouthOpen: number, // 0 to 1
  isGhost: boolean = false,
  isSelected: boolean = false
) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.4;

  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(((bearing - 90) * Math.PI) / 180);

  if (isGhost) {
    drawGhost(ctx, r);
  } else {
    if (isSelected) {
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 12;
    }

    const mouthAngle = mouthOpen * 0.8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, mouthAngle, Math.PI * 2 - mouthAngle);
    ctx.closePath();
    ctx.fillStyle = "#FFE000";
    ctx.fill();

    // Eye
    ctx.beginPath();
    ctx.arc(r * 0.2, -r * 0.35, r * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
  }

  ctx.restore();
}

function drawGhost(ctx: CanvasRenderingContext2D, r: number) {
  // Ghost body
  ctx.beginPath();
  ctx.arc(0, -r * 0.1, r, Math.PI, 0);
  ctx.lineTo(r, r * 0.6);

  // Wavy bottom
  const waves = 3;
  const waveWidth = (2 * r) / waves;
  for (let i = 0; i < waves; i++) {
    const x = r - i * waveWidth;
    ctx.quadraticCurveTo(
      x - waveWidth / 4,
      r * 0.9,
      x - waveWidth / 2,
      r * 0.6
    );
    ctx.quadraticCurveTo(
      x - (3 * waveWidth) / 4,
      r * 0.3,
      x - waveWidth,
      r * 0.6
    );
  }

  ctx.closePath();
  ctx.fillStyle = "#FF0000";
  ctx.fill();

  // Eyes
  for (const xOff of [-r * 0.3, r * 0.3]) {
    ctx.beginPath();
    ctx.arc(xOff, -r * 0.2, r * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = "#FFF";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(xOff + r * 0.05, -r * 0.2, r * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = "#00F";
    ctx.fill();
  }
}

export function drawPellet(
  ctx: CanvasRenderingContext2D,
  size: number,
  isPower: boolean = false
) {
  const cx = size / 2;
  const cy = size / 2;
  ctx.clearRect(0, 0, size, size);

  const r = isPower ? size * 0.35 : size * 0.15;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = isPower ? "#FFB8FF" : "#FFB897";
  ctx.fill();

  if (isPower) {
    ctx.shadowColor = "#FFB8FF";
    ctx.shadowBlur = 8;
    ctx.fill();
  }
}

export function drawCleanIcon(
  ctx: CanvasRenderingContext2D,
  size: number,
  bearing: number,
  isDelayed: boolean,
  isSelected: boolean
) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;

  ctx.clearRect(0, 0, size, size);

  // Glow ring for selected
  if (isSelected) {
    ctx.beginPath();
    ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
    ctx.strokeStyle = isDelayed ? "#FF6B6B" : "#00FF88";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = isDelayed ? "#FF6B6B" : "#00FF88";
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Main circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = isDelayed ? "#C0392B" : "#1A6B3C";
  ctx.fill();

  // Circle border
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = isDelayed ? "#FF6B6B" : "#2ECC71";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Direction arrow
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(((bearing - 90) * Math.PI) / 180);
  const aw = r * 0.35;
  const ah = r * 0.5;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.75);       // tip
  ctx.lineTo(-aw, -r * 0.2);     // left base
  ctx.lineTo(aw, -r * 0.2);      // right base
  ctx.closePath();
  ctx.fillStyle = isDelayed ? "#FF9999" : "#90EE90";
  ctx.fill();
  ctx.restore();
}

export function getOnTimeScore(delaySeconds: number): number {
  if (delaySeconds <= 60) return 100;
  if (delaySeconds >= 600) return 0;
  return Math.round(100 - ((delaySeconds - 60) / 540) * 100);
}

export function getDelayLabel(delaySeconds: number): string {
  if (delaySeconds <= 30) return "On time";
  const mins = Math.floor(delaySeconds / 60);
  const secs = delaySeconds % 60;
  if (mins === 0) return `+${secs}s`;
  return `+${mins}m${secs > 0 ? ` ${secs}s` : ""}`;
}
