import { useEffect, useMemo, useState } from 'react'
import { Alert, Avatar, Box, Button, Card, CardContent, Chip, Container, Dialog, DialogActions, DialogContent, DialogTitle, Fade, FormControl, Grid, IconButton, InputLabel, LinearProgress, MenuItem, Paper, Select, Slide, Stack, TextField, Tooltip, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ShareIcon from '@mui/icons-material/Share'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import SendIcon from '@mui/icons-material/Send'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import EventIcon from '@mui/icons-material/Event'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CategoryIcon from '@mui/icons-material/Category'
import DescriptionIcon from '@mui/icons-material/Description'
import ImageIcon from '@mui/icons-material/Image'
import CloseIcon from '@mui/icons-material/Close'
import { useAuth } from '../providers/AuthProvider.jsx'

export default function Events() {
  const { api } = useAuth()
  const { user } = useAuth()
  const [events, setEvents] = useState(null)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [shareDialog, setShareDialog] = useState({ open: false, link: '' })
  const [form, setForm] = useState({ title: '', description: '', category: 'Other', mode: 'online', startDateTime: '', endDateTime: '', location: '' })
  const [files, setFiles] = useState({ certTemplate: null, signature: null })
  const [customFields, setCustomFields] = useState([])

  const load = () => api.get('/api/events').then(r => setEvents(r.data)).catch(() => setEvents([]))
  useEffect(() => { load() }, [])

  const create = async () => {
    setError('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      fd.append('customFields', JSON.stringify(customFields))
      if (files.certTemplate) fd.append('certTemplate', files.certTemplate)
      if (files.signature) fd.append('signature', files.signature)
      await api.post('/api/events', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setOpen(false)
      setForm({ title: '', description: '', category: 'Other', mode: 'online', startDateTime: '', endDateTime: '', location: '' })
      setFiles({ certTemplate: null, signature: null })
      setCustomFields([])
      load()
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to create')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this event?')) return
    await api.delete(`/api/events/${id}`)
    load()
  }

  const share = async (id) => {
    const r = await api.post(`/api/events/${id}/share`)
    setShareDialog({ open: true, link: r.data.link })
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareDialog.link)
      alert('✓ Link copied to clipboard!')
    } catch (e) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareDialog.link
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('✓ Link copied to clipboard!')
    }
  }

  const sendCerts = async (id) => {
    await api.post(`/api/events/${id}/send-certificates`)
    alert('Certificate job started')
  }

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: '#f5f7fa' }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 6,
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
            opacity: 0.3
          }
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={600}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h3" fontWeight={800} sx={{ color: 'white' }}>
                  Events Management
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Create and manage your events
                </Typography>
              </Stack>
              { (user?.role === "organization" || user?.permissions?.canCreateEvents) && (
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => setOpen(true)}
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
                New Event
              </Button>
              )}
            </Stack>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 5, mt: -4 }}>
        {!events ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
            <Stack spacing={2} alignItems="center">
              <LinearProgress sx={{ width: 200 }} />
              <Typography color="text.secondary">Loading events...</Typography>
            </Stack>
          </Box>
        ) : (
          <Fade in timeout={800}>
            <Grid container spacing={3}>
              {events.map(e => (
                <Grid item xs={12} md={6} lg={4} key={e._id}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        height: 6,
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                      }}
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2}>
                        <Typography variant="h6" fontWeight={700}>
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
                          {e.description || 'No description'}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                          <Chip
                            size="small"
                            label={e.mode}
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
                          <Chip
                            size="small"
                            label={`${e.participantCount || 0} participants`}
                            sx={{
                              bgcolor: 'rgba(67, 233, 123, 0.1)',
                              color: '#43e97b',
                              fontWeight: 600
                            }}
                          />
                        </Stack>
                        <Stack spacing={0.5}>
                          <Typography variant="caption" color="text.secondary">
                            <EventIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                            {new Date(e.startDateTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            to {new Date(e.endDateTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Share registration link">
                            <IconButton
                              size="small"
                              onClick={() => share(e._id)}
                              sx={{
                                color: '#667eea',
                                '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.1)' }
                              }}
                            >
                              <ShareIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Send certificates now">
                            <IconButton
                              size="small"
                              onClick={() => sendCerts(e._id)}
                              sx={{
                                color: '#43e97b',
                                '&:hover': { bgcolor: 'rgba(67, 233, 123, 0.1)' }
                              }}
                            >
                              <SendIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={() => remove(e._id)}
                              sx={{
                                color: '#f5576c',
                                '&:hover': { bgcolor: 'rgba(245, 87, 108, 0.1)' }
                              }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Fade>
        )}
      </Container>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 3,
            position: 'relative'
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Create New Event
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Fill in the details to create your event
              </Typography>
            </Box>
            <IconButton
              onClick={() => setOpen(false)}
              sx={{
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 4, mt: 2 }}>
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

          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: '#667eea' }}>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Event Title"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    fullWidth
                    required
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
                  <FormControl fullWidth>
                    <InputLabel>Mode</InputLabel>
                    <Select
                      label="Mode"
                      value={form.mode}
                      onChange={e => setForm(f => ({ ...f, mode: e.target.value }))}
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="online">🌐 Online</MenuItem>
                      <MenuItem value="offline">🏢 Offline</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      label="Category"
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      sx={{ borderRadius: 2 }}
                    >
                      {['Seminar', 'Webinar', 'Workshop', 'Hackathon', 'Other'].map(c => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Location"
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    fullWidth
                    placeholder="Zoom link, venue address, etc."
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Start Date & Time"
                    type="datetime-local"
                    value={form.startDateTime}
                    onChange={e => setForm(f => ({ ...f, startDateTime: e.target.value }))}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="End Date & Time"
                    type="datetime-local"
                    value={form.endDateTime}
                    onChange={e => setForm(f => ({ ...f, endDateTime: e.target.value }))}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Tell attendees what this event is about..."
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: '#667eea' }}>
                Certificate Assets
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <AssetInput
                    label="Certificate Template"
                    file={files.certTemplate}
                    accept="image/*"
                    onChange={file => setFiles(f => ({ ...f, certTemplate: file }))}
                    icon={<DescriptionIcon />}
                  />
                </Grid>

              </Grid>
              <Alert
                severity="info"
                sx={{ mt: 2, borderRadius: 2 }}
                icon={<DescriptionIcon />}
              >
                <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                  <strong>Tip:</strong> Design your certificate in Canva and export it as <strong>PNG (Landscape)</strong>.
                  You can also <strong>download our certificate template</strong> and use it directly — ensure you leave
                  clear space for:
                  <br />• Participant Name
                  <br />• Event Name
                  <br />• Date
                  <br />• If you wish to include signatures on the certificate, add them directly in your design.
                  <br />• The system will not overlay signatures; it only fills in participant details.
                  This allows the system to auto-place participant information correctly.
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  component="a"
                  href="/Certificate-Template.png"
                  download="SmartEventHub-Certificate-Template.png"
                  sx={{ borderRadius: 2 }}
                >
                  Download Certificate Template
                </Button>
              </Alert>

            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: '#667eea' }}>
                Custom Registration Fields (Optional)
              </Typography>
              <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                <Typography variant="caption">
                  Add custom fields to collect additional information from participants
                </Typography>
              </Alert>
              <Stack spacing={2}>
                {customFields.map((field, index) => (
                  <Card key={index} sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(0,0,0,0.08)' }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={5}>
                        <TextField
                          size="small"
                          label="Field Label"
                          value={field.label}
                          onChange={(e) => {
                            const updated = [...customFields]
                            updated[index].label = e.target.value
                            setCustomFields(updated)
                          }}
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <FormControl size="small" fullWidth>
                          <InputLabel>Type</InputLabel>
                          <Select
                            label="Type"
                            value={field.fieldType}
                            onChange={(e) => {
                              const updated = [...customFields]
                              updated[index].fieldType = e.target.value
                              setCustomFields(updated)
                            }}
                            sx={{ borderRadius: 2 }}
                          >
                            <MenuItem value="text">Text</MenuItem>
                            <MenuItem value="email">Email</MenuItem>
                            <MenuItem value="phone">Phone</MenuItem>
                            <MenuItem value="number">Number</MenuItem>
                            <MenuItem value="textarea">Long Text</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4} sm={2}>
                        <FormControl size="small" fullWidth>
                          <InputLabel>Required</InputLabel>
                          <Select
                            label="Required"
                            value={field.required}
                            onChange={(e) => {
                              const updated = [...customFields]
                              updated[index].required = e.target.value
                              setCustomFields(updated)
                            }}
                            sx={{ borderRadius: 2 }}
                          >
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={2} sm={2}>
                        <IconButton
                          color="error"
                          onClick={() => setCustomFields(customFields.filter((_, i) => i !== index))}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setCustomFields([...customFields, { label: '', fieldType: 'text', required: false }])}
                  sx={{
                    borderRadius: 2,
                    borderColor: '#667eea',
                    color: '#667eea',
                    '&:hover': {
                      borderColor: '#5568d3',
                      bgcolor: 'rgba(102, 126, 234, 0.05)'
                    }
                  }}
                >
                  Add Custom Field
                </Button>
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setOpen(false)}
            size="large"
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              color: 'text.secondary'
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={create}
            size="large"
            sx={{
              borderRadius: 2,
              px: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)'
              }
            }}
          >
            Create Event
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Dialog */}
      <Dialog
        open={shareDialog.open}
        onClose={() => setShareDialog({ open: false, link: '' })}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 3
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={700}>
              Share Registration Link
            </Typography>
            <IconButton
              onClick={() => setShareDialog({ open: false, link: '' })}
              sx={{
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 4, mt: 2 }}>
          <Stack spacing={3}>
            <Alert severity="success" sx={{ borderRadius: 2 }} icon={<ShareIcon />}>
              <Typography variant="body2" fontWeight={600}>
                Share this link with participants to register for the event
              </Typography>
            </Alert>
            <TextField
              fullWidth
              value={shareDialog.link}
              InputProps={{
                readOnly: true,
                sx: {
                  borderRadius: 2,
                  bgcolor: '#f5f7fa',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem'
                }
              }}
              onClick={(e) => e.target.select()}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setShareDialog({ open: false, link: '' })}
            size="large"
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              color: 'text.secondary'
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={copyLink}
            size="large"
            startIcon={<ShareIcon />}
            sx={{
              borderRadius: 2,
              px: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)'
              }
            }}
          >
            Copy Link
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

function AssetInput({ label, file, accept, onChange, icon }) {
  return (
    <Card
      component="label"
      sx={{
        p: 3,
        borderRadius: 2,
        border: '2px dashed',
        borderColor: file ? '#667eea' : 'divider',
        bgcolor: file ? 'rgba(102, 126, 234, 0.05)' : 'transparent',
        cursor: 'pointer',
        transition: 'all 0.3s',
        height: '100%',
        minHeight: 140,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
          borderColor: '#667eea',
          bgcolor: 'rgba(102, 126, 234, 0.05)',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
        }
      }}
    >
      <input type="file" hidden accept={accept} onChange={(e) => onChange(e.target.files?.[0] || null)} />
      <Stack spacing={1.5} alignItems="center">
        <Box
          sx={{
            color: file ? '#667eea' : 'text.secondary',
            transition: 'all 0.3s'
          }}
        >
          {file ? <ImageIcon sx={{ fontSize: 40 }} /> : <CloudUploadIcon sx={{ fontSize: 40 }} />}
        </Box>
        <Typography
          variant="body2"
          fontWeight={600}
          color={file ? '#667eea' : 'text.secondary'}
          align="center"
          sx={{
            wordBreak: 'break-word',
            width: '100%',
            px: 1
          }}
        >
          {file ? file.name : label}
        </Typography>
        {!file && (
          <Typography variant="caption" color="text.disabled" align="center">
            Click to upload
          </Typography>
        )}
      </Stack>
    </Card>
  )
}
