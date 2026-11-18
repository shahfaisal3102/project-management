import {
  Alert,
  Badge,
  Card,
  Container,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard.service";

function DashboardPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboard", "health"],

    queryFn: dashboardService.getHealth,
  });

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={2}>Project Management</Title>

          <Text c="dimmed" mt={4}>
            Welcome to your project management workspace.
          </Text>
        </div>

        <Card withBorder radius="md" padding="lg">
          <Group justify="space-between">
            <Title order={4}>Backend Connection</Title>

            {isLoading ? (
              <Badge color="yellow">Checking</Badge>
            ) : isError ? (
              <Badge color="red">Disconnected</Badge>
            ) : (
              <Badge color="green">Connected</Badge>
            )}
          </Group>

          {isLoading && (
            <Group mt="lg">
              <Loader size="sm" />

              <Text size="sm">
                Connecting to backend...
              </Text>
            </Group>
          )}

          {isError && (
            <Alert
              color="red"
              title="Connection failed"
              mt="lg"
            >
              {error instanceof Error
                ? error.message
                : "Unable to connect to backend."}
            </Alert>
          )}

          {data && (
            <Stack mt="lg" gap="xs">
              <Text fw={500}>
                {data.message}
              </Text>

              <Text size="xs" c="dimmed">
                Last checked: {data.timestamp}
              </Text>
            </Stack>
          )}
        </Card>
      </Stack>
    </Container>
  );
}

export default DashboardPage;