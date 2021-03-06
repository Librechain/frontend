import AbstractService from './abstractService'
import TeamModel from '../models/team'
import {formatISO} from 'date-fns'

export default class TeamService extends AbstractService {
	constructor() {
		super({
			create: '/teams',
			get: '/teams/{id}',
			getAll: '/teams',
			update: '/teams/{id}',
			delete: '/teams/{id}',
		});
	}

	processModel(model) {
		model.created = formatISO(model.created)
		model.updated = formatISO(model.updated)
		return model
	}

	modelFactory(data) {
		return new TeamModel(data)
	}
}