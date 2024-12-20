import Fournisseur from './Fournisseur'
import MainModel from './MainModel'
import Produit from './Produit'

export default class Entree extends MainModel {
  code: string
  produit: Produit | string
  produitId: number
  model: string
  mesure: string
  fournisseur: Fournisseur | string
  fournisseurId: number
  stock: string
  qte: number
  pa: number

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    code = '',
    produit = new Produit(),
    produitId = 0,
    model = '',
    mesure = '',
    fournisseur = new Fournisseur(),
    fournisseurId = 0,
    stock = '',
    qte = 0,
    pa = 0
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.code = code
    this.produit = produit
    this.produitId = produitId
    this.model = model
    this.mesure = mesure
    this.fournisseur = fournisseur
    this.fournisseurId = fournisseurId
    this.stock = stock
    this.qte = qte
    this.pa = pa
  }
}
