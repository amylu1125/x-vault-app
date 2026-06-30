import { SettingsScreen } from '../../../components/SettingsScreen';

interface SettingsPageProps {
  activeLocation: string;
}

export function SettingsPage({ activeLocation }: SettingsPageProps) {
  return <SettingsScreen activeLocation={activeLocation} />;
}
