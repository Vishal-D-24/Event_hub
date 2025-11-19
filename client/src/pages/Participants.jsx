import { useEffect, useState } from 'react'
import { Alert, Box, Button, Checkbox, Chip, Collapse, Container, Fade, IconButton, LinearProgress, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { useParams } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider.jsx'

export default function Participants() {
  const { api, user } = useAuth()
  const { id } = useParams()
  const [rows, setRows] = useState(null)
  const [selected, setSelected] = useState([])
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')
  const [expandedRows, setExpandedRows] = useState([])

  useEffect(() => {
    api.get(`/api/events/${id}/participants`).then(r => setRows(r.data)).catch(()=>setRows([]))
  }, [id])

  const toggleSelect = (participantId) => {
    setSelected(prev => 
      prev.includes(participantId) 
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    )
  }

  const toggleSelectAll = () => {
    if (selected.length === rows.length) {
      setSelected([])
    } else {
      setSelected(rows.map(r => r._id))
    }
  }

  const sendCertificates = async () => {
    if (selected.length === 0) return
    setSending(true)
    setMessage('')
    try {
      const res = await api.post(`/api/events/${id}/send-certificates-selected`, { participantIds: selected })
      setMessage(`✓ Sent ${res.data.sent} of ${res.data.total} certificates`)
      // Refresh to show updated status
      const updated = await api.get(`/api/events/${id}/participants`)
      setRows(updated.data)
      setSelected([])
    } catch (e) {
      setMessage(`✗ ${e.response?.data?.error || 'Failed to send certificates'}`)
    } finally {
      setSending(false)
    }
  }

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: '#f5f7fa' }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 6,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={600}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h3" fontWeight={800} sx={{ color: 'white' }}>
                  Participants
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  {rows ? `${rows.length} registered` : 'Loading...'}
                </Typography>
              </Stack>
            </Stack>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 5, mt: -4 }}>
        {!rows ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
            <Stack spacing={2} alignItems="center">
              <LinearProgress sx={{ width: 200 }} />
              <Typography color="text.secondary">Loading participants...</Typography>
            </Stack>
          </Box>
        ) : (
          <Fade in timeout={800}>
            <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              {selected.length > 0 && (
                <Box sx={{ p: 2, bgcolor: 'rgba(102, 126, 234, 0.05)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                    <Typography variant="body2" fontWeight={600} color="#667eea">
                      {selected.length} participant{selected.length > 1 ? 's' : ''} selected
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<SendIcon />}
                      onClick={sendCertificates}
                      disabled={sending}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontWeight: 600,
                        borderRadius: 2,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5568d3 0%, #6a3f91 100%)'
                        }
                      }}
                    >
                      {sending ? 'Sending...' : 'Send Certificates'}
                    </Button>
                  </Stack>
                </Box>
              )}
              {message && (
                <Alert 
                  severity={message.startsWith('✓') ? 'success' : 'error'} 
                  sx={{ m: 2, borderRadius: 2 }}
                  onClose={() => setMessage('')}
                >
                  {message}
                </Alert>
              )}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={rows.length > 0 && selected.length === rows.length}
                          indeterminate={selected.length > 0 && selected.length < rows.length}
                          onChange={toggleSelectAll}
                          sx={{ color: '#667eea', '&.Mui-checked': { color: '#667eea' } }}
                        />
                      </TableCell>
                      <TableCell><Typography fontWeight={700}>Name</Typography></TableCell>
                      <TableCell><Typography fontWeight={700}>Email</Typography></TableCell>
                      <TableCell><Typography fontWeight={700}>Phone</Typography></TableCell>
                      <TableCell><Typography fontWeight={700}>College</Typography></TableCell>
                      <TableCell><Typography fontWeight={700}>Year/Dept</Typography></TableCell>
                      <TableCell><Typography fontWeight={700}>Status</Typography></TableCell>
                      <TableCell><Typography fontWeight={700}>Registered</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map(r => {
                      const hasCustomResponses = r.customResponses && Object.keys(r.customResponses).length > 0
                      const isExpanded = expandedRows.includes(r._id)
                      
                      return (
                        <>
                          <TableRow 
                            key={r._id}
                            hover
                            sx={{ 
                              '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.03)' }
                            }}
                          >
                            <TableCell padding="checkbox">
                              <Stack direction="row" alignItems="center" spacing={0}>
                                {hasCustomResponses && (
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setExpandedRows(prev => 
                                        prev.includes(r._id) ? prev.filter(id => id !== r._id) : [...prev, r._id]
                                      )
                                    }}
                                  >
                                    {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                  </IconButton>
                                )}
                                <Checkbox
                                  checked={selected.includes(r._id)}
                                  onClick={() => toggleSelect(r._id)}
                                  sx={{ color: '#667eea', '&.Mui-checked': { color: '#667eea' } }}
                                />
                              </Stack>
                            </TableCell>
                            <TableCell>{r.name}</TableCell>
                            <TableCell>{r.email}</TableCell>
                            <TableCell>{r.phone || '—'}</TableCell>
                            <TableCell>{r.college || '—'}</TableCell>
                            <TableCell>{r.yearDept || '—'}</TableCell>
                            <TableCell>
                              {r.certificateSent ? (
                                <Chip
                                  icon={<CheckCircleIcon />}
                                  label="Sent"
                                  size="small"
                                  sx={{
                                    bgcolor: 'rgba(67, 233, 123, 0.1)',
                                    color: '#43e97b',
                                    fontWeight: 600
                                  }}
                                />
                              ) : (
                                <Chip
                                  label="Pending"
                                  size="small"
                                  sx={{
                                    bgcolor: 'rgba(0, 0, 0, 0.05)',
                                    color: 'text.secondary'
                                  }}
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(r.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          {hasCustomResponses && (
                            <TableRow key={`${r._id}-detail`}>
                              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                  <Box sx={{ py: 2, px: 3, bgcolor: 'rgba(102, 126, 234, 0.03)' }}>
                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ color: '#667eea' }}>
                                      Additional Information
                                    </Typography>
                                    <Stack spacing={1}>
                                      {Object.entries(r.customResponses).map(([key, value]) => (
                                        <Box key={key}>
                                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                            {key}
                                          </Typography>
                                          <Typography variant="body2">
                                            {value || '—'}
                                          </Typography>
                                        </Box>
                                      ))}
                                    </Stack>
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Fade>
        )}
      </Container>
    </Box>
  )
}
