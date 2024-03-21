import {
  type DraggableProvided,
  type DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import { Box, Center, Group, Paper, Text, rem } from '@mantine/core';
import { type Issue } from '@prisma/client';
import { IconGripVertical } from '@tabler/icons-react';
import { memo } from 'react';

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
      <Group align="center">
        <Center {...provided.dragHandleProps}>
          <IconGripVertical
            style={{ width: rem(18), height: rem(18) }}
            stroke={1.5}
          />
        </Center>

        <Box>
          <Text>{issue.name}</Text>
          <Text c="dimmed">{issue.description}</Text>
        </Box>
      </Group>
    </Paper>
  );
};

const Item = memo(_Item) as typeof _Item;

export default Item;
