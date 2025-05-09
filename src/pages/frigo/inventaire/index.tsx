/* eslint-disable react-hooks/exhaustive-deps */
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
import AddClientDrawer from 'src/frigo/views/clients/list/AddClientDrawer'
import { t } from 'i18next'
import Model from 'src/frigo/logic/models/Model'
import DeleteIcon from '@mui/icons-material/Delete'
import { LoadingButton } from '@mui/lab'
import Client from 'src/frigo/logic/models/Client'
import ClientService from 'src/frigo/logic/services/ClientService'
import Inventaire from 'src/frigo/logic/models/Inventaire'
import InventaireService from 'src/frigo/logic/services/InventaireService'
import AddStockDrawer from 'src/frigo/views/inventaires/AddStockDrawer'
import Produit from 'src/frigo/logic/models/Produit'
import ProduitService from 'src/frigo/logic/services/ProduitService'
import TableHeader from './TableHeader'

interface CellType {
  row: Inventaire
}

interface ColumnType {
  [key: string]: any
}

const InventaireList = () => {
  const invService = new InventaireService()
  const produitService = new ProduitService();

  let infoTranslate

  const produitId = 0;

  // Delete Confirmation - State
  const [sendDelete, setSendDelete] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const handleClose = () => setOpen(false)
  const [comfirmationMessage, setComfirmationMessage] = useState<string>('')
  const [comfirmationFunction, setComfirmationFunction] = useState<() => void>(() => console.log(' .... '))

  const handleDeleteInv = (inv: Inventaire) => {
    setCurrentInv(inv)
    setComfirmationMessage('Are you sure you want to remove it ?')
    setComfirmationFunction(() => () => deleteInv(inv))
    setOpen(true)
  }

  const deleteInv = async (inv: Inventaire) => {
    setSendDelete(true)

    try {
      const rep = await invService.delete(inv.id)

      if (rep === null) {
        setSendDelete(false)
        handleChange()
        handleClose()
        setOpenNotification(true)
        setTypeMessage('success')
        setMessage('Inventaire supprime')
      } else {
        setSendDelete(false)
        setOpenNotification(true)
        setTypeMessage('error')
        setMessage('Inventaire not found')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression :', error)
      setSendDelete(false)
      setOpenNotification(true)
      setTypeMessage('error')
      infoTranslate = t('An error has occurred')
      setMessage(infoTranslate)
    }
  }

  // Search State
  const [value, setValue] = useState<string>('')

  // Notifications - snackbar
  const [openNotification, setOpenNotification] = useState<boolean>(false)
  const [typeMessage, setTypeMessage] = useState('info')
  const [message, setMessage] = useState('')

  const handleSuccess = (message: string, type = 'success') => {
    setOpenNotification(true)
    setTypeMessage(type)
    const messageTrans = t(message)
    setMessage(messageTrans)
  }

  const handleCloseNotification = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      setOpenNotification(false)
    }
    setOpenNotification(false)
  }

  // Loading Agencies Data, Datagrid and pagination - State
  const [statusInv, setStatusInv] = useState<boolean>(true)
  const [invents, setInvents] = useState<Inventaire[]>([])
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [addInvOpen, setAddInvOpen] = useState<boolean>(false)
  const [paginationInv, setPaginationInv] = useState({ page: 0, pageSize: 10 })
  const [total, setTotal] = useState(40)
  const [produits, setProduits] = useState<Produit[]>([]);
  const [currentInv, setCurrentInv] = useState<null | Inventaire>(null)

  // Display of columns according to user roles in the Datagrid
  const getColumns = (handleUpdateInv: (inv: Inventaire) => void) => {
    const colArray: ColumnType[] = [
      {
        width: 200,
        field: 'dt',
        renderHeader: () => (
          <Tooltip title={t('Date Creation')}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              {t('Date Creation')}
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
        width: 400,
        field: 'produit',
        renderHeader: () => (
          <Tooltip title={t('Produit')}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              {t('Produit')}
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { produit } = row

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
                  {produit.toString()}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 150,
        field: 'qte',
        renderHeader: () => (
          <Tooltip title={t('Quantity')}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              {t('Quantity')}
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { qte } = row

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
                  {qte}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 200,
        field: 'type',
        renderHeader: () => (
          <Tooltip title={t('Type')}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              {t('Type MOUVEMENT')}
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { types } = row

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
                  {types=='ADD' ? 'ENTREE' : 'SORTIE'}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 200,
        field: 'du',
        renderHeader: () => (
          <Tooltip title={t('Date Modification')}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              {t('Date Modification')}
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { updatedAt } = row

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
                  {updatedAt?.slice(0, -5).replace(/T/g, ' ')}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 150,
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Modifier'>
              <IconButton
                size='small'
                sx={{ color: 'text.primary' }}
                onClick={() => {
                  handleUpdateInv(row)
                }}
              >
                <Box sx={{ display: 'flex', color: theme => theme.palette.success.main }}>
                  <Icon icon='tabler:edit' />
                </Box>
              </IconButton>
            </Tooltip>

            <Tooltip title={t('Delete')}>
              <IconButton
                size='small'
                sx={{ color: 'text.primary' }}
                onClick={() => {
                  handleDeleteInv(row)
                }}
              >
                <Box sx={{ display: 'flex', color: theme => theme.palette.error.main }}>
                  <Icon icon='tabler:trash' />
                </Box>
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
    ]

    return colArray
  }

  // Axios call to loading Data
  const getListInvs = async () => {
    const result = await invService.listInventairs()

    if (result.success) {
      const queryLowered = value.toLowerCase()
      const filteredData = (result.data as Inventaire[]).filter(i => {
        return i.types.toLowerCase().includes(queryLowered)
      })

      setInvents(filteredData)
      setStatusInv(false)
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage(result.description)
    }
  }

  const handleLoadingProduits = async () => {
    const result = await produitService.listProduitsLongue();

    if (result.success) {
      setProduits(result.data as Produit[]);
    } else {
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage(result.description);
    }
  };

  const handleChange = async () => {
    getListInvs()
  }

  // Control search data in datagrid
  useEffect(() => {
    handleChange()
    handleLoadingProduits();

    setColumns(getColumns(handleUpdateInv))
  }, [value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  // Show Modal
  const toggleAddInvDrawer = () => setAddInvOpen(!addInvOpen)

  // Add Data
  const handleCreateInv = () => {
    setCurrentInv(null)
    toggleAddInvDrawer()
  }

  // Update Data
  const handleUpdateInv = (client: Inventaire) => {
    setCurrentInv(client)
    toggleAddInvDrawer()
  }


  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={handleCreateInv}
            onReload={() => {
              setValue('')
              handleChange()
            }}
          />

          <DataGrid
            autoHeight
            loading={statusInv}
            rowHeight={62}
            rows={invents as never[]}
            columns={columns as GridColDef<never>[]}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            pagination
            paginationMode='client'
            paginationModel={paginationInv}
            onPaginationModelChange={setPaginationInv}
          />
        </Card>
      </Grid>

      {/* Add or Update Right Modal - Inventaire Add Stock */}
      <AddStockDrawer
        open={addInvOpen}
        toggle={toggleAddInvDrawer}
        onChange={handleChange}
        currentEntree={currentInv}
        onSuccess={handleSuccess} produits={produits} produitId={produitId} />

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

export default InventaireList
