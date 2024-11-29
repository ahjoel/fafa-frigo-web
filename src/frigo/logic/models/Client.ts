import MainModel from './MainModel'

export default class Client extends MainModel {
  name: string
  contact: string
  adresse: string

  constructor(
    id = -1,
    createdBy = null,
    createdAt = '',
    updatedBy = null,
    updatedAt = '',
    deletedBy = null,
    deletedAt = '',
    name = '',
    contact = '',
    adresse = ''
  ) {
    super(id, createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

    this.name = name
    this.contact = contact
    this.adresse = adresse
  }
}
