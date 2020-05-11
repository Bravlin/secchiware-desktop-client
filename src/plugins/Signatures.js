const crypto = require('crypto');

export default {
    install (Vue) {
        Vue.newSignature = function (
                key,
                method,
                canonicalURI,
                {
                    query = '',
                    signatureHeaders = null,
                    headerRecoverer = null
                } = {}) {
            var header, headerValue, hasher;
            var signatureString = `${method.toLowerCase()}\n${canonicalURI}\n`;

            if (query)
                signatureString += `${encodeURIComponent(query)}\n`;
            
            if (signatureHeaders) {
                if (!headerRecoverer)
                    throw new Error(
                        '"signatureHeaders" was provided but no "headerRecoverer" was given.');
                for (header of signatureHeaders) {
                    header = header.toLowerCase();
                    headerValue = headerRecoverer(header);
                    if (!headerValue)
                        throw new Error(`Value of header "${header}" could not be recovered.`);
                    signatureString += `${header}: ${headerValue}\n`;
                }
            }

            signatureString = signatureString.substring(0, signatureString.length - 1);
            hasher = crypto.createHmac('sha256', key);
            hasher.update(signatureString);
            return hasher.digest('base64');
        },

        Vue.newAuthorizationHeader = function(keyId, signature, signatureHeaders = null) {
            var signedHeaders;
            var authorizationHeader = `SECCHIWARE-HMAC-256 keyId=${keyId},`;

            if (signatureHeaders) {
                signedHeaders = signatureHeaders.map(h => h.toLowerCase()).join(';');
                authorizationHeader += `headers=${signedHeaders},`;
            }

            authorizationHeader += `signature=${signature}`;
            return authorizationHeader;
        }
    }
}