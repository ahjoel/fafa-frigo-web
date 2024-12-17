import MainModel from './MainModel'

export default class FactureEclateDetailGros extends MainModel {
  code: string
  client_id: number
  client: string
  pv: number
  produit: string
  categorie: string
  mesure: string
  qte: number

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    code = '',
    client_id = 0,
    client = '',
    categorie = '',
    pv = 0,
    produit = '',
    mesure = '',
    qte = 0
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.code = code
    this.client_id = client_id
    this.client = client
    this.pv = pv
    this.produit = produit
    this.categorie = categorie
    this.mesure = mesure
    this.qte = qte
  }
}
