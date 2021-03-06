import AbstractService from './abstractService'
import ListModel from '../models/list'
import TaskService from './task'
import {formatISO} from 'date-fns'

export default class ListService extends AbstractService {
	constructor() {
		super({
			create: '/namespaces/{namespaceId}/lists',
			get: '/lists/{id}',
			getAll: '/lists',
			update: '/lists/{id}',
			delete: '/lists/{id}',
		})
	}

	processModel(model) {
		model.created = formatISO(model.created)
		model.updated = formatISO(model.updated)
		return model
	}

	modelFactory(data) {
		return new ListModel(data)
	}

	beforeUpdate(model) {
		let taskService = new TaskService()
		model.tasks = model.tasks.map(task => {
			return taskService.beforeUpdate(task)
		})
		model.hexColor = model.hexColor.substring(1, 7)
		return model
	}

	beforeCreate(list) {
		list.hexColor = list.hexColor.substring(1, 7)
		return list
	}

	background(list) {
		if (list.background === null) {
			return Promise.resolve('')
		}

		return this.http({
			url: `/lists/${list.id}/background`,
			method: 'GET',
			responseType: 'blob',
		})
			.then(response => {
				return window.URL.createObjectURL(new Blob([response.data]))
			})
			.catch(e => {
				return e
			})
	}
}