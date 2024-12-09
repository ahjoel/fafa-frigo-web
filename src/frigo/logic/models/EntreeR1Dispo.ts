import MainModel from './MainModel'
import Produit from './Produit'

export default class EntreeR1Dispo extends MainModel {
  produit: Produit | string
  produitId: number
  categorie: string
  st_dispo: string
  stockMinimal: string
  pv: string

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
    fournisseur = '',
    st_dispo = '',
    stockMinimal = '',
    pv = ''
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.produit = produit
    this.produitId = produitId
    this.categorie = categorie
    this.st_dispo = st_dispo
    this.stockMinimal = stockMinimal
    this.pv = pv
  }
}
