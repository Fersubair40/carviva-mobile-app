export const base64ToString = (base64: string) => {
  // atob decodes a Base64 string to a binary string
  const binary = atob(base64);
  // then we convert each char code into a proper UTF-8 string
  try {
    // TextDecoder is better for non-ASCII
    return new TextDecoder().decode(
      Uint8Array.from(binary, (c) => c.charCodeAt(0))
    );
  } catch {
    // fallback to simple ASCII
    return binary;
  }
};

export const isValidBase64 = (str: string) => {
  try {
    const buf = Buffer.from(str, 'base64');

    return buf.toString('base64') === str;
  } catch {
    return false;
  }
};
