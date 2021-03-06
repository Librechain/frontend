import AbstractService from './abstractService'
import PasswordResetModel from '../models/passwordReset'

export default class PasswordResetService extends AbstractService {

	constructor() {
		super({})
		this.paths = {
			reset: '/user/password/reset',
			requestReset: '/user/password/token',
		}
	}

	modelFactory(data) {
		return new PasswordResetModel(data)
	}

	resetPassword(model) {
		const cancel = this.setLoading()
		return this.http.post(this.paths.reset, model)
			.catch(error => {
				return this.errorHandler(error)
			})
			.then(response => {
				return Promise.resolve(this.modelFactory(response.data))
			})
			.finally(() => {
				cancel()
			})
	}

	requestResetPassword(model) {
		const cancel = this.setLoading()
		return this.http.post(this.paths.requestReset, model)
			.catch(error => {
				return this.errorHandler(error)
			})
			.then(response => {
				return Promise.resolve(this.modelFactory(response.data))
			})
			.finally(() => {
				cancel()
			})
	}
}