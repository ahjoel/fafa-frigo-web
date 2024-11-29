import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { TextField } from '@mui/material'
import AutorenewIcon from '@mui/icons-material/Autorenew'

interface TableHeaderProps {
  value: string
  onReload: () => void
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, handleFilter, onReload } = props

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
        label='Recherche règlement'
        size='small'
        color='primary'
        type='text'
        value={value}
        onChange={e => handleFilter(e.target.value)}
        sx={{ mr: 4 }}
      />

      <Box sx={{ display: 'flex', alignItems: 'right' }}>
        <Button
          sx={{ marginLeft: '5px' }}
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
