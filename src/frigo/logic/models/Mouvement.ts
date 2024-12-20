import MainModel from './MainModel'
import Produit from './Produit'

export default class Mouvement extends MainModel {
  produit: Produit | string
  produitId: number
  categorie: string
  mesure: string
  st_dispo: number
  st_init: number
  qt_e: number
  qt_s: number
  stockMinimal: string
  pv: number
  margeBene: number

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    produit = new Produit(),
    produitId = 0,
    categorie = '',
    mesure = '',
    st_dispo = 0,
    st_init = 0,
    qt_e = 0,
    qt_s = 0,
    stockMinimal = '',
    pv = 0,
    margeBene = 0,
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.produit = produit
    this.produitId = produitId
    this.categorie = categorie
    this.mesure = mesure
    this.st_dispo = st_dispo
    this.stockMinimal = stockMinimal
    this.pv = pv
    this.margeBene = margeBene
    this.st_init = st_init
    this.qt_e = qt_e
    this.qt_s = qt_s
  }
}
