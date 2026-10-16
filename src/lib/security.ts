/**
 * HanUp Anti-Piracy & Digital Rights Management (DRM) Security Suite
 * Provides:
 * 1. Email masking for privacy protection
 * 2. Deterministic hashed license token generation (LIC-XXXX-XXXX)
 * 3. Invisible Zero-Width Unicode Steganography (Watermarking inside copied text)
 * 4. Zero-Width Watermark decoder for forensic leak tracing
 */

// Zero-width characters for invisible steganography
const ZW_ZERO = '\u200B'; // Zero-Width Space (Bit 0)
const ZW_ONE = '\u200C';  // Zero-Width Non-Joiner (Bit 1)
const ZW_DELIM = '\u200D'; // Zero-Width Joiner (Start/End delimiter)

/**
 * Mask email address for public/watermark display without leaking user PII
 * e.g., 'ot.helper7@gmail.com' -> 'ot.h***@gmail.com'
 */
export function maskEmail(email?: string): string {
  if (!email || !email.includes('@')) return 'stu***@hanup.edu';
  const [local, domain] = email.split('@');
  if (local.length <= 3) {
    return `${local.charAt(0)}***@${domain}`;
  }
  const prefix = local.slice(0, Math.min(4, Math.floor(local.length / 2) + 1));
  return `${prefix}***@${domain}`;
}

/**
 * Deterministic forensic license token generator (e.g., LIC-4E7A-9B21)
 * Conceals raw database UID / Firebase UID while ensuring constant 1-to-1 traceability
 */
export function generateLicenseToken(uid?: string, email?: string): string {
  const seed = `${uid || 'anon'}_${email || 'student'}_hanup_secure_salt_2026`;
  let hash1 = 5381;
  let hash2 = 0x811c9dc5;

  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash1 = ((hash1 << 5) + hash1) ^ char;
    hash2 = (hash2 ^ char) * 0x01000193;
  }

  const hex1 = Math.abs(hash1).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  const hex2 = Math.abs(hash2).toString(16).toUpperCase().padStart(4, '0').slice(-4);

  return `LIC-${hex1}-${hex2}`;
}

/**
 * Injects an invisible forensic fingerprint (Zero-Width Unicode) into any text string.
 * Completely invisible to the human eye, renders 0px width, does not break layout or search.
 * When a user copies this text into clipboard, KakaoTalk, WeChat, Word, or Telegram,
 * the hidden license token travels with the copied text!
 */
export function injectZeroWidthWatermark(text: string, token: string): string {
  if (!text || !token) return text;

  // Convert token ASCII to binary string
  let binary = '';
  for (let i = 0; i < token.length; i++) {
    binary += token.charCodeAt(i).toString(2).padStart(8, '0');
  }

  // Convert binary to zero-width characters
  let zwSequence = ZW_DELIM;
  for (let i = 0; i < binary.length; i++) {
    zwSequence += binary[i] === '1' ? ZW_ONE : ZW_ZERO;
  }
  zwSequence += ZW_DELIM;

  // Inject at the first space or beginning of the string
  const spaceIndex = text.indexOf(' ');
  if (spaceIndex !== -1) {
    return text.slice(0, spaceIndex) + zwSequence + text.slice(spaceIndex);
  }
  return zwSequence + text;
}

/**
 * Decodes the hidden zero-width watermark from any suspect leaked text.
 * Used by HanUp Admins/Super Admins to verify which student account leaked the material.
 */
export function extractZeroWidthWatermark(leakedText: string): string | null {
  if (!leakedText) return null;

  const startIdx = leakedText.indexOf(ZW_DELIM);
  if (startIdx === -1) return null;

  const endIdx = leakedText.indexOf(ZW_DELIM, startIdx + 1);
  if (endIdx === -1) return null;

  const zwCode = leakedText.slice(startIdx + 1, endIdx);
  let binary = '';

  for (let i = 0; i < zwCode.length; i++) {
    const char = zwCode[i];
    if (char === ZW_ONE) {
      binary += '1';
    } else if (char === ZW_ZERO) {
      binary += '0';
    }
  }

  if (binary.length === 0 || binary.length % 8 !== 0) return null;

  let decoded = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.slice(i, i + 8);
    decoded += String.fromCharCode(parseInt(byte, 2));
  }

  return decoded.startsWith('LIC-') ? decoded : null;
}
