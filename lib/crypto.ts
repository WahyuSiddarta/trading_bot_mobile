import { scrypt } from "scrypt-js";

const PASSWORD_SALT = "cryptotrading";
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_DK_LEN = 64;

function encodeUtf8(value: string) {
  const normalizedValue = value.normalize("NFKC");

  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(normalizedValue);
  }

  const bytes: number[] = [];

  for (let index = 0; index < normalizedValue.length; index += 1) {
    const codePoint = normalizedValue.codePointAt(index);

    if (codePoint === undefined) {
      continue;
    }

    if (codePoint > 0xffff) {
      index += 1;
    }

    if (codePoint <= 0x7f) {
      bytes.push(codePoint);
    } else if (codePoint <= 0x7ff) {
      bytes.push(0xc0 | (codePoint >> 6), 0x80 | (codePoint & 0x3f));
    } else if (codePoint <= 0xffff) {
      bytes.push(
        0xe0 | (codePoint >> 12),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f),
      );
    } else {
      bytes.push(
        0xf0 | (codePoint >> 18),
        0x80 | ((codePoint >> 12) & 0x3f),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f),
      );
    }
  }

  return Uint8Array.from(bytes);
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

export async function hashPassword(password: string) {
  const passwordBytes = encodeUtf8(password);
  const saltBytes = encodeUtf8(PASSWORD_SALT);
  const key = await scrypt(
    passwordBytes,
    saltBytes,
    SCRYPT_N,
    SCRYPT_R,
    SCRYPT_P,
    SCRYPT_DK_LEN,
  );

  return bytesToHex(key);
}
