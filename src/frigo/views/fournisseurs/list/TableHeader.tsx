import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import { t } from 'i18next'
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
        label={t('Search Fournisseur') as string}
        size='small'
        color='primary'
        type='text'
        value={value}
        onChange={e => handleFilter(e.target.value)}
        sx={{ mr: 4 }}
      />

      <Box sx={{ display: 'flex', alignItems: 'right' }}>
        <Button onClick={toggle} variant='contained' sx={{ height: '38px', '&:hover': { backgroundColor: '#2a3645' } }}>
          <span style={{ marginRight: '0.2rem' }}>{t('Add an fournisseur')}</span>
          <Icon icon='tabler:plus' />
        </Button>

        <Button
          sx={{ marginLeft: '5px', '&:hover': { backgroundColor: '#2a3645' }}}
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
