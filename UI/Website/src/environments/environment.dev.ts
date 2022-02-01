// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    version: '1.0.0',
    environment: 'Development',
    production: false,
    pwa: false,

    // API settings
    api: {
        url: '/api',  // base URL for api calls (example)
        version: 1,                             // default api version number to use
        format: 'json',                         // default api format to use
        sourceName: 'CitizenCommunicate', // Source-Name header field and emf source name
        subcomponentName: 'CitizenCommunicate',
        retryCount: 0                            // number of times to retry a failed api call
        // bypassUris: []                        // array of uri's that won't have COC standard headers and query parameters applied
    },

    // ACF settings // TODO: remove if not needed
    acf: {
        url: '/partialattributes'
    },

    // console log settings
    console: {
        // message levels to log
        levels: {
            debug: true,
            info: true,
            warn: true,
            error: true,
            audit: true
        }
    },
    

    // where to persist application settings
    storage: 'SESSIONSTORAGE',

    // authorization/authentication settings
    auth: {
        // URI's to exclude from authorization
        bypassAuth: [
        ],

        // identity provider settings
        identities: {
            basic: {
                name: 'basicIdentity',
                url: '/authenticate',
                login: '/login'
            }    
        }
    },

    /**
    * The tenant is found in the services Directory tenant id in App registration
    * The client id is the Application (client) ID from the the UI app reg
    * The endpoint has the url plus the Application (client) id of the service app reg
    */
    adalconfig: {
        tenant: '<tenant>',
        clientId: '<clientid>>',
        endpoints: {
            'https://exampleapi.azurewebsites.net': '0000-0000-0000'
        }
    },

    // application settings
    application: {
        appHeaderTitleLg: 'CitizenCommunicate',
        appHeaderTitleSm: 'CCom',
        defaultAlertTime: 2000
        // TODO: remove if not using SSO
        // fallbackProvider: 'oauth2'
    },
};