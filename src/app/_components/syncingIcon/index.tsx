import { ThemeIcon, rem } from '@mantine/core';
import { IconCheck, IconRefresh } from '@tabler/icons-react';

interface Props {
  loading: boolean;
  show?: boolean;
}

export default function SyncingIcon(props: Props) {
  const { loading, show = true } = props;

  if (!show) {
    return null;
  }

  return (
    <ThemeIcon variant="filled" color={loading ? 'yellow' : 'green'}>
      {loading ? (
        <IconRefresh
          style={{
            width: rem(16),
            height: rem(16),
            animation: 'var(--spin)',
          }}
          stroke={1.5}
        />
      ) : (
        <IconCheck style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
      )}
    </ThemeIcon>
  );
}
