import { Box, Container, Typography } from '@mui/material'

export default function Footer() {
  return (
    <Box component="footer" sx={{ py: 3, borderTop: (t) => `1px solid ${t.palette.divider}` }}>
      <Container maxWidth="lg" className="flex items-center justify-between">
        <Typography variant="body2">© {new Date().getFullYear()} Smart Event Hub</Typography>
        <Typography variant="body2" color="text.secondary">Built with React, MUI, Tailwind</Typography>
      </Container>
    </Box>
  )
}
