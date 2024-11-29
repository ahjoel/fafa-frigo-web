import Fournisseur from './Fournisseur'
import MainModel from './MainModel'

export default class Produit extends MainModel {
  code: string
  name: string
  categorie: string
  fournisseur: string
  pv: number
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
    categorie = '',
    fournisseur = '',
    pv = 0,
    stock_min = 0
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.code = code
    this.name = name
    this.categorie = categorie
    this.fournisseur = fournisseur
    this.pv = pv
    this.stock_min = stock_min
  }
}
