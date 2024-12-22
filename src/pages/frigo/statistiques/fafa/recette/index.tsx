/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
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
import TableHeader from 'src/frigo/views/reglements/list/TableHeader'
import { TextField } from '@mui/material'
import EntreeService from 'src/frigo/logic/services/EntreeService'
import Mouvement from 'src/frigo/logic/models/Mouvement'
import { formatDateEnAnglais } from 'src/frigo/logic/utils/constant'
import { generatePdfStockEntree } from 'src/frigo/views/pdfMake/StockListEntree'
import Facture from 'src/frigo/logic/models/Facture'
import { generatePdfRecettePeriode } from 'src/frigo/views/pdfMake/RecettePeriode'

interface CellType {
  row: Facture
}

interface ColumnType {
  [key: string]: any
}

const StatRecettePeriode = () => {
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
  const getColumns = (
  ) => {
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
        width: 180,
        field: 'createdAt',
        renderHeader: () => (
          <Tooltip title='Date facture'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Date facture
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
        width: 120,
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
        width: 100,
        field: 'tax',
        renderHeader: () => (
          <Tooltip title='Tax'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Tax
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { taxe } = row

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
                  {taxe}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 150,
        field: 'nbproduit',
        renderHeader: () => (
          <Tooltip title='Nombre(s) Produit(s)'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              NB Produit
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { nbproduit } = row

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
                  {nbproduit}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 180,
        field: 'totalfacture',
        renderHeader: () => (
          <Tooltip title='Montant Facture'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Montant Facture
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { totalfacture } = row

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
                  {totalfacture}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 100,
        field: 'statut',
        renderHeader: () => (
          <Tooltip title='Statut'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Statut
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { statut } = row

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
                  {statut}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 200,
        field: 'margeBene',
        renderHeader: () => (
          <Tooltip title='Benefice'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Montant Fact Achat
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { margeBene } = row

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
                  {margeBene}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 200,
        field: 'margeBeneRel',
        renderHeader: () => (
          <Tooltip title='Benefice'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Benefice
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { margeBene, totalfacture } = row

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
                  {Number(totalfacture) - Number(margeBene)}
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
      const res = await entreeService.listRecettePeriode({ dd: dd, df: df })

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
        generatePdfRecettePeriode(situations as never[], 'Situation - Liste_Des_Ventes', dd, df);
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
            Recette ventes sur periodes
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

export default StatRecettePeriode
