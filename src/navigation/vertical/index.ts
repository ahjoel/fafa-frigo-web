// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  const userProfil = window.localStorage.getItem('profile')
  const adminMode = userProfil === 'ADMINISTRATEUR' ? true : false
  const gerantMode = userProfil === 'GERANT' ? true : false
  const caissierMode = userProfil === 'CAISSIER' ? true : false
  const caissierFacturierMode = userProfil === 'CAISSIER-FACTURIER' ? true : false

  const Dashboard = {
    title: 'Dashboards',
    icon: 'tabler:smart-home',
    path: '/frigo/dashboard'
  }

  const Configuration = {
    title: "Configuration",
    icon: "tabler:settings",
    children: [
      {
        title: `Liste des clients`,
        path: "/frigo/clients/list",
      },
      {
        title: `Liste des fournisseurs`,
        path: "/frigo/fournisseurs/list",
      },
      {
        title: `Liste des produits`,
        path: "/frigo/produits/list",
      },
    ],
  };
  const Stock = {
    title: "Stock",
    icon: "tabler:package",
    children: [
      {
        title: `Stock Entree`,
        path: "/frigo/entree/list",
      },
      {
        title: `Stock Disponible`,
        path: "/frigo/stockDispo",
      },
    ],
  };

  const Facturation = {
    title: "Facturation",
    icon: "tabler:clipboard-text",
    children: [
      {
        title: `Facture en cours`,
        path: "/frigo/factureEnCours",
      },
      {
        title: `Liste factures generales`,
        path: "/frigo/factures/list",
      },
      {
        title: `Liste factures gros`,
        path: "/frigo/factures/gros",
      },
      {
        title: `Liste factures details`,
        path: "/frigo/factures/details",
      }
    ],
  };

  const Reglements = {
    title: `Liste des Règlements`,
    icon: "tabler:currency-dollar",
    path: "/frigo/reglements/list",
  };

  const Statistiques = {
    title: "Statistiques",
    icon: "tabler:file-plus",
    children: [
      {
        title: "Statistique des factures",
        path: "/frigo/statistiques/listeDesFactures/",
      },
      {
        title: "Statistique des ventes",
        path: "/frigo/statistiques/listeDesReglements/",
      },
      {
        title: "Invent. stock",
        path: "/frigo/statistiques/listeDesFacturesStockGene/",
      },
      {
        title: "Caisse Mensuelle",
        path: "/frigo/statistiques/listeDesReglementPerMonth/",
      },
    ],
  };

  const Users = {
    title: `Liste des utilisateurs`,
    icon: "tabler:users",
    path: "/frigo/users/list",
  };


  const navArray: any = [Dashboard]

  // ADMIN-MODE
  adminMode && navArray.push(Configuration);
  adminMode && navArray.push(Stock);
  adminMode && navArray.push(Facturation);
  adminMode && navArray.push(Reglements);
  adminMode && navArray.push(Users);
  adminMode && navArray.push(Statistiques);

  // GERANT-MODE
  gerantMode && navArray.push(Configuration);
  gerantMode && navArray.push(Stock);
  gerantMode && navArray.push(Facturation);
  gerantMode && navArray.push(Reglements);
  gerantMode && navArray.push(Users);
  gerantMode && navArray.push(Statistiques);

  // CAISSIER-MODE
  caissierMode && navArray.push(Facturation.children[1],Facturation.children[2],Facturation.children[3]);
  caissierMode && navArray.push(Reglements);
  caissierMode && navArray.push(Statistiques);

  // CAISSIER-FACTURIER-MODE
  caissierFacturierMode && navArray.push(Stock);
  caissierFacturierMode && navArray.push(Facturation);
  caissierFacturierMode && navArray.push(Reglements);
  caissierFacturierMode && navArray.push(Statistiques);

  return navArray
}

export default navigation
