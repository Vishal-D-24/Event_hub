import { Box, Button, Container, Link as MLink, Paper, Stack, Typography } from '@mui/material'

export default function Designer() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={800}>Certificate Designer (via Canva)</Typography>
          <Typography color="text.secondary">
            Design your certificate in Canva, export as PNG (landscape), then upload it when creating an event. The participant name, event title, date, and signature will be rendered on top.
          </Typography>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Open Canva and choose an A4 Landscape template.</li>
            <li>Keep a clean, minimalist layout. Leave a clear space for the participant name.</li>
            <li>Export as PNG (high quality).</li>
            <li>Upload the PNG as “Certificate Template” in Events → New Event. Upload organizer signature as transparent PNG.</li>
          </ol>
          <Box>
            <Button variant="outlined" component={MLink} href="https://www.canva.com/create/certificates/" target="_blank" rel="noopener noreferrer">
              Open Canva Certificate Templates
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  )
}
