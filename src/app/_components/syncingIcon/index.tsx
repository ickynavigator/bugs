import type { ThemeIconProps } from '@mantine/core';
import { ThemeIcon } from '@mantine/core';
import { IconCheck, IconPencil, IconRefresh, IconX } from '@tabler/icons-react';

interface Props {
  loading: boolean;
  size?: ThemeIconProps['size'];
  fail?: boolean;
  dirty?: boolean;
  show?: boolean;
}

export default function SyncingIcon(props: Props) {
  const {
    loading,
    size = 'lg',
    fail = false,
    dirty = false,
    show = true,
  } = props;

  if (!show) {
    return null;
  }

  const getIconColor = () => {
    if (loading) {
      return 'yellow';
    }

    if (fail) {
      return 'red';
    }

    if (dirty) {
      return 'blue';
    }

    return 'green';
  };

  const getIcon = () => {
    const sharedStyles = { width: '70%', height: '70%' };

    if (loading) {
      return (
        <IconRefresh
          style={{ ...sharedStyles, animation: 'var(--spin)' }}
          stroke={1.5}
        />
      );
    }

    if (fail) {
      return <IconX {...sharedStyles} stroke={1.5} />;
    }

    if (dirty) {
      return <IconPencil {...sharedStyles} stroke={1.5} />;
    }

    return <IconCheck {...sharedStyles} stroke={1.5} />;
  };

  return (
    <ThemeIcon variant="filled" color={getIconColor()} size={size}>
      {getIcon()}
    </ThemeIcon>
  );
}
