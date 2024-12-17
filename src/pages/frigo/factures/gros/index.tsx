/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Alert, { AlertColor } from '@mui/material/Alert'
import Icon from 'src/@core/components/icon'
import TableHeader from 'src/frigo/views/factures/TableHeader'
import { t } from 'i18next'
import { CircularProgress, TextField } from '@mui/material'
import FactureDetail from 'src/frigo/logic/models/FactureDetail'
import TableHeaderDetail from 'src/frigo/views/factures/TableHeaderDetail'
import ProduitService from 'src/frigo/logic/services/ProduitService'
import Produit from 'src/frigo/logic/models/Produit'
import AddFactureDetailDrawer from 'src/frigo/views/factures/AddFactureDetailDrawer'
import SortieR1Service from 'src/frigo/logic/services/SortieR1Service'
import PaymentIcon from '@mui/icons-material/Payment'
import PrintIcon from '@mui/icons-material/Print'
import ClientService from 'src/frigo/logic/services/ClientService'
import Client from 'src/frigo/logic/models/Client'
import EntreeR1Service from 'src/frigo/logic/services/EntreeService'
import FactureEclateDetailGros from 'src/frigo/logic/models/FactureEclateDetailGros'
import FactureService from 'src/frigo/logic/services/FactureService'

interface CellType {
  row: FactureEclateDetailGros
}

interface CellTypeFacture {
  row: FactureDetail
}

interface ColumnType {
  [key: string]: any
}

const FactureGros = () => {
  // Search State
  const [value, setValue] = useState<string>('')
  const [valueDetFact, setValueDetFact] = useState<string>('')

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

  const [statusFactures, setStatusFactures] = useState<boolean>(true)
  const [factures, setFactures] = useState<FactureEclateDetailGros[]>([])
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // Display of columns according to user roles in the Datagrid
  const getColumns = () => {
    const colArray: ColumnType[] = [
      {
        width: 150,
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
                    textDecoration: 'none',
                    whiteSpace: 'normal',
                    textAlign: 'left'
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
        width: 250,
        field: 'createdAt',
        renderHeader: () => (
          <Tooltip title='Date Facture'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Date Facture
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
                    textDecoration: 'none',
                    whiteSpace: 'normal',
                    textAlign: 'left'
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
        width: 150,
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
                    color: 'primary.main',
                    whiteSpace: 'normal',
                    textAlign: 'left'
                  }}
                >
                  {client.toString()}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
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
                  {produit}  {mesure}
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
        width: 100,
        field: 'qte',
        renderHeader: () => (
          <Tooltip title='Quantite'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Quantite
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
        width: 150,
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
      }
    ]

    return colArray
  }

  // Axios call to loading Data
  const entreeR1Service = new EntreeR1Service()
  const getListFactures = async () => {
    const result = await entreeR1Service.listMouvementFactureGros()

    if (result.success) {
      const queryLowered = value.toLowerCase()
      const filteredData = (result.data as FactureEclateDetailGros[]).filter(facture => {
        return (
          facture.code.toString().toLowerCase().includes(queryLowered) ||
          facture.createdAt.toLowerCase().includes(queryLowered) ||
          facture.client.toString().toLowerCase().includes(queryLowered) ||
          facture.produit.toLowerCase().includes(queryLowered) ||
          facture.pv.toString().toLowerCase().includes(queryLowered) 
        )
      })

      setFactures(filteredData)
      setStatusFactures(false)
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage(result.description)
    }
  }

  const handleChange = async () => {
    getListFactures()
  }

  // Control search data in datagrid
  useEffect(() => {
    handleChange()
    setColumns(getColumns())
  }, [value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handleFilterDet = useCallback((valFact: string) => {
    setValueDetFact(valFact)
  }, [])

  const [codeFacture, setCodeFacture] = useState('');
  const [dateValue, setDateValue] = useState('');

  const handleFilterCodeFacture = (newValue:string) => {
    setCodeFacture(newValue);
  };

  const handleDateFilter = (newDateValue: string) => {
    setDateValue(newDateValue);
  };

  const factureService = new FactureService();
  // Fonction pour lancer la recherche
  const handleSearchFacture = async () => {
    // Ici, tu peux ajouter la logique pour effectuer la recherche

    if (codeFacture || dateValue) {
      setStatusFactures(true)
      const res = await factureService.listGrosFactureSearch({ code: codeFacture, date: dateValue })
  
      if (res.success) {
        setStatusFactures(false)
        const filte = (res.data as FactureEclateDetailGros[])
        setFactures(filte)
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
            Recherche et filtre des factures en gros
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
                label='Date facture'
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
                onClick={()=>handleSearchFacture()}
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
              setValue('');
              setCodeFacture('');
              setDateValue('');
              handleChange();
              setPaginationModel({page:0, pageSize:10})
            }}
          />

          <DataGrid
            autoHeight
            loading={statusFactures}
            rowHeight={62}
            rows={factures as never[]}
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

export default FactureGros
