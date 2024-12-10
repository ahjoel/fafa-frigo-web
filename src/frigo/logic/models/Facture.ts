import Client from './Client'
import MainModel from './MainModel'

export default class Facture extends MainModel {
  code: string
  client_id: number
  client: Client | string
  taxe: number
  nbproduit: string
  totalfacture: string
  statut: string

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
    client = new Client(),
    taxe = 0,
    nbproduit = '',
    totalfacture = '',
    statut = ''
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.code = code
    this.client_id = client_id
    this.client = client
    this.taxe = taxe
    this.nbproduit = nbproduit
    this.totalfacture = totalfacture
    this.statut = statut
  }
}
