import {
  AppShellNavbar,
  Group,
  Anchor,
  Divider,
  Text,
  Tooltip,
  ActionIcon,
  rem,
  Stack,
  Box,
  Badge,
} from '@mantine/core';
import cx from 'clsx';
import Link from 'next/link';
import {
  IconCheckbox,
  IconNote,
  IconPlus,
  type Icon,
  IconAddressBook,
  IconBulb,
} from '@tabler/icons-react';
import type { Project } from '@prisma/client';
import classes from './shell.module.css';
import { usePathname } from 'next/navigation';

const projects: Project[] = [
  {
    id: 1,
    name: 'Project 1',
    description: 'Project 1 description',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: '1',
    shortcode: 'P1',
  },
  {
    id: 2,
    name: 'Project 2',
    description: 'Project 2 description',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: '1',
    shortcode: 'P2',
  },
  {
    id: 3,
    name: 'Project 3',
    description: 'Project 3 description',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: '1',
    shortcode: 'P3',
  },
];

interface MainLinkProps {
  icon: Icon;
  label: string;
  link: string;
  notifications?: number;
  disabled?: boolean;
}
const mainlinks: MainLinkProps[] = [
  {
    icon: IconCheckbox,
    link: '/dashboard/tasks',
    label: 'Tasks',
    notifications: 4,
    disabled: true,
  },
  { icon: IconNote, link: '/dashboard/notes', label: 'Notes' },
  {
    icon: IconAddressBook,
    link: '/dashboard/contacts',
    label: 'Contacts',
    disabled: true,
  },
  {
    icon: IconBulb,
    link: '/dashboard/activity',
    label: 'Activity',
    disabled: true,
  },
];

function MainLink(props: MainLinkProps) {
  const pathname = usePathname();

  const inner = (
    <Group justify="space-between" p="xs" fw="500">
      <Group gap="xs">
        <props.icon size={20} className={classes.icon} stroke={1.5} />
        <Text fz="sm">{props.label}</Text>
      </Group>

      {props.notifications && (
        <Badge size="sm" variant="filled">
          {props.notifications > 99 ? '99+' : props.notifications}
        </Badge>
      )}
    </Group>
  );

  return (
    <Anchor
      underline="never"
      className={cx(classes.button, {
        [`${classes.disabled}`]: props.disabled,
        [`${classes.active}`]:
          pathname.toLocaleLowerCase() === props.link.toLocaleLowerCase(),
      })}
      component={Link}
      href={props.link}
      passHref
    >
      {inner}
    </Anchor>
  );
}

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <AppShellNavbar>
      <Box px="xs" mt="xs">
        <Stack gap={rem(4)}>
          {mainlinks.map(link => (
            <MainLink key={link.label} {...link} />
          ))}
        </Stack>
      </Box>

      <Divider my="xs" />

      <Box px="md">
        <Group justify="space-between" align="center" px="xs">
          <Text size="xs" fw={500} c="dimmed">
            Projects
          </Text>

          <Tooltip label="Create Projects" withArrow position="right">
            <ActionIcon variant="default" size={18}>
              <IconPlus
                style={{ width: rem(12), height: rem(12) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Stack gap={rem(4)} mt="xs">
          {projects.length > 0 ? (
            projects.map(project => {
              const href = `/dashboard/project/${project.shortcode}`;

              return (
                <Anchor
                  key={project.id}
                  underline="never"
                  className={cx(classes.button, {
                    [`${classes.active}`]:
                      pathname.toLocaleLowerCase() === href.toLocaleLowerCase(),
                  })}
                  p="xs"
                  lh="xs"
                  fw="500"
                  size="sm"
                  component={Link}
                  href={href}
                  passHref
                >
                  {project.name}
                </Anchor>
              );
            })
          ) : (
            <Text py="xs" px="xs" size="xs" lh="xs" fw="500" ta="center">
              No Projects Found!
            </Text>
          )}
        </Stack>
      </Box>
    </AppShellNavbar>
  );
};

export default Sidebar;
