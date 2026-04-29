// src/components/common/TruncateWithTooltip.tsx
import { Tooltip, Typography } from '@mui/material';
import React from 'react';

type MaxWidth = number | string;

interface TruncateWithTooltipProps {
  text?: string;
  children?: React.ReactNode; // falls back to children text if provided
  maxWidth?: MaxWidth; // e.g., 160, '60vw'
  typographyVariant?: React.ComponentProps<typeof Typography>['variant'];
  typography?: boolean; // render as Typography when true, otherwise span
  disableInteractive?: boolean;
  title?: React.ReactNode; // optional tooltip title, defaults to text/children
  sx?: React.ComponentProps<typeof Typography>['sx'];
}

/**
 * Small utility to standardize truncation + tooltip behavior across the app.
 * - Applies single-line ellipsis via CSS (noWrap)
 * - Shows full content on hover using MUI Tooltip
 * - Can render as a span (default) or as Typography via `typography`
 */
const TruncateWithTooltip: React.FC<TruncateWithTooltipProps> = ({
  text,
  children,
  maxWidth = 160,
  typographyVariant = 'body2',
  typography = false,
  disableInteractive = true,
  title,
  sx,
}) => {
  const contentText =
    text ?? (typeof children === 'string' ? (children as string) : undefined) ?? '';

  const commonStyle: React.CSSProperties = {
    display: 'inline-block',
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    verticalAlign: 'bottom',
  };

  const node = typography ? (
    <Typography component='span' variant={typographyVariant} noWrap sx={sx} style={commonStyle}>
      {contentText}
    </Typography>
  ) : (
    <span style={commonStyle}>{contentText}</span>
  );

  return (
    <Tooltip title={title ?? contentText} disableInteractive={disableInteractive}>
      {node}
    </Tooltip>
  );
};

export default TruncateWithTooltip;
