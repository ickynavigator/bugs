import { Center, Loader } from '@mantine/core';
import React from 'react';

export default function LoaderScreen() {
  return (
    <Center h="100%">
      <Loader size="256" type="coin" />
    </Center>
  );
}
