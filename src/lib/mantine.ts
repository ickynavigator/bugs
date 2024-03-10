'use client';

import { Loader, createTheme } from '@mantine/core';
import { bricolageGrotesque } from './font';
import { CoinLoader } from '~/app/_components/loader/coin';

const theme = createTheme({
  fontFamily: `${bricolageGrotesque.style.fontFamily}, sans-serif`,
  components: {
    Loader: Loader.extend({
      defaultProps: {
        loaders: { ...Loader.defaultLoaders, coin: CoinLoader },
      },
    }),
  },
});

export default theme;
