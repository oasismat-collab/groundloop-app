/**
 * Builds JPEG proof-photo fixtures with controllable EXIF capture times for the
 * verifyDropoff emulator tests (task 5.5). We render a solid-colour JPEG with
 * `sharp`, then inject an EXIF `DateTimeOriginal` with `piexifjs`, so we can
 * exercise the fresh / stale / duplicate branches deterministically.
 */
import sharp from 'sharp';
// piexifjs ships no types; it operates on binary strings.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const piexif = require('piexifjs');

/** EXIF date string format piexif expects: "YYYY:MM:DD HH:MM:SS" (local wall clock). */
export function exifDate(ms: number): string {
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}:${p(d.getUTCMonth() + 1)}:${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`;
}

/**
 * A JPEG of the given solid colour (changing the colour changes the average
 * hash, so distinct colours are non-duplicates and identical ones are dupes),
 * carrying `DateTimeOriginal = capturedAtMs`.
 */
export async function makeJpeg(opts: {
  capturedAtMs: number;
  color?: { r: number; g: number; b: number };
  size?: number;
}): Promise<Buffer> {
  const { capturedAtMs, color = { r: 120, g: 180, b: 90 }, size = 64 } = opts;
  const base = await sharp({
    create: { width: size, height: size, channels: 3, background: color },
  })
    .jpeg({ quality: 90 })
    .toBuffer();

  const dateStr = exifDate(capturedAtMs);
  const exifObj = {
    '0th': {},
    Exif: {
      [piexif.ExifIFD.DateTimeOriginal]: dateStr,
      [piexif.ExifIFD.DateTimeDigitized]: dateStr,
    },
    GPS: {},
    Interop: {},
    '1st': {},
    thumbnail: null,
  };
  const exifBytes: string = piexif.dump(exifObj);
  // piexif works on JPEG represented as a binary string.
  const binary = base.toString('binary');
  const withExif: string = piexif.insert(exifBytes, binary);
  return Buffer.from(withExif, 'binary');
}
