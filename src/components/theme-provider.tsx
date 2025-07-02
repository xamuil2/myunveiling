"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ 
  children, 
  defaultTheme = "dark",
  enableSystem = false,
  disableTransitionOnChange = true,
  ...props 
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
