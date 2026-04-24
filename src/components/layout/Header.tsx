import React from 'react'
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const Header = () => {
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          Crypto Portfolio
        </Typography>
        <Button color='inherit' component={RouterLink} to='/'>
          Dashboard
        </Button>
        <Button color='inherit' component={RouterLink} to='/add-transaction'>
          Add Transaction
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Header
