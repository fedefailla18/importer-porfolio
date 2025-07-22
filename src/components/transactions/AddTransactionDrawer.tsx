import React from 'react'
import { Drawer, Box, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import TransactionForm from './TransactionForm'

interface AddTransactionDrawerProps {
  open: boolean
  onClose: () => void
  defaultPortfolioName?: string
  onSuccess?: () => void
}

const AddTransactionDrawer = ({
  open,
  onClose,
  defaultPortfolioName,
  onSuccess,
}: AddTransactionDrawerProps) => {
  const handleSuccess = () => {
    onClose()
    if (onSuccess) onSuccess()
  }

  return (
    <Drawer anchor='right' open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 3, position: 'relative' }}>
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant='h5' gutterBottom sx={{ mb: 2 }}>
          Add Transaction
        </Typography>
        <TransactionForm
          defaultPortfolioName={defaultPortfolioName}
          onSuccess={handleSuccess}
        />
      </Box>
    </Drawer>
  )
}

export default AddTransactionDrawer
