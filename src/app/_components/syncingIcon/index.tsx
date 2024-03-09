import { ThemeIcon, rem } from '@mantine/core';
import { IconCheck, IconRefresh, IconX } from '@tabler/icons-react';

interface Props {
  loading: boolean;
  fail?: boolean;
  show?: boolean;
}

const IconSizes = { width: rem(16), height: rem(16) };

export default function SyncingIcon(props: Props) {
  const { loading, fail = false, show = true } = props;

  if (!show) {
    return null;
  }

  return (
    <ThemeIcon
      variant="filled"
      color={loading ? 'yellow' : fail ? 'red' : 'green'}
    >
      {loading ? (
        <IconRefresh
          style={{ ...IconSizes, animation: 'var(--spin)' }}
          stroke={1.5}
        />
      ) : fail ? (
        <IconX style={{ ...IconSizes }} stroke={1.5} />
      ) : (
        <IconCheck style={{ ...IconSizes }} stroke={1.5} />
      )}
    </ThemeIcon>
  );
}
