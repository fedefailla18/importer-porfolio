import { Close as CloseIcon, Info as InfoIcon } from '@mui/icons-material';
import { Box, Collapse, IconButton, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';

const STORAGE_KEY_PREFIX = 'guide-dismissed-portfolio-vs-exchanges';

interface PortfolioExchangesGuideProps {
  /** Distinguishes which page's copy to show — same concept, different framing. */
  variant: 'portfolio' | 'exchanges';
}

/**
 * Quick-start guide explaining why "Portfolio" (manual) and "Exchanges" (API-synced) are two
 * separate sections instead of one merged view, and how to bring them together deliberately.
 * Dismissible per browser (localStorage) — a "?" isn't provided elsewhere, so this is the one
 * place this gets explained; keep it reachable rather than nagging every visit indefinitely.
 */
const PortfolioExchangesGuide = ({ variant }: PortfolioExchangesGuideProps) => {
  const storageKey = `${STORAGE_KEY_PREFIX}-${variant}`;
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(storageKey) === 'true';
    } catch {
      return false;
    }
  });

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(storageKey, 'true');
    } catch {
      // localStorage unavailable (private window, blocked) — dismissal just won't persist
    }
  };

  const copy =
    variant === 'portfolio' ? (
      <>
        <strong>Portfolio</strong> is what <em>you</em> track — transactions you enter manually or
        upload from a CSV. It's deliberately kept separate from what an exchange's API reports (see{' '}
        <strong>Exchanges</strong>), so you can compare the two before trusting either. Once you've
        reviewed an exchange's synced data (under Exchanges), use <strong>Consolidate</strong> here
        to bring it into this portfolio — sync never does that automatically.
      </>
    ) : (
      <>
        <strong>Exchanges</strong> shows data pulled automatically from each exchange's API via the
        Sync buttons — it's kept in its own dedicated portfolio, separate from any portfolio you
        manage by hand under <strong>Portfolio</strong>. That way you can compare "what I think I
        have" against "what the exchange actually reports" before trusting either one. When you're
        ready, open the matching manual portfolio and use <strong>Consolidate</strong> to merge the
        synced data in.
      </>
    );

  return (
    <Collapse in={!dismissed}>
      <Paper
        variant='outlined'
        sx={{
          p: 2,
          mb: 3,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          bgcolor: 'action.hover',
        }}
      >
        <InfoIcon color='primary' sx={{ mt: 0.25 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant='subtitle2' fontWeight={700} gutterBottom>
            Portfolio vs. Exchanges — how these two sections relate
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {copy}
          </Typography>
        </Box>
        <IconButton size='small' onClick={handleDismiss} aria-label='Dismiss guide'>
          <CloseIcon fontSize='small' />
        </IconButton>
      </Paper>
    </Collapse>
  );
};

export default PortfolioExchangesGuide;
