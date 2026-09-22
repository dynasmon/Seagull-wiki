import React, { type ReactNode } from 'react';
import OriginalLayout from '@theme-original/Layout';
import type { Props } from '@theme/Layout';
import { useColorMode } from '@docusaurus/theme-common';
import { EuiProvider } from '@elastic/eui';
function DocumentationTheme({ children }: { children: ReactNode }) {
  const { colorMode } = useColorMode();
  return (
    <EuiProvider
      colorMode={colorMode}
      globalStyles={false}
      utilityClasses={false}
    >
      {children}
    </EuiProvider>
  );
}
export default function Layout({ children, ...props }: Props) {
  return (
    <OriginalLayout {...props}>
      <DocumentationTheme>{children}</DocumentationTheme>
    </OriginalLayout>
  );
}
