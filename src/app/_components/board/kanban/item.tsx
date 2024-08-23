import {
  type DraggableProvided,
  type DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import {
  ActionIcon,
  Box,
  Center,
  Group,
  Paper,
  Text,
  rem,
} from '@mantine/core';
import { type Issue } from '@prisma/client';
import { IconEyeEdit, IconGripVertical } from '@tabler/icons-react';
import { memo } from 'react';
import EditIssue from '~/app/_components/edit/issue';

interface Props {
  issue: Issue;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}

const _Item = (props: Props) => {
  const { issue, provided } = props;

  return (
    <Paper
      withBorder
      p="md"
      shadow="xs"
      radius="md"
      {...provided.draggableProps}
      ref={provided.innerRef}
    >
      <Group justify="space-between">
        <Group align="center">
          <Box {...provided.dragHandleProps}>
            <Center>
              <IconGripVertical
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </Center>
          </Box>
          <Box>
            <Text>{issue.name}</Text>
            <Text c="dimmed">{issue.description}</Text>
          </Box>
        </Group>

        <EditIssue initialData={issue}>
          {({ open }) => (
            <ActionIcon variant="subtle" onClick={open}>
              <IconEyeEdit
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </ActionIcon>
          )}
        </EditIssue>
      </Group>
    </Paper>
  );
};

const Item = memo(_Item) as typeof _Item;

export default Item;
