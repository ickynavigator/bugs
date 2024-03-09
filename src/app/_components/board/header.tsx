import {
  ActionIcon,
  ActionIconGroup,
  Box,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
  rem,
} from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { useParams } from 'next/navigation';
import { formatDate } from '~/lib/date';
import { api } from '~/trpc/react';
import EditProject from '~/app/_components/edit/project';
import DeleteProject from '~/app/_components/delete/project';

export default function Header() {
  const params = useParams<{ projectId: string }>();
  const project = api.issue.getProjectByShortCode.useQuery({
    shortcode: params.projectId,
  });

  if (project.isLoading) {
    return <Skeleton />;
  }

  if (project.data == null) {
    return (
      <Paper withBorder shadow="md" p="md">
        <Title>Project not found</Title>
      </Paper>
    );
  }

  return (
    <Paper withBorder shadow="md" p="md">
      <Group justify="space-between" align="flex-start">
        <Box>
          <Title>{project.data.name}</Title>
          <Text c="dimmed">{project.data.description}</Text>
        </Box>

        <Stack align="flex-end" gap="1">
          <Text>
            Created:
            <Text component="span" c="dimmed" ml="xs">
              {formatDate(project.data.createdAt)}
            </Text>
          </Text>
          <Text>
            Last Updated:
            <Text component="span" c="dimmed" ml="xs">
              {formatDate(project.data.updatedAt)}
            </Text>
          </Text>

          <Group>
            <ActionIconGroup>
              <EditProject initialData={project.data}>
                {({ open }) => (
                  <ActionIcon variant="outline" onClick={open}>
                    <IconPencil
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  </ActionIcon>
                )}
              </EditProject>
              <DeleteProject id={project.data.id} />
            </ActionIconGroup>
          </Group>
        </Stack>
      </Group>
    </Paper>
  );
}
