// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  const userProfil = window.localStorage.getItem('profile')
  const godMode = userProfil === 'GOD_MODE' ? true : false
  const adminMode = userProfil === 'ADMINISTRATEUR' ? true : false
  const facturierMode = userProfil === 'FACTURIER' ? true : false

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
        title: `Liste factures`,
        path: "/frigo/factures/list",
      },
    ],
  };

  const Reglements = {
    title: "Règlements",
    icon: "tabler:currency-dollar",
    children: [
      {
        title: `Liste Règlements`,
        path: "/frigo/reglements/list",
      },
      {
        title: `Situation Règlements`,
        path: "/frigo/reglements/situation",
      },
    ],
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

  // GODE-MODE
  godMode && navArray.push(Configuration);
  godMode && navArray.push(Stock);
  godMode && navArray.push(Facturation);
  godMode && navArray.push(Reglements);
  godMode && navArray.push(Users);
  godMode && navArray.push(Statistiques);

  return navArray
}

export default navigation
