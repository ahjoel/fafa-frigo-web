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
import EntreeService from 'src/frigo/logic/services/EntreeService'
import EntreeR1Dispo from 'src/frigo/logic/models/EntreeR1Dispo'
import Mouvement from 'src/frigo/logic/models/Mouvement'
import { generatePdf } from 'src/frigo/views/pdfMake/StockList'
import { formatDateEnAnglais } from 'src/frigo/logic/utils/constant'

interface CellType {
  row: Mouvement
}

interface ColumnType {
  [key: string]: any
}

const StatStockList = () => {
  const entreeService = new EntreeService()
  const userData = JSON.parse(window.localStorage.getItem('userData') as string)
  const profile = userData?.profile

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

  const [statusSituation, setStatusSitutation] = useState<boolean>(false)
  const [value, setValue] = useState<string>('')
  const [situations, setSituations] = useState<Mouvement[]>([])
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // Display of columns according to user roles in the Datagrid
  const getColumns = () => {
    const colArray: ColumnType[] = [
      {
        width: 50,
        field: 'id',
        renderHeader: () => (
          <Tooltip title='#'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              #
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { id } = row

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
                  {id}
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
          const { produit, mesure, categorie } = row

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
                  {produit.toString()} - {mesure} {categorie}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 180,
        field: 'st_init',
        renderHeader: () => (
          <Tooltip title='Stock initial'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Stock Initial
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { st_init } = row

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
                  {st_init}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 200,
        field: 'qt_e',
        renderHeader: () => (
          <Tooltip title='Qte Entree'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Qte Entree
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { qt_e } = row

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
                  {qt_e}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 150,
        field: 'qt_s',
        renderHeader: () => (
          <Tooltip title='Qte Sortie'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Qte Sortie
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { qt_s } = row

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
                  {qt_s}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 150,
        field: 'st_dispo',
        renderHeader: () => (
          <Tooltip title='Qte Dispo'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Qte Dispo
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { st_dispo } = row

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
                  {st_dispo}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 150,
        field: 'stockMinimal',
        renderHeader: () => (
          <Tooltip title='Stock Mini'>
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
                  {stockMinimal}
                </Typography>
              </Box>
            </Box>
          )
        }
      }
    ]

    return colArray
  }


  // Control search data in datagrid
  useEffect(() => {
    // handleChange()
    setColumns(getColumns())
  }, [value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const [dd, setDd] = useState('');
  const [df, setDf] = useState('');

  const handleFilterDd = (newValue: string) => {
    setDd(newValue);
  };

  const handleDateFilterDf = (newDateValue: string) => {
    setDf(newDateValue);
  };

  const handleListData = async () => {
    const ddebut = formatDateEnAnglais(dd)
    const dfin = formatDateEnAnglais(df)

    if ((ddebut && dfin) && (ddebut <= dfin)) {
      setStatusSitutation(true)
      const res = await entreeService.listStatMouvementStock({ dd: dd, df: df })

      if (res.success) {
        setStatusSitutation(false)
        const filte = (res.data as Mouvement[]).map((item, index) => ({
            ...item,
            id: index + 1 
        }));
        setSituations(filte)
      } else {
        setOpenNotification(true)
        setTypeMessage('error')
        setMessage('Une erreur est survenue lors de la recherche.')
      }
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage('Dates invalides')
    }

  };

  const handleExportToPDF = async () => {
    try {
      if (situations.length > 0) {
        generatePdf(situations as never[], 'Situation - Liste_Des_Produits', dd, df);
      }else{
        setOpenNotification(true);
        setTypeMessage("error");
        setMessage("Recherchez les données sur une periode en premier.")
      }

    } catch (error) {
      console.error('Error exporting data to PDF', error);
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage("Une erreur est survenue lors de l'exportation en PDF.")
    }
  };


  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <Typography variant="h5" sx={{ py: 2, px: 6 }}>
            Recherche et filtre du Stock des produits
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
                label='Date debut'
                size='small'
                color='primary'
                type='date'
                value={dd}
                onChange={e => handleFilterDd(e.target.value)}
                sx={{ width: 200 }}
                InputLabelProps={{
                    shrink: true
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
              <TextField
                label='Date fin'
                size='small'
                color='primary'
                type='date'
                value={df}
                onChange={e => handleDateFilterDf(e.target.value)}
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
                onClick={() => handleListData()}
                sx={{ height: 40, mr:5 }}
              >
                Rechercher
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleExportToPDF()}
                sx={{ height: 40 }}
              >
                Exporter PDF
              </Button>
            </Box>
          </Box>
          <hr />
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            onReload={() => {
              setValue('')
              setDd('')
              setDf('')
              setSituations([])
            }}
          />
          <DataGrid
            autoHeight
            loading={statusSituation}
            rowHeight={62}
            rows={situations as never[]}
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

export default StatStockList
