import { spacesEndpoint, whoAmI } from '../../src/config'
import { profilePhotouploadDir, fileuploadDir, locationuploadDir, documentuploadDir } from '../../src/config'


export function avatarBaseUrl() {
    return 'https://vegvisits.' + spacesEndpoint + '/' + (whoAmI || '') + profilePhotouploadDir.replace('./', '');
}

export function documentBaseUrl() {
    return 'https://vegvisits.' + spacesEndpoint + '/' + (whoAmI || '') + documentuploadDir.replace('./', '');
}

export function listingBaseUrl() {
    return 'https://vegvisits.' + spacesEndpoint + '/' + (whoAmI || '') + fileuploadDir.replace('./', '');
}

export function popularLocationBaseUrl() {
    return 'https://vegvisits.' + spacesEndpoint + '/' + (whoAmI || '') + locationuploadDir.replace('./', '');
}
