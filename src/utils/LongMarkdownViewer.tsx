import React, { JSX } from 'react';
import { FinalConfig, CardProps } from '../config/themeConfig';
import { LayoutMode } from '../stores/settingsStore';

interface LongMarkdownViewerProps {
  html: string;
  CardComponent: React.FC<CardProps>;
  pageWidth?: number;
  showPageNumbers?: boolean;
  layoutMode?: LayoutMode;
  config: FinalConfig;
}

const LongMarkdownViewer: React.FC<LongMarkdownViewerProps> = ({
  html,
  CardComponent,
  pageWidth,
  showPageNumbers = false,
  layoutMode = "自动拆分",
  config,
}) => {
  return (
    <CardComponent 
      page={html} 
      width={pageWidth ?? -1} 
      height={-1}
      config={config}
    />
  );
};

export default LongMarkdownViewer;