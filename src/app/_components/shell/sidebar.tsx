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
  Skeleton,
} from '@mantine/core';
import cx from 'clsx';
import Link from 'next/link';
import {
  IconCheckbox,
  IconNote,
  IconPlus,
  IconAddressBook,
  IconBulb,
} from '@tabler/icons-react';
import classes from './shell.module.css';
import { usePathname } from 'next/navigation';
import CreateProject from '~/app/_components/create/project';
import { api } from '~/trpc/react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { Icon, IconProps } from '@tabler/icons-react';

interface MainLinkProps {
  icon: ForwardRefExoticComponent<Omit<IconProps, 'ref'> & RefAttributes<Icon>>;
  label: string;
  link: string;
  notifications?: number;
  disabled?: boolean;
  hide?: boolean;
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
    hide: true,
  },
  {
    icon: IconBulb,
    link: '/dashboard/activity',
    label: 'Activity',
    disabled: true,
    hide: true,
  },
];

function MainLink(props: MainLinkProps) {
  const pathname = usePathname();

  if (props.hide) {
    return null;
  }

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
      prefetch={props.disabled}
      passHref
    >
      {inner}
    </Anchor>
  );
}

const ProjectList = () => {
  const SKELETON_COUNT = 3;
  const pathname = usePathname();
  const projects = api.issue.getProjects.useQuery();

  if (projects.isLoading) {
    return Array.from({ length: SKELETON_COUNT }).map((_, index) => (
      <Skeleton key={index} height={30} />
    ));
  }

  if (projects.error) {
    return (
      <Text py="xs" px="xs" size="xs" lh="xs" fw="500" ta="center">
        Error loading projects. Please refresh the page.
      </Text>
    );
  }

  if (projects.data.length < 1) {
    return (
      <Text py="xs" px="xs" size="xs" lh="xs" fw="500" ta="center">
        No Projects Found!
      </Text>
    );
  }

  return projects.data.map(project => {
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
  });
};

const Sidebar = () => {
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

          <CreateProject>
            {({ open }) => (
              <Tooltip label="Create Projects" withArrow position="right">
                <ActionIcon variant="default" size={18} onClick={open}>
                  <IconPlus
                    style={{ width: rem(12), height: rem(12) }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Tooltip>
            )}
          </CreateProject>
        </Group>

        <Stack gap={rem(4)} mt="xs">
          <ProjectList />
        </Stack>
      </Box>
    </AppShellNavbar>
  );
};

export default Sidebar;
