import MainService from './MainService'

export default class InventaireService extends MainService {
  constructor() {
    super('/inventaire')
  }
}
