import { IntegrationsScreen } from '../../../components/IntegrationsScreen';
import type { MarketplaceIntegration } from '../../../types';

interface IntegrationsPageProps {
  integrations: MarketplaceIntegration[];
  onToggleSync: (mktId: string) => void;
}

export function IntegrationsPage(props: IntegrationsPageProps) {
  return <IntegrationsScreen {...props} />;
}
