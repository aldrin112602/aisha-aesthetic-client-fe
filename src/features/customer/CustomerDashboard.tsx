import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material';

// Direct per-icon imports (safer than the barrel import across MUI versions)
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HistoryIcon from '@mui/icons-material/History';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';

import { getCustomerAppointments } from '../../api/appointments.api';
import type { Appointment } from '../../types';
import { getCurrentUser } from '../../utils/auth';
import { useNotifications } from '../../hooks/useNotifications';

// =========================================================
// BRAND THEME — matches the app's pink/gold palette
// =========================================================
const theme = createTheme({
  palette: {
    primary: { main: '#df7f98', dark: '#c15d78', light: '#fff0f4' },
    secondary: { main: '#c18c2d' },
    error: { main: '#c1433f' },
    text: { primary: '#4b343b', secondary: '#92737c' },
    background: { default: '#fffafb', paper: '#ffffff' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: 'inherit',
  },
});

const CHART_COLORS = ['#df7f98', '#f6c667', '#7e4ba8', '#4bb0a8', '#c1433f'];

const STATUS_CHIP_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#fff5df', color: '#b88a2c' },
  confirmed: { bg: '#e6f6f3', color: '#2f8f7c' },
  completed: { bg: '#eef7e6', color: '#5a8a2c' },
  cancelled: { bg: '#fdeaea', color: '#c1433f' },
  'no-show': { bg: '#f1eaf7', color: '#7e4ba8' },
};

function StatusChip({ status }: { status: string }) {
  const key = status?.toLowerCase() || '';
  const colors = STATUS_CHIP_COLORS[key] || { bg: '#f3f3f3', color: '#6b6b6b' };

  return (
    <Chip
      size="small"
      label={status || 'Unknown'}
      sx={{
        bgcolor: colors.bg,
        color: colors.color,
        fontWeight: 600,
        fontSize: '0.7rem',
        textTransform: 'uppercase',
      }}
    />
  );
}

function CustomerDashboard() {
  const navigate = useNavigate();
  const {
    notifications,
    error: notificationError,
    loading: notificationsLoading,
  } = useNotifications();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser?.id) {
      navigate('/signin');
      return;
    }

    getCustomerAppointments(currentUser.id)
      .then((data) => {
        console.log('Logged-in customer ID:', currentUser.id);
        console.log('Customer appointments from API:', data);
        setAppointments(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch((fetchError) => {
        console.error('Failed to fetch appointments:', fetchError);
        setError(
          'Unable to load appointments. Make sure the backend server is running.'
        );
        setAppointments([]);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const upcoming = appointments.filter(
    (item) => item.status !== 'cancelled'
  ).length;

  const latestStatus = appointments[0]?.status || 'No bookings yet';

  // =========================================================
  // CHART DATA
  // =========================================================

  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};

    appointments.forEach((appointment) => {
      const status = appointment.status || 'unknown';
      counts[status] = (counts[status] || 0) + 1;
    });

    return Object.entries(counts).map(([status, count], index) => ({
      id: status,
      value: count,
      label: status.charAt(0).toUpperCase() + status.slice(1),
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [appointments]);

  const monthlyTrend = useMemo(() => {
    const now = new Date();
    const months: { key: string; label: string; count: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleDateString('en-US', { month: 'short' }),
        count: 0,
      });
    }

    appointments.forEach((appointment) => {
      const date = new Date(appointment.date);
      if (isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const match = months.find((m) => m.key === key);
      if (match) match.count += 1;
    });

    return months;
  }, [appointments]);

  const statCards = [
    { label: 'Upcoming Appointment', value: String(upcoming), icon: CalendarMonthIcon },
    { label: 'Appointment Status', value: latestStatus, icon: AccessTimeIcon },
    { label: 'Service History', value: String(appointments.length), icon: HistoryIcon },
    { label: 'Follow-ups', value: '0', icon: EventAvailableIcon },
  ];

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box className="page-container">
          <Typography className="page-title" variant="h4" sx={{ fontWeight: 700 }}>
            Customer Dashboard
          </Typography>

          <Stack spacing={2} sx={{ mt: 6, alignItems: 'center' }}>
            <CircularProgress sx={{ color: '#df7f98' }} />
            <Typography color="text.secondary">
              Loading your dashboard...
            </Typography>
          </Stack>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box className="page-container">
        <Typography className="page-title" variant="h4" sx={{ fontWeight: 700 }}>
          Customer Dashboard
        </Typography>
        <Typography className="page-subtitle" color="text.secondary" sx={{ mb: 3 }}>
          Track your appointments, service history, and reminders.
        </Typography>

        {error && (
          <Alert
            severity="error"
            icon={<ErrorOutlinedIcon />}
            sx={{ mb: 3, borderRadius: 3 }}
          >
            <Typography sx={{ fontWeight: 600 }}>Connection Error</Typography>
            <Typography variant="body2">{error}</Typography>
          </Alert>
        )}

        {/* =====================================================
            STAT CARDS
        ====================================================== */}
        <Grid container spacing={2}>
          {statCards.map(({ label, value, icon: Icon }) => (
            <Grid key={label} size={{ xs: 12, sm: 6, xl: 3 }}>
              <Card
                elevation={0}
                sx={{ border: '1px solid #fbe4ea', borderRadius: 4, height: '100%' }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {label}
                      </Typography>
                      <Typography
                        variant="h5"
                        color="text.primary"
                        sx={{ fontWeight: 700, mt: 1 }}
                      >
                        {value}
                      </Typography>
                    </Box>
                    <Icon sx={{ color: '#c18c2d' }} fontSize="small" />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* =====================================================
            CHARTS
        ====================================================== */}
        {appointments.length > 0 && (
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, xl: 6 }}>
              <Card elevation={0} sx={{ border: '1px solid #fbe4ea', borderRadius: 4 }}>
                <CardContent>
                  <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700 }}>
                    Appointment Status Breakdown
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    A quick look at where your bookings stand.
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <PieChart
                      series={[
                        {
                          data: statusBreakdown,
                          innerRadius: 55,
                          outerRadius: 100,
                          paddingAngle: 2,
                          cornerRadius: 6,
                          highlightScope: { fade: 'global', highlight: 'item' },
                        },
                      ]}
                      height={260}
                      slotProps={{
                        legend: {
                          direction: 'horizontal',
                          position: { vertical: 'bottom', horizontal: 'center' },
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, xl: 6 }}>
              <Card elevation={0} sx={{ border: '1px solid #fbe4ea', borderRadius: 4 }}>
                <CardContent>
                  <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700 }}>
                    Booking Trend
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Your appointments over the last 6 months.
                  </Typography>

                  <BarChart
                    dataset={monthlyTrend}
                    xAxis={[{ dataKey: 'label', scaleType: 'band' }]}
                    series={[
                      { dataKey: 'count', label: 'Appointments', color: '#df7f98' },
                    ]}
                    height={260}
                    borderRadius={8}
                    grid={{ horizontal: true }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* =====================================================
            APPOINTMENTS + NOTIFICATIONS
        ====================================================== */}
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, xl: 6 }}>
            <Card elevation={0} sx={{ border: '1px solid #fbe4ea', borderRadius: 4, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700 }}>
                  My Appointments
                </Typography>

                {appointments.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    No bookings yet.{' '}
                    <a href="/booking" style={{ color: '#d77992', fontWeight: 600 }}>
                      Book now
                    </a>
                  </Typography>
                ) : (
                  <List disablePadding sx={{ mt: 1 }}>
                    {appointments.slice(0, 3).map((appointment, index) => (
                      <Box key={appointment.id}>
                        <ListItem disableGutters sx={{ py: 1.2 }}>
                          <ListItemAvatar sx={{ minWidth: 44 }}>
                            <Avatar
                              sx={{ width: 32, height: 32, bgcolor: '#fff0f4', color: '#c18c2d' }}
                            >
                              <CalendarMonthIcon fontSize="small" />
                            </Avatar>
                          </ListItemAvatar>

                          <ListItemText
                            primary={
                              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                                {appointment.serviceName}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                {appointment.date} · {appointment.time} · {appointment.area}
                              </Typography>
                            }
                          />

                          <StatusChip status={appointment.status} />
                        </ListItem>

                        {index < appointments.slice(0, 3).length - 1 && (
                          <Divider sx={{ borderColor: '#fbe4ea' }} />
                        )}
                      </Box>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, xl: 6 }}>
            <Card elevation={0} sx={{ border: '1px solid #fbe4ea', borderRadius: 4, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700 }}>
                  Notifications
                </Typography>

                <List disablePadding sx={{ mt: 1.5 }}>
                  {notificationError ? (
                    <ListItem disableGutters>
                      <Typography variant="body2" color="error">
                        {notificationError}
                      </Typography>
                    </ListItem>
                  ) : notificationsLoading ? (
                    <ListItem disableGutters>
                      <Typography variant="body2" color="text.secondary">
                        Loading notifications…
                      </Typography>
                    </ListItem>
                  ) : notifications.length === 0 ? (
                    <ListItem disableGutters>
                      <Typography variant="body2" color="text.secondary">
                        No notifications yet.
                      </Typography>
                    </ListItem>
                  ) : (
                    notifications.slice(0, 3).map((notification) => (
                      <ListItem key={notification.id} disableGutters sx={{ py: 0.8 }}>
                        <ListItemAvatar sx={{ minWidth: 40 }}>
                          <NotificationsNoneIcon fontSize="small" sx={{ color: '#c18c2d' }} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" color="text.primary">
                              {notification.message}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))
                  )}
                </List>

                <Button
                  onClick={() => navigate('/notifications')}
                  variant="text"
                  sx={{
                    mt: 2,
                    p: 0,
                    minWidth: 0,
                    color: '#d77992',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': { textDecoration: 'underline', bgcolor: 'transparent' },
                  }}
                >
                  View all notifications
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default CustomerDashboard;