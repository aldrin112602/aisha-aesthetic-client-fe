import { Skeleton, Box } from '@mui/material';

export default function SessionSkeleton() {
  return (
    <Box role="status" aria-label="Checking your session" sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* Top nav placeholder */}
      <Box
        sx={{
          height: 64,
          px: 3,
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'grey.200',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="text" width={130} height={24} />
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1.5 }}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="rounded" width={90} height={32} />
        </Box>
      </Box>

      {/* Content placeholder */}
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 2,
          }}
        >
          <Skeleton variant="rounded" width="100%" height={96} />
          <Skeleton variant="rounded" width="100%" height={96} />
          <Skeleton variant="rounded" width="100%" height={96} />
        </Box>
        <Skeleton variant="rounded" width="100%" height={256} />
      </Box>
    </Box>
  );
}