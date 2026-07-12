// Polyfill TextEncoder / TextDecoder requis par react-router-dom v7 dans jsdom
const { TextEncoder, TextDecoder } = require('util');
Object.assign(global, { TextEncoder, TextDecoder });
