import {
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
  ListItem,
  Center,
  Box,
} from '@mantine/core';
import {
  IconCheck,
  IconHourglass,
  IconQuestionMark,
} from '@tabler/icons-react';
import classes from './page.module.css';
import Link from 'next/link';
import ColorSchemeToggle from './_components/colorSchemeToggle';

const iconProps = {
  style: { width: rem(15), height: rem(15) },
  stroke: 2,
};

function CheckIcon() {
  return (
    <ThemeIcon size="sm" radius="xl" color="green">
      <IconHourglass {...iconProps} />
    </ThemeIcon>
  );
}

function OngoingIcon() {
  return (
    <ThemeIcon size="sm" radius="xl" color="yellow">
      <IconCheck {...iconProps} />
    </ThemeIcon>
  );
}

function QuestionIcon() {
  return (
    <ThemeIcon size="sm" radius="xl" color="blue">
      <IconQuestionMark {...iconProps} />
    </ThemeIcon>
  );
}

export default function Page() {
  return (
    <Center h="100%">
      <Container size="md">
        <Group>
          <Box maw={rem(480)}>
            <Title className={classes.title} fw={900} lh={1.2}>
              A <span className={classes.highlight}>modern</span> bug tracker
              and note taker
            </Title>
            <Text c="dimmed" mt="md">
              Keeps notes. Has an issue board. Might add tasks with
              notifications later on(PWA?). Built with Next.js and Mantine.
            </Text>
            <List mt={30} spacing="sm" size="sm" icon={<CheckIcon />}>
              <ListItem>
                <b>Multipe notes</b> - each note use a rich text editor and can
                be permanently deleted
              </ListItem>
              <ListItem icon={<OngoingIcon />}>
                <b>Issue/Bug Tracker</b> - create, edit, delete, and close
                issues. Also has other views(WIP) incase you don&apos;t want the
                default kanban drag n&apos; drop
              </ListItem>
              <ListItem icon={<QuestionIcon />}>
                <b>Tasks with notifications</b> - coming soon?
              </ListItem>
            </List>
            <Group mt={30}>
              <Button
                component={Link}
                href="/login"
                radius="xl"
                size="md"
                className={classes.control}
              >
                Get started
              </Button>
              <Button
                component={Link}
                href="https://github.com/ickynavigator/bugs"
                target="_blank"
                variant="default"
                radius="xl"
                size="md"
                className={classes.control}
              >
                Source code
              </Button>
              <ColorSchemeToggle />
            </Group>
          </Box>

          <Image
            src="/header-1.svg"
            className={classes.image}
            alt="Header 1"
            w={rem(376)}
            h={rem(356)}
          />
        </Group>
      </Container>
    </Center>
  );
}
