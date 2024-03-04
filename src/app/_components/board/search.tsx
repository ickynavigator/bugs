import { Code, TextInput, rem } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useRef } from 'react';
import useParamsState from '~/app/hook/useParamsState';

const Search = () => {
  const ref = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useParamsState({ key: 'q' });

  useHotkeys([['mod+K', () => ref.current?.focus()]]);

  return (
    <TextInput
      ref={ref}
      placeholder="Search"
      leftSection={
        <IconSearch style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
      }
      rightSectionWidth={70}
      rightSection={
        <Code fw="bold" fz={rem(10)}>
          Ctrl + K
        </Code>
      }
      styles={{ section: { pointerEvents: 'none' } }}
      value={search}
      onChange={event => setSearch(event.currentTarget.value)}
    />
  );
};

export default Search;
