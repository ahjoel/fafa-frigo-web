/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useCallback } from 'react'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Snackbar from '@mui/material/Snackbar'
import Alert, { AlertColor } from '@mui/material/Alert'
import Icon from 'src/@core/components/icon'
import { t } from 'i18next'
import DeleteIcon from '@mui/icons-material/Delete'
import { LoadingButton } from '@mui/lab'
import Reglement from 'src/frigo/logic/models/Reglement'
import ReglementService from 'src/frigo/logic/services/ReglementService'
import TableHeader from 'src/frigo/views/reglements/list/TableHeader'
import { TextField } from '@mui/material'
import { formatDateEnAnglais } from 'src/frigo/logic/utils/constant'

interface CellType {
  row: Reglement
}

interface ColumnType {
  [key: string]: any
}

const ReglementList = () => {
  const reglementService = new ReglementService()
  const userData = JSON.parse(window.localStorage.getItem('userData') as string)
  const profile = userData?.profile

  // Delete Confirmation - State
  const [sendDelete, setSendDelete] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const handleClose = () => setOpen(false)
  const [comfirmationMessage, setComfirmationMessage] = useState<string>('')
  const [comfirmationFunction, setComfirmationFunction] = useState<() => void>(() => console.log(' .... '))

  const handleDeleteReglement = (reglement: Reglement) => {
    if (profile === 'ADMINISTRATEUR' || profile === 'GERANT') {
      setCurrentReglement(reglement)
      setComfirmationMessage(
        `Voulez-vous réellement supprimer cet reglement de : ${reglement.totalFacture} F CFA pour la facture : ${reglement.codeFacture} ?`
      )
      setComfirmationFunction(() => () => deleteReglement(reglement))
      setOpen(true)
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage('Vous n avez pas le droit de supprimer cet reglement')
    }
  }

  const deleteReglement = async (reglement: Reglement) => {
    setSendDelete(true)

    try {
      const rep = await reglementService.delete(reglement.id)

      if (rep === null) {
        setSendDelete(false)
        handleChange()
        handleClose()
        setOpenNotification(true)
        setTypeMessage('success')
        setMessage('Reglement supprimé avec succes')
      } else {
        setSendDelete(false)
        setOpenNotification(true)
        setTypeMessage('error')
        setMessage('Reglement non trouvé')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression :', error)
      setSendDelete(false)
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage('Une erreur est survenue')
    }
  }

  // Notifications - snackbar
  const [openNotification, setOpenNotification] = useState<boolean>(false)
  const [typeMessage, setTypeMessage] = useState('info')
  const [message, setMessage] = useState('')

  const handleCloseNotification = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      setOpenNotification(false)
    }
    setOpenNotification(false)
  }

  const [statusReglements, setStatusReglements] = useState<boolean>(true)
  const [value, setValue] = useState<string>('')
  const [reglements, setReglements] = useState<Reglement[]>([])
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentReglement, setCurrentReglement] = useState<null | Reglement>(null)

  // Display of columns according to user roles in the Datagrid
  const getColumns = (handleDeleteReglement: (reglement: Reglement) => void) => {
    const colArray: ColumnType[] = [
      {
        width: 200,
        field: 'createdAt',
        renderHeader: () => (
          <Tooltip title='Date de reglement'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Date reglement
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { createdAt } = row

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none'
                  }}
                >
                  {createdAt.slice(0, -5).replace(/T/g, ' ')}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 200,
        field: 'client',
        renderHeader: () => (
          <Tooltip title='Client'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Client
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { client } = row

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'primary.main'
                  }}
                >
                  {client}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 200,
        field: 'codeFacture',
        renderHeader: () => (
          <Tooltip title='Code Facture'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Code Facture
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { codeFacture } = row

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'primary.main'
                  }}
                >
                  {codeFacture}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 150,
        field: 'total',
        renderHeader: () => (
          <Tooltip title='Total Facture'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Total Facture
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { totalFacture } = row

          return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'primary.main',
                    textAlign: 'center'
                  }}
                >
                  {totalFacture}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 150,
        field: 'mtrecu',
        renderHeader: () => (
          <Tooltip title='Montant Recu'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Montant Recu
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { mtrecu } = row

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'primary.main'
                  }}
                >
                  {mtrecu}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 150,
        field: 'relicat',
        renderHeader: () => (
          <Tooltip title='Reliquat'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Reliquat
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { relicat } = row

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'primary.main'
                  }}
                >
                  {relicat}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 100,
        field: 'auteur',
        renderHeader: () => (
          <Tooltip title='Auteur'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Auteur
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { firstname, lastname } = row

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'primary.main'
                  }}
                >
                  {firstname} {''} {lastname}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 100,
        sortable: false,
        field: 'actions',
        renderHeader: () => (
          <Tooltip title={t('Actions')}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              {t('Actions')}
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {(profile === 'ADMINISTRATEUR' || profile === 'SUPER-ADMIN') && (
              <Tooltip title='Supprimer le règlement'>
                <IconButton
                  size='small'
                  sx={{ color: 'text.primary' }}
                  onClick={() => {
                    {
                      handleDeleteReglement(row)
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', color: theme => theme.palette.info.main }}>
                    <Icon icon='tabler:trash' />
                  </Box>
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )
      }
    ]

    return colArray
  }

  // Axios call to loading Data
  const getListReglements = async () => {
    const result = await reglementService.listReglements()

    if (result.success) {
      const queryLowered = value.toLowerCase()
      const filteredData = (result.data as Reglement[]).filter(reglement => {
        return (
          reglement.codeFacture.toString().toLowerCase().includes(queryLowered) ||
          reglement.createdAt.toLowerCase().includes(queryLowered) ||
          reglement.client.toString().toLowerCase().includes(queryLowered)
        )
      })

      setReglements(filteredData)
      setStatusReglements(false)
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage(result.description)
    }
  }

  const handleChange = async () => {
    getListReglements()
  }

  // Control search data in datagrid
  useEffect(() => {
    handleChange()
    setColumns(getColumns(handleDeleteReglement))
  }, [value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const [codeFacture, setCodeFacture] = useState('');
  const [dateValue, setDateValue] = useState('');

  const handleFilterCodeFacture = (newValue: string) => {
    setCodeFacture(newValue);
  };

  const handleDateFilter = (newDateValue: string) => {
    setDateValue(newDateValue);
  };

  const handleSearchReglement = async () => {
    // Ici, tu peux ajouter la logique pour effectuer la recherche
    const datValue = formatDateEnAnglais(dateValue)

    if (codeFacture || datValue) {
      setStatusReglements(true)
      const res = await reglementService.listReglementSearch({ code: codeFacture, date: datValue })

      if (res.success) {
        setStatusReglements(false)
        const filte = (res.data as Reglement[])
        setReglements(filte)
      } else {
        setOpenNotification(true)
        setTypeMessage('error')
        setMessage('Une erreur est survenue lors de la recherche.')
      }
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage('Remplissez au moins un champs de recherche.')
    }

  };


  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <Typography variant="h5" sx={{ py: 2, px: 6 }}>
            Recherche et filtre des reglements
          </Typography>
          <Box
            sx={{
              py: 4,
              px: 6,
              rowGap: 2,
              columnGap: 4,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'right',
              justifyContent: 'end'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
              <TextField
                label='Code facture'
                size='small'
                color='primary'
                type='text'
                value={codeFacture}
                onChange={e => handleFilterCodeFacture(e.target.value)}
                sx={{ width: 200 }}
              />
            </Box>

            {/* Champ de sélection de date */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
              <TextField
                label='Date reglement'
                size='small'
                color='primary'
                type='date'
                value={dateValue}
                onChange={e => handleDateFilter(e.target.value)}
                sx={{ width: 150 }}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Box>

            {/* Bouton de recherche */}
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSearchReglement()}
                sx={{ height: 40 }}
              >
                Rechercher
              </Button>
            </Box>
          </Box>
          <hr />
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            onReload={() => {
              setValue('')
              setCodeFacture('')
              setDateValue('')
              handleChange()
            }}
          />
          <DataGrid
            autoHeight
            loading={statusReglements}
            rowHeight={62}
            rows={reglements as never[]}
            columns={columns as GridColDef<never>[]}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            pagination
            paginationMode='client'
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      {/* Notification */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openNotification}
        onClose={handleCloseNotification}
        autoHideDuration={5000}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={typeMessage as AlertColor}
          variant='filled'
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>

      {/* Delete Modal Confirmation */}
      <Dialog
        open={open}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason === 'backdropClick') {
            handleClose()
          }
        }}
      >
        <DialogTitle id='alert-dialog-title'>{t('Confirmation')}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>{t(comfirmationMessage)}</DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClose} color='secondary'>
            {t('Cancel')}
          </Button>
          <LoadingButton
            onClick={() => {
              comfirmationFunction()
            }}
            loading={sendDelete}
            endIcon={<DeleteIcon />}
            variant='contained'
            color='error'
          >
            {t('Supprimer')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default ReglementList
