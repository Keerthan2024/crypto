/**
 * Parses and validates the scanned QR code payload.
 * Expects a JSON string containing `share_token` and `encrypted_aes_key`.
 * @param {string} rawPayload The raw string scanned from the QR code
 * @returns {object|null} Parsed object or null if invalid
 */
export const parseQRPayload = (rawPayload) => {
    try {
        const payload = JSON.parse(rawPayload);
        
        if (!payload.share_token || typeof payload.share_token !== 'string') {
            console.error("Invalid QR payload: Missing or invalid share_token");
            return null;
        }

        if (!payload.encrypted_aes_key || typeof payload.encrypted_aes_key !== 'string') {
            console.error("Invalid QR payload: Missing or invalid encrypted_aes_key");
            return null;
        }

        return {
            shareToken: payload.share_token,
            encryptedAesKey: payload.encrypted_aes_key
        };
    } catch (e) {
        console.error("Failed to parse QR payload. Not a valid JSON.", e);
        return null;
    }
};
