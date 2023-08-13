import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import path from 'path';

export const config: Config = {
  namespace: 'ftb',
  globalStyle: 'src/global/app.scss',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  plugins: [
    sass({
      injectGlobalPaths: [
        path
          .resolve(__dirname, `src/global/vars.scss`)
          .replace(/\\/g, '/')
      ]
    })
  ],
  testing: {
    browserHeadless: "new",
  },

};
