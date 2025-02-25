import Fournisseur from './Fournisseur'
import MainModel from './MainModel'

export default class Produit extends MainModel {
  code: string
  name: string
  mesure: string
  categorie: string
  fournisseur: string
  pv: number
  pa: number
  stock_min: number

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    code = '',
    name = '',
    mesure = '',
    categorie = '',
    fournisseur = '',
    pv = 0,
    pa = 0,
    stock_min = 0
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.code = code
    this.name = name
    this.mesure = mesure
    this.categorie = categorie
    this.fournisseur = fournisseur
    this.pv = pv
    this.pa = pa
    this.stock_min = stock_min
  }
}
