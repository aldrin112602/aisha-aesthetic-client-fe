import { Box, Button } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function SessionError() {
  return (
    <Box
      role="alert"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.50',
        px: 3,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textAlign: 'center', maxWidth: 360 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: '#FEE4E2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <WifiOffIcon sx={{ fontSize: 32, color: 'error.main' }} />
        </Box>

        <Box component="h2" sx={{ fontSize: '1.1rem', fontWeight: 600, m: 0 }}>
          Unable to verify your session
        </Box>

        <Box component="p" sx={{ fontSize: '0.9rem', color: 'text.secondary', m: 0 }}>
          We couldn't reach the server to confirm you're still signed in. Check your connection and try again.
        </Box>

        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
          sx={{ mt: 1 }}
        >
          Refresh
        </Button>
      </Box>
    </Box>
  );
}