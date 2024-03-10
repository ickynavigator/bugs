import { forwardRef } from 'react';
import cx from 'clsx';
import { Box, type MantineLoaderComponent } from '@mantine/core';
import classes from './coin.module.css';

export const CoinLoader: MantineLoaderComponent = forwardRef(
  ({ className, ...others }, ref) => (
    <Box
      component="span"
      className={cx(classes.loader, className)}
      {...others}
      ref={ref}
    />
  ),
);

CoinLoader.displayName = 'Custom/Loader/CoinLoader';
