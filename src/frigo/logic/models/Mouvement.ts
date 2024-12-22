import MainModel from './MainModel'
import Produit from './Produit'

export default class Mouvement extends MainModel {
  produit: Produit | string
  code: string
  fournisseur: string
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
  qte: number
  name: string

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
    code = '',
    fournisseur = '',
    mesure = '',
    st_dispo = 0,
    st_init = 0,
    qt_e = 0,
    qt_s = 0,
    stockMinimal = '',
    pv = 0,
    margeBene = 0,
    qte = 0,
    name = ''
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.produit = produit
    this.produitId = produitId
    this.categorie = categorie
    this.code = code
    this.fournisseur = fournisseur
    this.mesure = mesure
    this.st_dispo = st_dispo
    this.stockMinimal = stockMinimal
    this.pv = pv
    this.margeBene = margeBene
    this.st_init = st_init
    this.qt_e = qt_e
    this.qt_s = qt_s
    this.qte = qte
    this.name = name
  }
}
