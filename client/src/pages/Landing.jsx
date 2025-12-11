import { Box, Button, Card, CardContent, Chip, Container, Fade, Grid, Stack, Typography, Zoom } from '@mui/material'
import EventIcon from '@mui/icons-material/Event'
import ShareIcon from '@mui/icons-material/Share'
import PeopleIcon from '@mui/icons-material/People'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import EmailIcon from '@mui/icons-material/Email'
import { Link } from 'react-router-dom'

export default function Landing() {
  const features = [
    {
      icon: <EventIcon sx={{ fontSize: 40 }} />,
      title: 'Create Events',
      desc: 'Seminars, webinars, workshops, hackathons with ease',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: <ShareIcon sx={{ fontSize: 40 }} />,
      title: 'Share Links',
      desc: 'One-click copy and share via WhatsApp or email',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      title: 'Collect Participants',
      desc: 'Clean registration forms, no logins needed',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: <WorkspacePremiumIcon sx={{ fontSize: 40 }} />,
      title: 'Auto Certificates',
      desc: 'PDF certificates emailed automatically after events',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ]

  const steps = [
    { num: '01', text: 'Admin signs in and creates an event', icon: <RocketLaunchIcon /> },
    { num: '02', text: 'Share the unique registration link', icon: <ShareIcon /> },
    { num: '03', text: 'Participants register via the link', icon: <PeopleIcon /> },
    { num: '04', text: 'Certificates are generated and emailed automatically', icon: <WorkspacePremiumIcon /> }
  ]

  return (
    <div className="bg-gradient-to-b from-white via-purple-50 to-white">
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 10, md: 16 },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={800}>
            <Stack spacing={4} alignItems="center" textAlign="center">
              <Chip
                label="Modern Event Management"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  fontSize: '0.875rem'
                }}
              />
              <Typography
                variant="h1"
                fontWeight={800}
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  lineHeight: 1.2,
                  textShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}
              >
                Smart Event Hub
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  maxWidth: 700,
                  opacity: 0.95,
                  fontWeight: 400,
                  fontSize: { xs: '1.1rem', md: '1.5rem' }
                }}
              >
                Minimal, modern event management for universities. Create, share, and certify participants seamlessly.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/signup"
                  sx={{
                    bgcolor: 'white',
                    color: '#667eea',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: 'white',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.3)'
                    }
                  }}
                >
                  Get Started Free
                </Button>
         
              </Stack>
            </Stack>
          </Fade>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Fade in timeout={1000}>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight={800} gutterBottom>
              Everything You Need
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Powerful features to manage your events effortlessly
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {features.map((feature, idx) => (
            <Grid item xs={12} sm={6} md={3} key={feature.title}>
              <Zoom in timeout={1000 + idx * 100}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    '&:hover': {
                      transform: 'translateY(-12px)',
                      boxShadow: '0 16px 32px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: 3,
                        background: feature.gradient,
                        color: 'white',
                        mb: 3,
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'scale(1.1) rotate(5deg)'
                        }
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Fade in timeout={1200}>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={800} gutterBottom>
                How It Works
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Get started in 4 simple steps
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4}>
            {steps.map((step, idx) => (
              <Grid item xs={12} sm={6} md={3} key={step.num}>
                <Zoom in timeout={1300 + idx * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s',
                      position: 'relative',
                      overflow: 'visible',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 32px rgba(0,0,0,0.12)'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -20,
                        left: 20,
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.25rem',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                      }}
                    >
                      {step.num}
                    </Box>
                    <CardContent sx={{ p: 4, pt: 5 }}>
                      <Box sx={{ mb: 2, color: '#667eea' }}>{step.icon}</Box>
                      <Typography variant="body1" fontWeight={600} color="text.primary">
                        {step.text}
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Fade in timeout={1500}>
          <Card
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 16px 48px rgba(102, 126, 234, 0.3)'
            }}
          >
            <Stack spacing={3}>
              <Typography variant="h3" fontWeight={800}>
                Ready to Get Started?
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.95 }}>
                Join hundreds of universities managing events effortlessly
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/signup"
                  sx={{
                    bgcolor: 'white',
                    color: '#667eea',
                    fontWeight: 700,
                    px: 5,
                    py: 2,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: 'white',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.3)'
                    }
                  }}
                >
                  Start Free Now
                </Button>
              </Box>
            </Stack>
          </Card>
        </Fade>
      </Container>

      {/* Contact Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, textAlign: 'center' }}>
        <Fade in timeout={1600}>
          <Stack spacing={2} alignItems="center">
            <EmailIcon sx={{ fontSize: 48, color: '#667eea' }} />
            <Typography variant="h5" fontWeight={700}>
              Need Help?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              For support, email us at{' '}
              <Typography
                component="a"
                href="mailto:support@smarteventhub.dev"
                sx={{
                  color: '#667eea',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                support@smarteventhub.dev
              </Typography>
            </Typography>
          </Stack>
        </Fade>
      </Container>
    </div>
  )
}
