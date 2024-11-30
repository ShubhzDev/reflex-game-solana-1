/// <reference types="vite/client" />

interface Window {
    global: Window;
    process: any;
    Buffer: typeof Buffer;
  }
  
  declare module 'process/browser';
  declare module 'stream-browserify';
  declare module 'browserify-zlib';
  declare module 'util';
  declare module 'buffer';
  declare module '@project-serum/anchor' {
    export * from '@project-serum/anchor';
  }