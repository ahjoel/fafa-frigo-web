import MainModel from './MainModel'

export default class Reglement extends MainModel {
  firstname: string
  lastname: string
  codeFacture: string
  mtrecu: string
  relicat: string
  totalFacture: string
  client: string

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    firstname = '',
    lastname = '',
    codeFacture = '',
    mtrecu = '',
    relicat = '',
    totalFacture = '',
    client = ''
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.firstname = firstname
    this.lastname = lastname
    this.codeFacture = codeFacture
    this.mtrecu = mtrecu
    this.relicat = relicat
    this.totalFacture = totalFacture
    this.client = client
  }
}
