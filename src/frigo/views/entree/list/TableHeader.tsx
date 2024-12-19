import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import { TextField } from '@mui/material'
import AutorenewIcon from '@mui/icons-material/Autorenew'

interface TableHeaderProps {
  value: string
  toggle: () => void
  onReload: () => void
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, toggle, value, onReload } = props
  const userData = JSON.parse(window.localStorage.getItem('userData') as string)
  const profile = userData?.profile

  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        rowGap: 2,
        columnGap: 4,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <TextField
        label='Recherche de stock'
        size='small'
        color='primary'
        type='text'
        value={value}
        // onChange={e => handleFilter(e.target.value)}
        onChange={(e) => handleFilter(e.target.value)} // Mise à jour de la valeur
        sx={{ mr: 4 }}
      />

      <Box sx={{ display: 'flex', alignItems: 'right' }}>

      {(profile === "ADMINISTRATEUR" || profile === "GERANT") && (
        <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button onClick={toggle} size='small' variant='contained' sx={{ height: '38px', '&:hover': { backgroundColor: '#2a3645' } }}>
            <span style={{ marginRight: '0.1rem' }}>Ajouter un stock</span>
            <Icon fontSize='1.5rem' icon='tabler:plus' />
          </Button>
        </Box>
      )}

        <Button
          sx={{ marginLeft: '5px', '&:hover': { backgroundColor: '#2a3645' } }}
          size='small'
          variant='contained'
          onClick={() => {
            onReload()
          }}
        >
          <AutorenewIcon />
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
