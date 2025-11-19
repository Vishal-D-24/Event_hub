import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Card, CardActions, CardContent, Chip, Container, Fade, Grid, Grow, IconButton, LinearProgress, Paper, Stack, Typography, Zoom } from '@mui/material'
import TimelineIcon from '@mui/icons-material/Timeline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction'
import RoomIcon from '@mui/icons-material/Room'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider.jsx'

export default function Dashboard() {
  const { api } = useAuth()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState(null)

  useEffect(() => {
    api.get('/api/events').then(r => setEvents(r.data)).catch(() => setEvents([]))
  }, [])

  const stats = useMemo(() => {
    if (!events) return { total: 0, participants: 0, upcoming: 0, past: 0 }
    const now = Date.now()
    let participants = 0, upcoming = 0, past = 0
    for (const e of events) {
      participants += e.participantCount || 0
      if (new Date(e.endDateTime).getTime() >= now) upcoming++
      else past++
    }
    return { total: events.length, participants, upcoming, past }
  }, [events])

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: '#f5f7fa' }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 7,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.4
          }
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={600}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
              <Stack spacing={1}>
                <Typography variant="h3" fontWeight={800} sx={{ color: "white" }}>
                  {user?.role === "organization"
                    ? "Organization Dashboard"
                    : "Event Manager Dashboard"}
                </Typography>

                <Typography sx={{ color: "white", opacity: 0.8, mt: 1 }}>
                  Welcome, {user?.name}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Overview of events and engagement
                </Typography>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddCircleOutlineIcon />}
                  component={Link}
                  to="/events"
                  sx={{
                    bgcolor: 'white',
                    color: '#667eea',
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                    }
                  }}
                >
                  Create Event
                </Button>

                {user?.role === "organization" && (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddCircleOutlineIcon />}
                    component={Link}
                    to="/event-managers"
                    sx={{
                      bgcolor: 'white',
                      color: '#667eea',
                      fontWeight: 600,
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: 'white',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
                      }
                    }}
                  >
                    Event Manager
                  </Button>
                )}

              </Stack>
            </Stack>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 8, mt: -3, px: { xs: 2, sm: 3, md: 4 } }}>
        {!events ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
            <Stack spacing={1} alignItems="center">
              <LinearProgress sx={{ width: 200 }} />
              <Typography color="text.secondary">Loading dashboard...</Typography>
            </Stack>
          </Box>
        ) : (
          <Fade in timeout={800}>
            <Box>
              <Grid container spacing={2} sx={{ mb: 5 }}>
                <Grid xs={12} sm={6} md={3}>
                  <Zoom in timeout={400}>
                    <div>
                      <StatCard
                        icon={<TimelineIcon />}
                        label="Total Events"
                        value={stats.total}
                        bgGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        iconColor="#667eea"
                      />
                    </div>
                  </Zoom>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                  <Zoom in timeout={500}>
                    <div>
                      <StatCard
                        icon={<PeopleAltIcon />}
                        label="Participants"
                        value={stats.participants}
                        bgGradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                        iconColor="#f093fb"
                      />
                    </div>
                  </Zoom>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                  <Zoom in timeout={600}>
                    <div>
                      <StatCard
                        icon={<EventAvailableIcon />}
                        label="Upcoming"
                        value={stats.upcoming}
                        bgGradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                        iconColor="#4facfe"
                      />
                    </div>
                  </Zoom>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                  <Zoom in timeout={700}>
                    <div>
                      <StatCard
                        icon={<RoomIcon />}
                        label="Past Events"
                        value={stats.past}
                        bgGradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                        iconColor="#43e97b"
                      />
                    </div>
                  </Zoom>
                </Grid>
              </Grid>

              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                  <TrendingUpIcon sx={{ color: '#667eea' }} />
                  <Typography variant="h5" fontWeight={700}>
                    Recent Events
                  </Typography>
                </Stack>
                <Grid container spacing={3}>
                  {events.slice(0, 6).map((e, idx) => (
                    <Grid xs={12} md={6} key={e._id}>
                      <Grow in timeout={800 + idx * 100}>
                        <Card
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 3,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                            }
                          }}
                        >
                          <Box
                            sx={{
                              height: 8,
                              background: `linear-gradient(90deg, ${['#667eea', '#f093fb', '#4facfe', '#43e97b', '#764ba2', '#f5576c'][idx % 6]} 0%, ${['#764ba2', '#f5576c', '#00f2fe', '#38f9d7', '#667eea', '#f093fb'][idx % 6]} 100%)`
                            }}
                          />
                          <CardContent sx={{ flexGrow: 1, p: 3 }}>
                            <Stack spacing={2}>
                              <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                                {e.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  minHeight: 40
                                }}
                              >
                                {e.description || 'No description provided'}
                              </Typography>
                              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                                <Chip
                                  size="small"
                                  label={e.mode}
                                  icon={<OnlinePredictionIcon fontSize="small" />}
                                  sx={{
                                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                                    color: '#667eea',
                                    fontWeight: 600
                                  }}
                                />
                                <Chip
                                  size="small"
                                  label={e.category || 'Other'}
                                  sx={{
                                    bgcolor: 'rgba(240, 147, 251, 0.1)',
                                    color: '#f093fb',
                                    fontWeight: 600
                                  }}
                                />
                              </Stack>
                              <Stack spacing={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <CalendarMonthIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(e.startDateTime).toLocaleDateString(undefined, {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <PeopleAltIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                  <Typography variant="body2" fontWeight={600}>
                                    {e.participantCount || 0} Participants
                                  </Typography>
                                </Stack>
                              </Stack>
                            </Stack>
                          </CardContent>
                          <CardActions sx={{ p: 2, pt: 0 }}>
                            <Button
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() => navigate(`/events/${e._id}/participants`)}
                              sx={{
                                color: '#667eea',
                                fontWeight: 600,
                                transition: 'all 0.2s',
                                '&:hover': {
                                  bgcolor: 'rgba(102, 126, 234, 0.08)',
                                  transform: 'translateX(2px)'
                                }
                              }}
                            >
                              View
                            </Button>
                            <Button
                              size="small"
                              startIcon={<EditIcon />}
                              component={Link}
                              to="/admin/events"
                              sx={{
                                color: '#f5576c',
                                fontWeight: 600,
                                transition: 'all 0.2s',
                                '&:hover': {
                                  bgcolor: 'rgba(245, 87, 108, 0.08)',
                                  transform: 'translateX(2px)'
                                }
                              }}
                            >
                              Manage
                            </Button>
                          </CardActions>
                        </Card>
                      </Grow>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  )
}

function StatCard({ icon, label, value, bgGradient, iconColor }) {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        background: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.06)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.12)'
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: 100,
          height: 100,
          background: bgGradient,
          opacity: 0.1,
          borderRadius: '50%',
          transform: 'translate(30%, -30%)'
        }
      }}
    >
      <Stack spacing={2}>
        <Box
          sx={{
            display: 'inline-flex',
            p: 1.5,
            borderRadius: 2,
            background: `${iconColor}15`,
            color: iconColor,
            width: 'fit-content',
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'scale(1.1) rotate(5deg)'
            }
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 0.5 }}>
            {label}
          </Typography>
          <Typography variant="h3" fontWeight={800} sx={{ color: 'text.primary' }}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Card>
  )
}
