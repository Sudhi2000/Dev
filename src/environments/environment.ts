// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // client_backend: 'http://localhost:1337',
  client_backend: 'https://d34cddnz7xqrlq.cloudfront.net',
  token: 'session-token',
  wheather: 'https://api.weatherapi.com/v1/current.json?',
  wheather_key: '42c1f44ea6854ac4a76170801221105',
  wheather_city: 'Trivandrum',
  report_auth: 'http://localhost:8080/api/auth/signin',
  // report_api:'http://43.205.146.64:5338/jasperserver/rest_v2/',
  report_api: 'https://d34cddnz7xqrlq.cloudfront.net/jasperserver/rest_v2/',


  sessionToken: 'session-token',
  reportToken: 'report-token',
  //sajan
  // publicSurveyToken:"a456c33de1b5af9e40bd1ca8e44d2f741807ff5b6f84d3706d364d9882c872536fa62f94ebf3c8ae5393d0b3c27b9acc5b26f87c4dc9bcbdee9e83579b74a784bd724adcaa5aa9c5f189abe88628ef90e70194c426c51393a97bb770eaee75df6dd82314bb59ef0a22d3c89f54a0e07b0055fd15bd79619046d68ce7bdf2f4a8",
  // Akif
  publicSurveyToken: '7b2f6f6d1d548e5fa889866cef51935131846362dc304860094f60d74d9a79c847293f0672aaef1d8cae2720b227d09add4af310dcb0589850eb7f2d3d7452dbc53727196eef310294fafc994a792b6ccf099e01efa94219f7016e94aa45951e16c39dba21c8ab0461c6fac3746f5e8874ff6ef762e453f550786187cb2e5c26',
  // UAT
  // publicSurveyToken: '52759e65d65b095afd987499bd115a30c22456dbe80caf7e45ecd6914f89faba3593489ff9164f1bf1a91144d3d252c44f975506b94622305b35fc13a693abbe9a9acfe06ec586d1925c41f94616b12dfd889ae40a4b4a2e1b789f1f17a9b496076394403463b5fc4749835707904b43e1349e7329b00447d94922343bc40d89',
  //Arun
  // publicSurveyToken: '031f6685fd71eba2eccf4f5cec786691389c8644d16fe6b61804140d5206ac22f8a7f3c19678cf1de0102ee79c9d8abb5ae73c7cd6b020496a06f1da564f5531d7ddf27ebaa5bf517dd21e2bf0e2dedc16c06a6bc99a7400df873c4edfc75b2e2d05a0403573091add28218abda3cd5cf1cb18487e17190ba6410deab706deab',

  org_id: 'orgID',
  OPENAI_EMAIL: 'redeftec@gmail.com',
  OPENAI_PASSWORD: 'Redefine#456',
  // OPENAI_API_KEY: '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',
  OPENAI_API_KEY: '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',
  // OPENAI_API_KEY:'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',

  j_username: "uat_redefine",
  j_password: "ce07df36-fb9c-4b53-abcc-ba58b30fb622",
  report_location: 'redeftec',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
