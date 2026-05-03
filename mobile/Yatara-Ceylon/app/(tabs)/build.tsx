import { router } from 'expo-router';
import { Button, Screen, Subtitle, Title } from '@/components/yatara/ui';

export default function BuildTab() {
  return (
    <Screen>
      <Title>Build Tour</Title>
      <Subtitle>Create a simple custom tour request from the dedicated Build Tour screen.</Subtitle>
      <Button title="Open Build Tour" onPress={() => router.push('/build-tour')} />
    </Screen>
  );
}
