'use client';
import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import theme from './theme';

// 이 컴포넌트는 MUI 공식 문서에서 권장하는 설정입니다.
// Next.js App Router 환경에서 서버와 클라이언트 간의 스타일 불일치(Hydration Error)를 해결합니다.
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline은 브라우저 간의 스타일 차이를 정규화해줍니다. */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
