import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import { TextField } from '@mui/material'

interface TableHeaderProps {
  value: string
  toggle: () => void
  // expor: () => void
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, toggle, value } = props
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
        label='Recherche utilisateur'
        size="small"
        color="primary"
        type="text"
        value={value}
        onChange={e => handleFilter(e.target.value)}
        sx={{ mr: 4 }}
      />

      {profile === "ADMINISTRATEUR" && (
        <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 }, '&:hover': { backgroundColor: '#2a3645' }, marginRight: 5 }} size='small'>
            <span style={{ marginRight: '0.1rem' }}>Ajouter un utilisateur</span>
            <Icon fontSize='1.5rem' icon='tabler:plus' />
          </Button>
          {/* <Button onClick={expor} variant='contained' sx={{ '& svg': { mr: 2 }, '&:hover': { backgroundColor: '#2a3645' } }} size='small'>
            <span style={{ marginRight: '0.1rem' }}>Exporter Database</span>
            <Icon fontSize='1.5rem' icon='tabler:download' />
          </Button> */}
        </Box>
      )}
    </Box>
  )
}

export default TableHeader
