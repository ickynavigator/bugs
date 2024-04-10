import { ActionIcon, CopyButton, Tooltip, rem } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { env } from '~/env';

interface Props {
  userId: string;
  noteId: string | number;
}

export default function Note(props: Props) {
  const { userId, noteId } = props;

  const shareurl = new URL(
    `http://${env.NEXT_PUBLIC_VERCEL_URL}/share/note/${userId}/${noteId}`,
  );

  return (
    <CopyButton value={shareurl.toString()}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow>
          <ActionIcon
            color={copied ? 'teal' : 'yellow'}
            onClick={copy}
            variant="outline"
          >
            {copied ? (
              <IconCheck style={{ width: rem(16) }} />
            ) : (
              <IconCopy style={{ width: rem(16) }} />
            )}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );
}
