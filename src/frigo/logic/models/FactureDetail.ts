import MainModel from './MainModel'

export default class FactureDetail extends MainModel {
  produit: string
  statut: string
  categorie: string
  mesure: string
  fournisseur: string
  qte: number
  pv: number
  factureId: number
  produitId: number
  codeFacture: string
  client: string
  dateFacture: string

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    produit = '',
    categorie = '',
    mesure = '',
    qte = 0,
    pv = 0,
    factureId = 0,
    produitId = 0,
    fournisseur = '',
    codeFacture = '',
    client = '',
    statut = '',
    dateFacture = ''
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.produit = produit
    this.categorie = categorie
    this.mesure = mesure
    this.fournisseur = fournisseur
    this.qte = qte
    this.pv = pv
    this.factureId = factureId
    this.produitId = produitId
    this.codeFacture = codeFacture
    this.client = client
    this.statut = statut
    this.dateFacture = dateFacture
  }
}
