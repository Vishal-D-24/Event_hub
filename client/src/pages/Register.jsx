import { useEffect, useState } from 'react'
import { Alert, Box, Button, Card, Chip, Container, Fade, Grid, LinearProgress, Paper, Stack, TextField, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EventIcon from '@mui/icons-material/Event'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import SchoolIcon from '@mui/icons-material/School'
import { useParams } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider.jsx'

export default function Register() {
  const { api } = useAuth()
  const { shareId } = useParams()
  const [event, setEvent] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', college: '', yearDept: '' })
  const [customResponses, setCustomResponses] = useState({})
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get(`/api/participants/public/${shareId}`).then(r => setEvent(r.data)).catch(()=>setEvent(undefined))
  }, [shareId])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post(`/api/participants/register/${shareId}`, { ...form, customResponses })
      setDone(true)
    } catch (e) {
      setError(e.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (event === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
        <Stack spacing={2} alignItems="center">
          <LinearProgress sx={{ width: 200 }} />
          <Typography color="text.secondary">Loading event details...</Typography>
        </Stack>
      </Box>
    )
  }
  
  if (event === undefined) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
        <Container maxWidth="sm">
          <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h5" fontWeight={700} color="error" gutterBottom>
              Invalid Link
            </Typography>
            <Typography color="text.secondary">
              This registration link is invalid or has expired.
            </Typography>
          </Card>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa', py: { xs: 4, md: 8 } }}>
      <Container maxWidth="md">
        <Fade in timeout={800}>
          <Box>
            {/* Event Header Card */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
            >
              <Box
                sx={{
                  height: 8,
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                }}
              />
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={2}>
                  <Typography variant="h4" fontWeight={800}>
                    {event.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {event.description}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    <Chip
                      icon={<EventIcon />}
                      label={`${event.mode}`}
                      sx={{
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        color: '#667eea',
                        fontWeight: 600
                      }}
                    />
                    {event.location && (
                      <Chip
                        icon={<LocationOnIcon />}
                        label={event.location}
                        sx={{
                          bgcolor: 'rgba(240, 147, 251, 0.1)',
                          color: '#f093fb',
                          fontWeight: 600
                        }}
                      />
                    )}
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Start Date
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {new Date(event.startDateTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        End Date
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {new Date(event.endDateTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </Typography>
                    </Grid>
                  </Grid>
                </Stack>
              </Box>
            </Card>

            {/* Registration Form Card */}
            <Card
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
            >
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                {done ? (
                  <Stack spacing={3} alignItems="center" textAlign="center" sx={{ py: 4 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: 'rgba(67, 233, 123, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 48, color: '#43e97b' }} />
                    </Box>
                    <Typography variant="h5" fontWeight={700}>
                      Registration Successful!
                    </Typography>
                    <Typography color="text.secondary">
                      Thank you for registering! A confirmation email has been sent to your email address.
                    </Typography>
                  </Stack>
                ) : (
                  <Box component="form" onSubmit={submit}>
                    <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                      Register for Event
                    </Typography>
                    
                    {error && (
                      <Alert
                        severity="error"
                        sx={{
                          mb: 3,
                          borderRadius: 2,
                          animation: 'shake 0.5s',
                          '@keyframes shake': {
                            '0%, 100%': { transform: 'translateX(0)' },
                            '25%': { transform: 'translateX(-10px)' },
                            '75%': { transform: 'translateX(10px)' }
                          }
                        }}
                        onClose={() => setError('')}
                      >
                        {error}
                      </Alert>
                    )}

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          label="Full Name"
                          required
                          fullWidth
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          InputProps={{
                            startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover': { boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.1)' },
                              '&.Mui-focused': { boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)' }
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Email Address"
                          type="email"
                          required
                          fullWidth
                          value={form.email}
                          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          InputProps={{
                            startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                          }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Phone Number"
                          fullWidth
                          value={form.phone}
                          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                          InputProps={{
                            startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                          }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="College/Institution"
                          fullWidth
                          value={form.college}
                          onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
                          InputProps={{
                            startAdornment: <SchoolIcon sx={{ mr: 1, color: 'action.active' }} />
                          }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Year / Department"
                          fullWidth
                          value={form.yearDept}
                          onChange={e => setForm(f => ({ ...f, yearDept: e.target.value }))}
                          placeholder="e.g., 3rd Year CSE"
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      
                      {/* Dynamic Custom Fields */}
                      {event.customFields && event.customFields.length > 0 && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, color: '#667eea' }}>
                            Additional Information
                          </Typography>
                        </Grid>
                      )}
                      {event.customFields?.map((field, index) => (
                        <Grid item xs={12} sm={field.fieldType === 'textarea' ? 12 : 6} key={index}>
                          <TextField
                            label={field.label}
                            type={field.fieldType === 'email' ? 'email' : field.fieldType === 'number' ? 'number' : field.fieldType === 'phone' ? 'tel' : 'text'}
                            multiline={field.fieldType === 'textarea'}
                            rows={field.fieldType === 'textarea' ? 3 : 1}
                            required={field.required}
                            fullWidth
                            value={customResponses[field.label] || ''}
                            onChange={e => setCustomResponses(prev => ({ ...prev, [field.label]: e.target.value }))}
                            placeholder={field.placeholder || ''}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          />
                        </Grid>
                      ))}
                      
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          fullWidth
                          disabled={loading}
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            fontWeight: 600,
                            fontSize: '1rem',
                            textTransform: 'none',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                            transition: 'all 0.3s',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)'
                            },
                            '&:active': {
                              transform: 'translateY(0)'
                            },
                            '&:disabled': {
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              opacity: 0.6
                            }
                          }}
                        >
                          {loading ? 'Registering...' : 'Register Now'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>
            </Card>
          </Box>
        </Fade>
      </Container>
    </Box>
  )
}
