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
import TableHeader from 'src/frigo/views/produits/list/TableHeader'
import AddProduitDrawer from 'src/frigo/views/produits/list/AddProduitDrawer'
import { t } from 'i18next'
import Produit from 'src/frigo/logic/models/Produit'
import ProduitService from 'src/frigo/logic/services/ProduitService'
import DeleteIcon from '@mui/icons-material/Delete'
import { LoadingButton } from '@mui/lab'
import Model from 'src/frigo/logic/models/Model'
import Fournisseur from 'src/frigo/logic/models/Fournisseur'
import ModelService from 'src/frigo/logic/services/ModelService'
import FournisseurService from 'src/frigo/logic/services/FournisseurService'

// import PdfDocument from 'src/frigo/views/pdfMake/PdfDocument'
import TemplateListeDesProduits from 'src/frigo/views/pdfMake/TemplateListeDesProduits'

interface CellType {
  row: Produit
}

interface ColumnType {
  [key: string]: any
}

const ProduitList = () => {
  const produitService = new ProduitService()
  const userData = JSON.parse(window.localStorage.getItem('userData') as string)
  const profile = userData?.profile
  
  // Delete Confirmation - State
  const [sendDelete, setSendDelete] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const handleClose = () => setOpen(false)
  const [comfirmationMessage, setComfirmationMessage] = useState<string>('')
  const [comfirmationFunction, setComfirmationFunction] = useState<() => void>(() => console.log(' .... '))

  const handleDeleteProduit = (produit: Produit) => {
    setCurrentProduit(produit)
    setComfirmationMessage('Voulez-vous réellement supprimer ce produit ?')
    setComfirmationFunction(() => () => deleteProduit(produit))
    setOpen(true)
  }

  const deleteProduit = async (produit: Produit) => {
    setSendDelete(true)

    try {
      const rep = await produitService.delete(produit.id)

      if (rep === null) {
        setSendDelete(false)
        handleChange()
        handleClose()
        setOpenNotification(true)
        setTypeMessage('success')
        setMessage('Produit supprimé avec succes')
      } else {
        setSendDelete(false)
        setOpenNotification(true)
        setTypeMessage('error')
        setMessage('Produit non trouvé')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression :', error)
      setSendDelete(false)
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage('Une erreur est survenue')
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
  const [statusProduits, setStatusProduits] = useState<boolean>(true)
  const [produits, setProduits] = useState<Produit[]>([])
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [addProduitOpen, setAddProduitOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [total, setTotal] = useState(40)
  const [currentProduit, setCurrentProduit] = useState<null | Produit>(null)

  const [models, setModels] = useState<Model[]>([])
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([])

  // Display of columns according to user roles in the Datagrid
  const getColumns = (handleUpdateProduit: (produit: Produit) => void) => {
    const colArray: ColumnType[] = [
      {
        width: 100,
        field: 'code',
        renderHeader: () => (
          <Tooltip title='Code'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Code
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { code } = row

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
                  {code}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 180,
        field: 'name',
        renderHeader: () => (
          <Tooltip title={t('Name')}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              {t('Name')}
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { name } = row

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
                  {name}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 150,
        field: 'mesure',
        renderHeader: () => (
          <Tooltip title='Mesure'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Mesure
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { mesure } = row

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
                  {mesure}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 200,
        field: 'categorie',
        renderHeader: () => (
          <Tooltip title='Categorie'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Categorie
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { categorie } = row

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
                  {categorie}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 200,
        field: 'pa',
        renderHeader: () => (
          <Tooltip title='Prix Achat'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Prix Achat
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { pa } = row

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
                  {pa}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 200,
        field: 'pv',
        renderHeader: () => (
          <Tooltip title='Prix de vente'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Prix de vente
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { pv } = row

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
                  {pv}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 200,
        field: 'stock_min',
        renderHeader: () => (
          <Tooltip title='Stock Minimal'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Stock Minimal
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { stock_min } = row

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
                  {stock_min}
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title='Mettre à jour un produit'>
                <IconButton
                  size='small'
                  sx={{ color: 'text.primary' }}
                  onClick={() => {
                    handleUpdateProduit(row)
                  }}
                >
                  <Box sx={{ display: 'flex', color: theme => theme.palette.success.main }}>
                    <Icon icon='tabler:edit' />
                  </Box>
                </IconButton>
              </Tooltip>

              {(profile === 'ADMINISTRATEUR' || profile === 'SUPER-ADMIN') && (
                <Tooltip title='Supprimer'>
                  <IconButton
                    size='small'
                    sx={{ color: 'text.primary' }}
                    onClick={() => {
                      handleDeleteProduit(row)
                    }}
                  >
                    <Box sx={{ display: 'flex', color: theme => theme.palette.error.main }}>
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
  const getListProduits = async () => {
    const result = await produitService.listProduits()

    if (result.success) {
      const queryLowered = value.toLowerCase()
      const filteredData = (result.data as Produit[]).filter(produit => {
        return (
          produit.code.toLowerCase().includes(queryLowered) ||
          produit.name.toLowerCase().includes(queryLowered) ||
          produit.categorie.toLowerCase().includes(queryLowered) ||
          (produit.fournisseur && produit.fournisseur.toString().toLowerCase().includes(queryLowered)) ||
          produit.pa.toString().toLowerCase().includes(queryLowered) ||
          produit.pv.toString().toLowerCase().includes(queryLowered) ||
          produit.stock_min.toString().toLowerCase().includes(queryLowered)
        )
      })

      setProduits(filteredData)
      setStatusProduits(false)
      setTotal(Number(result.total))
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage(result.description)
    }
  }

  const handleChange = async () => {
    getListProduits()
  }

  // Control search data in datagrid
  useEffect(() => {
    handleChange()
    setColumns(getColumns(handleUpdateProduit))
  }, [value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  // Show Modal
  const toggleAddProduitDrawer = () => setAddProduitOpen(!addProduitOpen)

  // Add Data
  const handleCreateProduit = () => {
    setCurrentProduit(null)
    toggleAddProduitDrawer()
  }

  // Update Data
  const handleUpdateProduit = (produit: Produit) => {
    setCurrentProduit(produit)
    toggleAddProduitDrawer()
  }

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={handleCreateProduit}
            onReload={() => {
              setValue('')
              handleChange()
              setPaginationModel({page:0, pageSize:10})
            }}
          />

          <DataGrid
            autoHeight
            loading={statusProduits}
            rowHeight={62}
            rows={produits as never[]}
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

      {/* Add or Update Right Modal */}
      <AddProduitDrawer
        open={addProduitOpen}
        toggle={toggleAddProduitDrawer}
        onChange={handleChange}
        currentProduit={currentProduit}
        onSuccess={handleSuccess}
      />

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

export default ProduitList
