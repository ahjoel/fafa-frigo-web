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
import TableHeader from 'src/frigo/views/factures/TableHeader'
import { t } from 'i18next'
import DeleteIcon from '@mui/icons-material/Delete'
import { LoadingButton } from '@mui/lab'
import Facture from 'src/frigo/logic/models/Facture'
import FactureService from 'src/frigo/logic/services/FactureService'
import AddFactureDrawer from 'src/frigo/views/factures/AddFactureDrawer'
import { CircularProgress } from '@mui/material'
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

interface CellType {
  row: Facture
}

interface CellTypeFacture {
  row: FactureDetail
}

interface ColumnType {
  [key: string]: any
}

interface Styles {
  [key: string]: React.CSSProperties
}

const styles: Styles = {
  '*': {
    fontSize: '10px',
    fontFamily: 'Times New Roman',
    color: 'black'
  },
  'td, th, tr, table': {
    borderTop: '1px solid black',
    borderCollapse: 'collapse'
  },
  '.description': {
    width: '180px',
    maxWidth: '180px',
    textAlign: 'justify'
  },
  '.quantity': {
    width: '50px',
    maxWidth: '50px',
    wordBreak: 'break-all',
    textAlign: 'center'
  },
  '.price': {
    width: '65px',
    maxWidth: '65px',
    wordBreak: 'break-all',
    textAlign: 'center'
  },
  '.total': {
    fontWeight: 'bold',
    width: '85px',
    textAlign: 'center',
    alignContent: 'center'
  },
  '.centered': {
    textAlign: 'center',
    alignContent: 'center'
  },
  '.colTotal': {
    fontWeight: 'bold',
    textAlign: 'center',
    alignContent: 'center'
  },
  '.ticket': {
    width: '300px',
    maxWidth: '300px'
  },
  img: {
    maxWidth: 'inherit',
    width: 'inherit'
  }
}

const FactureList = () => {
  const factureService = new FactureService()
  const mouvementService = new SortieR1Service()
  const produitService = new ProduitService()
  const clientService = new ClientService()
  const userData = JSON.parse(window.localStorage.getItem('userData') as string)
  const profile = userData?.profile
  const stock = userData?.zone

  // Delete Confirmation - State
  const [sendDelete, setSendDelete] = useState<boolean>(false)
  const [sendPayement, setSendPayement] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [openPayement, setOpenPayement] = useState<boolean>(false)
  const [openPrint, setOpenPrint] = useState<boolean>(false)
  const handleClose = () => setOpen(false)
  const handleClosePayement = () => setOpenPayement(false)
  const handleClosePrint = () => setOpenPrint(false)
  const [comfirmationMessage, setComfirmationMessage] = useState<string>('')
  const [comfirmationMessagePayement, setComfirmationMessagePayement] = useState<string>('')
  const [comfirmationFunction, setComfirmationFunction] = useState<() => void>(() => console.log(' .... '))
  const [comfirmationPayement, setComfirmationPayement] = useState<() => void>(() => console.log(' .... '))

  // const [comfirmationPayementFunction, setComfirmationFunction] = useState<() => void>(() => console.log(' .... '))

  const handlePayementFacture = (facture: Facture) => {
    setCurrentFacture(facture)
    setComfirmationMessagePayement(`Voulez-vous régler la facture ${facture.code} de ${facture.totalfacture} F CFA ?`)
    setComfirmationPayement(() => () => payementFacture(facture))
    setOpenPayement(true)
  }

  const payementFacture = async (facture: Facture) => {
    setSendPayement(true)

    const dataSave = {
      facture_id: facture.id,
      total: Number(facture.totalfacture)
    }

    try {
      const response = await factureService.createReglement(dataSave)

      if (response.success) {
        setSendPayement(false)
        handleChange()
        handleClosePayement()
        setOpenNotification(true)
        setTypeMessage('success')
        setMessage('Facture réglée avec succès')
      } else {
        setSendPayement(false)
        setOpenNotification(true)
        setTypeMessage('error')
        setMessage('Facture non trouvé')
      }
    } catch (error) {
      console.error('Erreur lors du reglement de facture :', error)
      setSendPayement(false)
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage('Une erreur est survenue')
    }
  }

  const handleDeleteFacture = (facture: Facture) => {
    setCurrentFacture(facture)
    setComfirmationMessage(`Voulez-vous réellement supprimer cette facture : ${facture.code} ?`)
    setComfirmationFunction(() => () => deleteFacture(facture))
    setOpen(true)
  }

  const deleteFacture = async (facture: Facture) => {
    setSendDelete(true)

    try {
      const rep = await factureService.delete(facture.id)

      if (rep === null) {
        setSendDelete(false)
        handleChange()
        handleClose()
        setOpenNotification(true)
        setTypeMessage('success')
        setMessage('Facture supprimé avec succes')
      } else {
        setSendDelete(false)
        setOpenNotification(true)
        setTypeMessage('error')
        setMessage('Facture non trouvé')
      }
    } catch (error) {
      console.error('Erreur lors de la suppression :', error)
      setSendDelete(false)
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage('Une erreur est survenue')
    }
  }

  const handleDeleteProduitFacture = (facture: FactureDetail) => {
    setCurrentFactureDetail(facture)
    setComfirmationMessage(`Voulez-vous réellement supprimer cette facture : ${facture.produit} ?`)
    setComfirmationFunction(() => () => deleteFactureDetail(facture))
    setOpen(true)
  }

  const deleteFactureDetail = async (facture: FactureDetail) => {
    setSendDelete(true)

    try {
      const rep = await mouvementService.delete(facture.id)

      if (rep === null) {
        setSendDelete(false)
        handleChangeFactureAndDetail()
        getDetailsFactureForPrint()
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
  const [valueDetFact, setValueDetFact] = useState<string>('')

  // Notifications - snackbar
  const [openNotification, setOpenNotification] = useState<boolean>(false)
  const [typeMessage, setTypeMessage] = useState('info')
  const [message, setMessage] = useState('')

  const handleSuccess = (message: string, type = 'success') => {
    getDetailsFactureForPrint()
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

  const [statusFactures, setStatusFactures] = useState<boolean>(true)
  const [factures, setFactures] = useState<Facture[]>([])
  const [produits, setProduits] = useState<Produit[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [addFactureOpen, setAddFactureOpen] = useState<boolean>(false)
  const [addFactureDetailOpen, setAddFactureDetailOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [currentFacture, setCurrentFacture] = useState<null | Facture>(null)
  const [currentFactureDetail, setCurrentFactureDetail] = useState<null | FactureDetail>(null)

  const [openFacture, setOpenFacture] = useState(false)
  const [statusFactureDetail, setStatusFactureDetail] = useState<boolean>(true)
  const [statusFactureDetailPrint, setStatusFactureDetailPrint] = useState<boolean>(true)
  const [facturesDetails, setFacturesDetails] = useState<FactureDetail[]>([])
  const [facturesDetailsPrint, setFacturesDetailsPrint] = useState<FactureDetail[]>([])

  const [code, setCode] = useState<string>('')
  const [etatFacture, setEtatFacture] = useState<string>('')

  const [idFacture, setIdFacture] = useState<number>(-1)
  const [totalFacture, setTotalFacture] = useState<string>('')
  const [columnsFacture, setColumnsFacture] = useState<ColumnType[]>([])
  const [paginationModelFacture, setPaginationModelFacture] = useState({ page: 0, pageSize: 10 })

  // const handleCloseFacture = () => setOpenFacture(false);

  const handleOpenModalFacture = (arecode: string, etat: string, idFact: number) => {
    setCode(arecode)
    setEtatFacture(etat)
    setIdFacture(idFact)
    setOpenFacture(true)
  }

  const handleOpenModalPrintFacture = (arecode: string, totalfacture: string) => {
    setCode(arecode)
    setTotalFacture(totalfacture)
    setOpenPrint(true)
  }

  // Display of columns according to user roles in the Datagrid
  const getColumns = (
    handleUpdateFacture: (facture: Facture) => void,
    handleDeleteFacture: (facture: Facture) => void,
    handlePayementFacture: (facture: Facture) => void
  ) => {
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
        width: 200,
        field: 'createdAt',
        renderHeader: () => (
          <Tooltip title='Date creation'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              Date creation
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
        width: 200,
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
              Nombre(s) Produit(s)
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
        width: 200,
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
              justifyContent: 'center', // Centrer horizontalement
              alignItems: 'center' // Centrer verticalement
            }}
          >
            {row.statut === 'impayée' && (
              <Tooltip title='Régler la facture'>
                <IconButton
                  size='small'
                  sx={{ color: 'text.primary' }}
                  onClick={() => {
                    {
                      handlePayementFacture(row)
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', color: theme => theme.palette.info.main }}>
                    <Icon icon='tabler:currency-dollar' />
                  </Box>
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title={'Afficher détail facture'}>
              <IconButton
                size='small'
                sx={{ color: 'text.primary' }}
                onClick={() => {
                  handleOpenModalFacture(row.code, row.statut, row.id)
                }}
              >
                <Box sx={{ display: 'flex', color: theme => theme.palette.info.main }}>
                  <Icon icon='tabler:list' />
                </Box>
              </IconButton>
            </Tooltip>

            {row.statut === 'impayée' && (
              <Tooltip title='Mettre à jour la facture'>
                <IconButton
                  size='small'
                  sx={{ color: 'text.primary' }}
                  onClick={() => {
                    handleUpdateFacture(row)
                  }}
                >
                  <Box sx={{ display: 'flex', color: theme => theme.palette.success.main }}>
                    <Icon icon='tabler:edit' />
                  </Box>
                </IconButton>
              </Tooltip>
            )}

            {row.statut === 'impayée' && (profile === 'ADMINISTRATEUR' || profile === 'GODE_MODE') && (
              <Tooltip title='Supprimer'>
                <IconButton
                  size='small'
                  sx={{ color: 'text.primary' }}
                  onClick={() => {
                    handleDeleteFacture(row)
                  }}
                >
                  <Box sx={{ display: 'flex', color: theme => theme.palette.error.main }}>
                    <Icon icon='tabler:trash' />
                  </Box>
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title='Voir la facture'>
              <IconButton
                size='small'
                sx={{ color: 'text.primary' }}
                onClick={() => handleOpenModalPrintFacture(row.code, row.totalfacture)}
              >
                <Box sx={{ display: 'flex', color: theme => theme.palette.info.main }}>
                  <Icon icon='tabler:file-plus' />
                </Box>
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
    ]

    return colArray
  }

  const getColumnsFactureDetail = (handleDeleteProduitFacture: (facture: FactureDetail) => void) => {
    const colArray: ColumnType[] = [
      {
        width: 300,
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
        renderCell: ({ row }: CellTypeFacture) => {
          const { produit } = row

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'secondary.main'
                  }}
                >
                  {produit}
                </Typography>
              </Box>
            </Box>
          )
        }
      },
      {
        width: 120,
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
        renderCell: ({ row }: CellTypeFacture) => {
          const { categorie } = row

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'secondary.main'
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
          <Tooltip title='Quantité'>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem',
                whiteSpace: 'normal',
                textAlign: 'left'
              }}
            >
              Quantité
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellTypeFacture) => {
          const { qte } = row

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'secondary.main'
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
                fontSize: '0.8125rem',
                whiteSpace: 'normal',
                textAlign: 'left'
              }}
            >
              Prix de vente
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellTypeFacture) => {
          const { pv } = row

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'secondary.main'
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
    if (etatFacture === 'impayée') {
      colArray.push({
        width: 100,
        sortable: false,
        field: 'action',
        renderHeader: () => (
          <Tooltip title={t('Action')}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontSize: '0.8125rem'
              }}
            >
              {t('Action')}
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellTypeFacture) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Mettre à jour un produit de facture'>
              <IconButton
                size='small'
                sx={{ color: 'text.primary' }}
                onClick={() => {
                  // handleUpdateProduitFacture(row)
                }}
              >
                {/* <Box sx={{ display: 'flex', color: theme => theme.palette.success.main }}>
                    <Icon icon='tabler:edit' />
                  </Box> */}
              </IconButton>
            </Tooltip>

            {etatFacture === 'impayée' && (
              <Tooltip title='Supprimer'>
                <IconButton
                  size='small'
                  sx={{ color: 'text.primary' }}
                  onClick={() => {
                    handleDeleteProduitFacture(row)
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
      })
    }

    return colArray
  }

  // Axios call to loading Data
  const getListFactures = async () => {
    const result = await factureService.listFactures()

    if (result.success) {
      const queryLowered = value.toLowerCase()
      const filteredData = (result.data as Facture[]).filter(facture => {
        return (
          facture.code.toString().toLowerCase().includes(queryLowered) ||
          facture.createdAt.toLowerCase().includes(queryLowered) ||
          facture.client.toString().toLowerCase().includes(queryLowered) ||
          facture.taxe.toString().toLowerCase().includes(queryLowered) ||
          facture.nbproduit.toLowerCase().includes(queryLowered) ||
          facture.statut.toLowerCase().includes(queryLowered)
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

  const getDetailsFacture = async () => {
    setStatusFactureDetail(true)
    const result = await factureService.listFactureDetail({ code: code || null })

    if (result.success) {
      setStatusFactureDetail(false)
      const queryLowered = valueDetFact.toLowerCase()
      const filteredDatas = (result.data as FactureDetail[]).filter(detail => {
        return (
          detail.produit.toLowerCase().includes(queryLowered) ||
          detail.categorie.toLowerCase().includes(queryLowered) ||
          detail?.fournisseur.toLowerCase().includes(queryLowered) ||
          detail.qte.toString().toLowerCase().includes(queryLowered) ||
          detail.pv.toString().toLowerCase().includes(queryLowered)
        )
      })
      setFacturesDetails(filteredDatas)
      setStatusFactures(false)
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage('Une erreur est survenue lors du chargement des produits de facture')
    }
  }

  const printReceipt = (facturesDetailsPrint: FactureDetail[]) => {
    const rows = facturesDetailsPrint
      ?.map(
        (facturesDetp) => `
        <div class="details-row">
          <span>${facturesDetp.qte}</span>
          <span>${facturesDetp.produit}</span>
          <span>${facturesDetp.pv.toString().replace(/\B(?=(\\d{3})+(?!\\d))/g, ' ')} F</span>
        </div>
      `
      )
      .join('');
  
    const receiptContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reçu</title>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  font-size: 12px;
                  margin: 0;
                  padding: 0;
              }
  
              .receipt {
                  width: 240px; /* Adapté aux imprimantes thermiques */
                  padding: 10px;
              }
  
              .receipt-header {
                  text-align: center;
                  margin-bottom: 10px;
              }
  
              .receipt-header h1 {
                  font-size: 14px;
                  margin: 0;
              }
  
              .receipt-header p {
                  margin: 2px 0;
              }
  
              .receipt-details {
                  border-top: 1px dashed #000;
                  border-bottom: 1px dashed #000;
                  margin: 10px 0;
                  padding: 10px 0;
              }
  
              .details-row {
                  display: flex;
                  justify-content: space-between;
              }
  
              .details-row span:nth-child(2) {
                  flex: 2;
                  text-align: left;
                  margin-left: 20px;
              }
  
              .details-header span {
                  font-weight: bold;
              }
  
              .total {
                  text-align: center;
                  font-weight: bold;
                  font-size: 14px;
              }
  
              .footer {
                  text-align: center;
                  margin-top: 10px;
              }
  
              .date {
                  text-align: right;
              }
  
          </style>
      </head>
      <body>
          <div class="receipt">
              <div class="receipt-header">
                  <h1>FAFA-FRIGO</h1>
                  <p>Adetikopé</p>
                  <p>Tel : (+228) 90 19 71 38</p>
              </div>
              <div class="details-row">
                  <span style="font-weight: bold">${facturesDetailsPrint[0].codeFacture}</span>
              </div>
              <div class="details-row" style="margin-top:5px">
                  <span class="date">${facturesDetailsPrint[0].dateFacture.slice(0, -5).replace(/T/g, " ")}</span>
                
              </div>
              <div class="receipt-details">
                  <div class="details-row details-header">
                      <span>Qte</span>
                      <span>Description</span>
                      <span>PV</span>
                  </div>
                  ${rows}
              </div>
              <div class="total">
                  TOTAL (XOF) : ${
                    facturesDetailsPrint
                      ?.reduce((sum, item) => sum + item.pv * item.qte, 0)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
                  } F
              </div>
              <div class="footer">
                  BON DE COMMANDE
                  
              </div>
          </div>
          <script>
              window.onload = function () {
                  window.print();
              };
          </script>
      </body>
      </html>
    `;
  
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    printWindow?.document.open();
    printWindow?.document.write(receiptContent);
    printWindow?.document.close();
    printWindow?.print();
  };

  const handlePrint = () => {
    // Masquer les éléments que vous ne souhaitez pas imprimer
    const dialogActions = document.querySelector('.dialog-actions-dense') as HTMLElement | null
    if (dialogActions) {
      dialogActions.style.display = 'none'
    }

    // Imprimer la fenêtre actuelle
    window.print()

    // Rétablir l'affichage des éléments masqués après l'impression
    if (dialogActions) {
      dialogActions.style.display = 'flex'
    }
  }

  const getDetailsFactureForPrint = async () => {
    setStatusFactureDetailPrint(true)
    const result = await factureService.listFactureDetail({ code: code || null })

    if (result.success) {
      setStatusFactureDetailPrint(false)
      setFacturesDetailsPrint(result.data as FactureDetail[])
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage('Une erreur est survenue lors du chargement des produits de facture')
    }
  }

  const handleChange = async () => {
    getListFactures()
  }

  const handleChangeFactureAndDetail = async () => {
    getListFactures()
    getDetailsFacture()
  }

  const handleLoadingClients = async () => {
    const result = await clientService.listClientslongue()

    if (result.success) {
      setClients(result.data as Client[])
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage(result.description)
    }
  }

  const handleLoadingProduits = async () => {
    const result = await produitService.listProduitsLongue()

    if (result.success) {
      setProduits(result.data as Produit[])
    } else {
      setOpenNotification(true)
      setTypeMessage('error')
      setMessage(result.description)
    }
  }

  // Control search data in datagrid
  useEffect(() => {
    handleChange()
    handleLoadingProduits()
    handleLoadingClients()
    setColumns(getColumns(handleUpdateFacture, handleDeleteFacture, handlePayementFacture))
  }, [value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  useEffect(() => {
    getDetailsFacture()
    setColumnsFacture(getColumnsFactureDetail(handleDeleteProduitFacture))
    getDetailsFactureForPrint()
  }, [code, valueDetFact])

  const handleFilterDet = useCallback((valFact: string) => {
    setValueDetFact(valFact)
  }, [])

  // Show Modal
  const toggleAddFactureDrawer = () => setAddFactureOpen(!addFactureOpen)
  const toggleAddFactureDetailDrawer = () => setAddFactureDetailOpen(!addFactureDetailOpen)

  // Update Data
  const handleUpdateFacture = (facture: Facture) => {
    setCurrentFacture(facture)
    toggleAddFactureDrawer()
  }

  const handleAddProduitFacture = () => {
    setOpenFacture(false)
    setCurrentFactureDetail(null)
    toggleAddFactureDetailDrawer()
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

        {/* Modal List of Detail Facture */}
        <Dialog
          fullWidth
          open={openFacture}
          maxWidth='md'
          scroll='body'
          onClose={() => {
            setOpenFacture(false)
          }}
        >
          <DialogContent
            sx={{
              position: 'relative',
              px: theme => [`${theme.spacing(2)} !important`, `${theme.spacing(6)} !important`],
              py: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(10)} !important`]
            }}
          >
            <IconButton
              size='small'
              onClick={() => {
                setOpenFacture(false)
              }}
              sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
            >
              <Icon icon='tabler:x' />
            </IconButton>
            <Box sx={{ mb: 0.5, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 1 }}>
                {'Liste des produits de la facture '} - {code}
              </Typography>
            </Box>

            <TableHeaderDetail
              value={valueDetFact}
              handleFilterDetail={handleFilterDet}
              toggle={handleAddProduitFacture}
              etatFacture={etatFacture}
            />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ height: 500, width: '100%' }}>
                {statusFactureDetail ? (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
                    <CircularProgress />
                  </div>
                ) : (
                  <DataGrid
                    loading={statusFactureDetail}
                    rows={facturesDetails as never[]}
                    columns={columnsFacture as GridColDef<never>[]}
                    disableRowSelectionOnClick
                    pageSizeOptions={[10, 25, 50]}
                    pagination
                    paginationModel={paginationModelFacture}
                    onPaginationModelChange={setPaginationModelFacture}
                  />
                )}
              </Box>
            </Box>
          </DialogContent>
        </Dialog>

        {/* Print Facture Modal */}
        {/* <PrintReceiptDialog open={openPrint} closeDialog={handleClosePrint} codeFact={code} totalFacture={totalFacture} /> */}

        {/*  */}
        <Dialog
          open={openPrint}
          disableEscapeKeyDown
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          onClose={(event, reason) => {
            if (reason != 'backdropClick') {
              handleClosePrint()
            }
          }}
        >
          <DialogContent sx={{ color: 'black' }}>
            <div className='ticket' style={styles['.ticket']}>
              {/* <img src='./logo.png' alt='Logo' style={styles.img} /> */}
              <p className='centered' style={styles['.centered']}>
                FAFA-FRIGO
                <br />
                Adetikope
                <br />
                Tel : (+228) 90 19 71 38
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ margin: 0 }}>
                  <>{facturesDetailsPrint[0]?.codeFacture}</> 
                </p>
                <p style={{ margin: 0 }}>
                  <>{facturesDetailsPrint[0]?.dateFacture.slice(0, -5).replace(/T/g, " ")}</> 
                </p>
              </div>
              <table style={styles['td, th, tr, table']}>
                <thead>
                  <tr>
                    <th className='quantity' style={styles['.quantity']}>
                      Qte
                    </th>
                    <th className='description' style={styles['.description']}>
                      Description
                    </th>
                    <th className='price' style={styles['.price']}>
                      PV
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!statusFactureDetailPrint ? (
                    facturesDetailsPrint?.map(facturesDetp => (
                      <tr key={facturesDetp.id}>
                        <td className='quantity' style={styles['.quantity']}>
                          {facturesDetp.qte}
                        </td>
                        <td className='description' style={styles['.description']}>
                          {facturesDetp.produit}
                        </td>
                        <td className='price' style={styles['.price']}>
                          {facturesDetp.pv.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} F
                        </td>
                      </tr>
                    ))
                  ) : (
                    <CircularProgress />
                  )}

                  <tr>
                    <td className='quantity' style={styles['.quantity']}></td>
                    <td className='description' style={styles['.colTotal']}>
                      TOTAL (XOF) :{' '}
                    </td>
                    <td className='price' style={styles['.total']}>
                      {totalFacture.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} F
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className='centered' style={styles['.centered']}>
                BON DE COMMANDE
              </p>
            </div>
          </DialogContent>

          <DialogActions className='dialog-actions-dense' style={{ visibility: openPrint ? 'visible' : 'hidden' }}>
            <Button variant='contained' onClick={handleClosePrint} color='secondary'>
              {t('Cancel')}
            </Button>
            <Button variant='contained' onClick={() => printReceipt(facturesDetailsPrint)}>
              <span>Imprimer</span> <PrintIcon />
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>

      {/* Add or Update Right Modal */}
      <AddFactureDrawer
        open={addFactureOpen}
        toggle={toggleAddFactureDrawer}
        onEdit={handleChange}
        clients={clients}
        currentFacture={currentFacture}
        onSuccess={handleSuccess}
      />

      {/* Ajouter un produit sur une facture impayée */}
      {
        etatFacture === 'impayée' && (
          <AddFactureDetailDrawer
            open={addFactureDetailOpen}
            toggle={toggleAddFactureDetailDrawer}
            onAdd={handleChangeFactureAndDetail}
            products={produits}
            codeFact={code}
            factureId={idFacture}
            currentFactureDetail={currentFactureDetail}
            onSuccess={handleSuccess}
          />
        )
      }

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
          if (reason != 'backdropClick') {
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

      {/* Payement Modal Confirmation */}
      <Dialog
        open={openPayement}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason != 'backdropClick') {
            handleClosePayement()
          }
        }}
      >
        <DialogTitle id='alert-dialog-title'>Confirmation de Payement</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description' sx={{ color: 'black' }}>
            {t(comfirmationMessagePayement)}
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleClosePayement} color='secondary'>
            {t('Cancel')}
          </Button>
          <LoadingButton
            onClick={() => {
              comfirmationPayement()
            }}
            loading={sendPayement}
            endIcon={<PaymentIcon />}
            variant='contained'
            color='info'
          >
            Régler
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Grid>    
  )
}

export default FactureList
