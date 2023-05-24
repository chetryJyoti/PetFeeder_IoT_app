// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //appwrite storage cred
  ENDPOINT: 'https://cloud.appwrite.io/v1',
  PROJECT_ID: '',
  BUCKET_ID: '',

  //appwrite db cred
  APPWRITE_DB_ID: '',
  APPWRITE_COLLECTION_ID: '',
  APPWRITE_API_KEY:
    '',
  //for home page
    APPWRITE_DOC_ID:'',

  //thingspeak api keys
  THINGS_LINK: 'https://api.thingspeak.com/channels',
  THINGS_UPDATE_URI: 'https://api.thingspeak.com/update.json',
  THINGS_CHANNEL_ID: '',
  THINGS_READ_API_KEY: '',
  THINGS_WRITE_API_KEY: '',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
