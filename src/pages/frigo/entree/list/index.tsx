/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";
import Icon from "src/@core/components/icon";
import TableHeader from "src/frigo/views/entree/list/TableHeader";
import { t } from "i18next";
import Produit from "src/frigo/logic/models/Produit";
import ProduitService from "src/frigo/logic/services/ProduitService";
import EntreeService from "src/frigo/logic/services/EntreeService";
import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import Entree from "src/frigo/logic/models/Entree";
import AddEntreeDrawer from "src/frigo/views/entree/list/AddEntreeDrawer";
import Fournisseur from "src/frigo/logic/models/Fournisseur";
import FournisseurService from "src/frigo/logic/services/FournisseurService";

interface CellType {
  row: Entree;
}

interface ColumnType {
  [key: string]: any;
}

const EntreeList = () => {
  const produitService = new ProduitService();
  const entreeService = new EntreeService();
  const fournisseurService = new FournisseurService();
  const produitId = 0;
  const fournisseurId = 0;

  // Delete Confirmation - State
  const [sendDelete, setSendDelete] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const handleClose = () => setOpen(false);
  const [comfirmationMessage, setComfirmationMessage] = useState<string>("");
  const [comfirmationFunction, setComfirmationFunction] = useState<() => void>(
    () => console.log(" .... ")
  );

  const handleDeleteEntree = (entree: Entree) => {
    setCurrentEntree(entree);
    setComfirmationMessage(
      "Voulez-vous réellement supprimer ce produit du stock ?"
    );
    setComfirmationFunction(() => () => deleteEntree(entree));
    setOpen(true);
  };

  const deleteEntree = async (entree: Entree) => {
    setSendDelete(true);

    try {
      const rep = await entreeService.delete(entree.id);

      if (rep === null) {
        setSendDelete(false);
        handleChange();
        handleClose();
        setOpenNotification(true);
        setTypeMessage("success");
        setMessage("Produit du stock supprimé avec succes");
      } else {
        setSendDelete(false);
        setOpenNotification(true);
        setTypeMessage("error");
        setMessage("Produit du stock non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setSendDelete(false);
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage("Une erreur est survenue");
    }
  };

  // Search State
  const [value, setValue] = useState<string>("");

  // Notifications - snackbar
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [typeMessage, setTypeMessage] = useState("info");
  const [message, setMessage] = useState("");

  const handleSuccess = (message: string, type = "success") => {
    setOpenNotification(true);
    setTypeMessage(type);
    const messageTrans = t(message);
    setMessage(messageTrans);
  };

  const handleCloseNotification = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      setOpenNotification(false);
    }
    setOpenNotification(false);
  };

  // Loading Agencies Data, Datagrid and pagination - State
  const [statusEntree, setStatusEntree] = useState<boolean>(true);
  const [entreesR1, setEntreesR1] = useState<Entree[]>([]);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [addEntreeOpen, setAddEntreeOpen] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [currentEntree, setCurrentEntree] = useState<null | Entree>(null);

  const [produits, setProduits] = useState<Produit[]>([]);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);

  // Display of columns according to user roles in the Datagrid
  const getColumns = (handleUpdateEntree: (entree: Entree) => void) => {
    const colArray: ColumnType[] = [
      {
        width: 100,
        field: "code",
        renderHeader: () => (
          <Tooltip title="Code">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Code
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { code } = row;

          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  {code}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        width: 180,
        field: "createdAt",
        renderHeader: () => (
          <Tooltip title="Date insertion">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Date insertion
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { createdAt } = row;

          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: "none",
                    color: "primary.main",
                  }}
                >
                  {createdAt.slice(0, -5).replace(/T/g, " ")}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        width: 350,
        field: "produit",
        renderHeader: () => (
          <Tooltip title="Produit">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Produit
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { produit } = row;

          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: "none",
                    color: "primary.main",
                  }}
                >
                  {produit.toString()}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        width: 120,
        field: "model",
        renderHeader: () => (
          <Tooltip title="Model">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Model
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { model } = row;

          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: "none",
                    color: "primary.main",
                  }}
                >
                  {model.toString()}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        width: 200,
        field: "fournisseur",
        renderHeader: () => (
          <Tooltip title="Fournisseur">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Fournisseur
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { fournisseur } = row;

          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: "none",
                    color: "primary.main",
                  }}
                >
                  {fournisseur.toString()}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        width: 100,
        field: "qte",
        renderHeader: () => (
          <Tooltip title="Quantité">
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              Quantité
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => {
          const { qte } = row;

          return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "column",
                }}
              >
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    textDecoration: "none",
                    color: "primary.main",
                  }}
                >
                  {qte}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      {
        width: 100,
        sortable: false,
        field: "actions",
        renderHeader: () => (
          <Tooltip title={t("Actions")}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
              }}
            >
              {t("Actions")}
            </Typography>
          </Tooltip>
        ),
        renderCell: ({ row }: CellType) => (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Mettre à jour un produit du stock">
              <IconButton
                size="small"
                sx={{ color: "text.primary" }}
                onClick={() => {
                  handleUpdateEntree(row);
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    color: (theme) => theme.palette.success.main,
                  }}
                >
                  <Icon icon="tabler:edit" />
                </Box>
              </IconButton>
            </Tooltip>

            <Tooltip title="Supprimer">
              <IconButton
                size="small"
                sx={{ color: "text.primary" }}
                onClick={() => {
                  handleDeleteEntree(row);
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    color: (theme) => theme.palette.error.main,
                  }}
                >
                  <Icon icon="tabler:trash" />
                </Box>
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ];

    return colArray;
  };

  // Axios call to loading Data
  const getListEntrees = async () => {
    const result = await entreeService.listEntrees();

    if (result.success) {
      setEntreesR1(result.data as Entree[]);
      setStatusEntree(false);
    } else {
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage(result.description);
    }
  };

  const handleSearchOnListEntrees = async () => {
    setStatusEntree(true);
    const queryLowered = value.toLowerCase();

    console.log('value of search', queryLowered);
    
    // Recherche dans les données locales uniquement si elles sont chargées
    if (entreesR1.length > 0) {
      console.log('value of length', entreesR1.length);
      const filteredData = entreesR1.filter((entree) => {
        return (
          entree.code.toString().toLowerCase().includes(queryLowered) ||
          entree.createdAt.toString().toLowerCase().includes(queryLowered) ||
          (entree.produit &&
            entree.produit.toString().toLowerCase().includes(queryLowered)) ||
          entree.model.toString().toLowerCase().includes(queryLowered) ||
          (entree.fournisseur &&
            entree.fournisseur
              .toString()
              .toLowerCase()
              .includes(queryLowered)) ||
          entree.qte.toString().toLowerCase().includes(queryLowered)
        );
      });
      console.log('value of length filteredData', filteredData.length);

      if (filteredData.length > 0) {
        setEntreesR1(filteredData);
        setStatusEntree(false);
        return;
      }else{
        setStatusEntree(false);
        setOpenNotification(true);
        setTypeMessage("info");
        setMessage('Aucun resultat pour cette recherche');
      }
    }
  };

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

  const handleLoadingFournisseurs = async () => {
    const result = await fournisseurService.listFournisseurs();

    if (result.success) {
      setFournisseurs(result.data as Fournisseur[]);
    } else {
      setOpenNotification(true);
      setTypeMessage("error");
      setMessage(result.description);
    }
  };

  const handleChange = async () => {
    getListEntrees();
  };

  // Control search data in datagrid
  useEffect(() => {
    handleChange();
    handleLoadingProduits();
    handleLoadingFournisseurs();
    setColumns(getColumns(handleUpdateEntree));
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchOnListEntrees()  // Lance la recherche seulement lorsqu'on appuie sur "Entrer"
    }
  }

  const handleFilter = useCallback((val: string) => {
    setValue(val);
  }, []);

  // Show Modal
  const toggleAddEntreeDrawer = () => setAddEntreeOpen(!addEntreeOpen);

  // Add Data
  const handleCreateEntree = () => {
    setCurrentEntree(null);
    toggleAddEntreeDrawer();
  };

  // Update Data
  const handleUpdateEntree = (entree: Entree) => {
    setCurrentEntree(entree);
    toggleAddEntreeDrawer();
  };

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            handleKeyPress={handleKeyPress}
            toggle={handleCreateEntree}
            onReload={() => {
              setValue("");
              handleChange();
              handleLoadingProduits();
              handleLoadingFournisseurs();
            }}
          />

          <DataGrid
            autoHeight
            loading={statusEntree}
            rowHeight={62}
            rows={entreesR1 as never[]}
            columns={columns as GridColDef<never>[]}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            pagination
            paginationMode="client"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      {/* Add or Update Right Modal */}
      <AddEntreeDrawer
        open={addEntreeOpen}
        toggle={toggleAddEntreeDrawer}
        onChange={handleChange}
        currentEntree={currentEntree}
        onSuccess={handleSuccess}
        produits={produits}
        produitId={produitId}
        fournisseurs={fournisseurs}
        fournisseurId={fournisseurId}
      />

      {/* Notification */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openNotification}
        onClose={handleCloseNotification}
        autoHideDuration={5000}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={typeMessage as AlertColor}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>

      {/* Delete Modal Confirmation */}
      <Dialog
        open={open}
        disableEscapeKeyDown
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={(event, reason) => {
          if (reason === "backdropClick") {
            handleClose();
          }
        }}
      >
        <DialogTitle id="alert-dialog-title">{t("Confirmation")}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t(comfirmationMessage)}
          </DialogContentText>
        </DialogContent>
        <DialogActions className="dialog-actions-dense">
          <Button onClick={handleClose} color="secondary">
            {t("Cancel")}
          </Button>
          <LoadingButton
            onClick={() => {
              comfirmationFunction();
            }}
            loading={sendDelete}
            endIcon={<DeleteIcon />}
            variant="contained"
            color="error"
          >
            {t("Supprimer")}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default EntreeList;
