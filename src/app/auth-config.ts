import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    redirectUri: '/', // Points to window.location.origin by default. You must register this URI on Microsoft Entra admin center/App Registration.
    postLogoutRedirectUri: '/', // Points to window.location.origin by default.

     clientId: 'df224e9f-abd9-4175-b6cf-94bb9a63c4a6', // From Ecommerce-frontend registration
     authority: 'https://nagp2026.ciamlogin.com/nagp2026.onmicrosoft.com',
    
    knownAuthorities: ['nagp2026.ciamlogin.com'],
    navigateToLoginRequestUrl: true, // Fix routing conflicts
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage, // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
  },
  system: {
    loggerOptions: {
      loggerCallback(logLevel: LogLevel, message: string) {
        console.log(message);
      },
      logLevel: LogLevel.Verbose,
      piiLoggingEnabled: false,
    },
  },
};

// This is the scope we created for your .NET API
export const loginRequest = {
 scopes: ['openid', 'profile'] // Add required basic scopes
};