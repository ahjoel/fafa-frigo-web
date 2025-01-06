/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Snackbar from '@mui/material/Snackbar'
import Alert, { AlertColor } from '@mui/material/Alert'
import Icon from 'src/@core/components/icon'
import TableHeader from 'src/frigo/views/entreeR1Dispo/list/TableHeader'
import EntreeR1Service from 'src/frigo/logic/services/EntreeService'
import EntreeR1Dispo from 'src/frigo/logic/models/EntreeR1Dispo'

interface CellType {
  row: EntreeR1Dispo
}

interface ColumnType {
  [key: string]: any
}

const EntreeR1List = () => {
  const entreeR1Service = new EntreeR1Service()

  // Search State
  const [value, setValue] = useState<string>('')

  // Notifications - snackbar
  const [openNotification, setOpenNotification] = useState<boolean>(false)
  const [typeMessage, setTypeMessage] = useState('info')
  const [message, setMessage] = useState('')

  // const handleSuccess = (message: string, type = 'success') => {
  //   setOpenNotification(true);
  //   setTypeMessage(type);
  //   const messageTrans = t(message)
  //   setMessage(messageTrans)
  // };

  const handleCloseNotification = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      setOpenNotification(false)
    }
    setOpenNotification(false)
  }

  // Loading Agencies Data, Datagrid and pagination - State
  const [statusEntreeR1, setStatusEntreeR1] = useState<boolean>(true)
  const [entreesR1Dispo, setEntreesR1Dispo] = useState<EntreeR1Dispo[]>([])
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // Display of columns according to user roles in the Datagrid
  const getColumns = (handleAddToCart: (entreeR1Dispo: EntreeR1Dispo) => void) => {
    const colArray: ColumnType[] = [
      {
        width: 250,
        field: 'produit',
        renderHeader: () => (
          <Tooltip title='Produit'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Produit
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { produit, mesure } = row

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
                  {produit.toString()} -- {mesure.toString()}
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
                  {categorie.toString()}
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
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
        field: 'st_dispo',
        renderHeader: () => (
          <Tooltip title='Quantité Disponible'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Quantité Disponible
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { st_dispo } = row

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
                  {st_dispo}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 200,
        field: 'stockMinimal',
        renderHeader: () => (
          <Tooltip title='Stock'>
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
          const { stockMinimal } = row

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
                  {stockMinimal.toString()}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 200,
        sortable: false,
        field: 'actions',
        renderHeader: () => (
          <Tooltip title='Actions'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Action
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Créer une facture avec ce produit du frigo'>
              <IconButton
                size='small'
                sx={{ color: 'text.primary', ':hover': 'none' }}
                onClick={() => {
                  handleAddToCart(row)
                }}
              >
                <Box sx={{ display: 'flex', color: theme => theme.palette.success.main }}>
                  <Icon icon='tabler:plus' />
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
  const getListEntreesR1Dispo = async () => {
    const result = await entreeR1Service.listEntreesR1Dispo()

    if (result.success) {
      const queryLowered = value.toLowerCase()

      const filteredData = (result.data as EntreeR1Dispo[]).filter(entree => {
        return (
          (entree.produit && entree.produit.toString().toLowerCase().includes(queryLowered)) ||
          entree.categorie.toString().toLowerCase().includes(queryLowered) ||
          entree.st_dispo.toString().toLowerCase().includes(queryLowered) ||
          entree.pv.toString().toLowerCase().includes(queryLowered) ||
          entree.stockMinimal.toString().toLowerCase().includes(queryLowered)
        )
      })
      setEntreesR1Dispo(filteredData)
      setStatusEntreeR1(false)
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage(result.description)
    }
  }

  const handleChange = async () => {
    getListEntreesR1Dispo()
  }

  // Control search data in datagrid
  useEffect(() => {
    handleChange()
    setColumns(getColumns(handleAddToCart))
  }, [value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleAddToCart = (entreeR1Dispo: EntreeR1Dispo) => {
    // console.log('data to save :::', entreeR1Dispo);
    const stockMinimal = Number(entreeR1Dispo.stockMinimal)
    const stockDispo = Number(entreeR1Dispo.st_dispo)
    const prixVentePdt = Number(entreeR1Dispo.pv)

    if (prixVentePdt > 0 && stockDispo >= stockMinimal && stockDispo > 0) {
      const cartProductArray = JSON.parse(localStorage.getItem('cart1') || '[]')

      // Créer un nouvel objet pour le produit à ajouter au panier
      const productToCart = {
        productId: entreeR1Dispo.id,
        product: entreeR1Dispo.produit.toString(),
        mesure: entreeR1Dispo.mesure.toString(),
        categorie: entreeR1Dispo.categorie,
        pv: Number(entreeR1Dispo.pv),
        stockDispo: Number(entreeR1Dispo.st_dispo),
        quantity: 0.05
      }

      // Vérifier si le produit existe déjà dans le panier
      const existingProductIndex = cartProductArray.findIndex(
        (item: { productId: number }) => item.productId === productToCart.productId
      )

      // Si le produit existe déjà dans le panier, ne l'ajoute pas à nouveau
      if (existingProductIndex === -1) {
        // Ajouter le nouveau produit au panier
        cartProductArray.push(productToCart)

        // Mettre à jour le localStorage avec le nouveau panier
        localStorage.setItem('cart1', JSON.stringify(cartProductArray))
        setOpenNotification(true)
        setTypeMessage('success')
        setMessage('Le produit est ajouté à la facture en cours')
      } else {
        setOpenNotification(true)
        setTypeMessage('error')
        setMessage('Le produit existe déja sur la facture en cours')
      }
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage('Le stock disponible est insuffisant ou le prix de vente est non défini')
    }
  }

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            onReload={() => {
              setValue('')
              handleChange()
            }}
          />

          <DataGrid
            autoHeight
            loading={statusEntreeR1}
            rows={entreesR1Dispo as never[]}
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
    </Grid>
  )
}

export default EntreeR1List
