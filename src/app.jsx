import 'src/global.css';

import { Router } from 'src/routes';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';
import { SocketProvider } from 'src/auth/context/socket-context';

export default function App() {
  useScrollToTop();

  return (
    <SettingsProvider settings={defaultSettings}>
      <ThemeProvider>
        <SocketProvider>
          <MotionLazy>
            <ProgressBar />
            <SettingsDrawer />
            <Router />
          </MotionLazy>
        </SocketProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}
