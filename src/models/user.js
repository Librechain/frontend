import AbstractModel from './abstractModel'

export default class UserModel extends AbstractModel {
	defaults() {
		return {
			id: 0,
			email: '',
			username: '',
			created: 0,
			updated: 0
		}
	}
}