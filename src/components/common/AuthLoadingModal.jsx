import { Box, CircularProgress, Dialog, Typography } from '@mui/material';

export default function AuthLoadingModal({ title }) {
  return (
    <Dialog
      open={Boolean(title)}
      aria-labelledby="auth-loading-title"
      disableEscapeKeyDown
      slotProps={{
        backdrop: { sx: { bgcolor: 'rgba(15, 23, 42, 0.34)', backdropFilter: 'blur(8px)' } },
        paper: { sx: { width: 260, maxWidth: 'calc(100vw - 40px)', m: 2, p: 3, borderRadius: 2, textAlign: 'center' } },
      }}
    >
      <Box role="status" aria-live="polite" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={36} thickness={4} />
        <Typography id="auth-loading-title" variant="body2" fontWeight={600}>{title}</Typography>
      </Box>
    </Dialog>
  );
}
