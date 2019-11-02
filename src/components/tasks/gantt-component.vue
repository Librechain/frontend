<template>
	<div class="gantt-chart box">
		<div class="dates">
			<template v-for="(y, yk) in days">
				<div class="months" :key="yk + 'year'">
					<div class="month" v-for="(m, mk) in days[yk]" :key="mk + 'month'">
						{{new Date((new Date(yk)).setMonth(mk)).toLocaleString('en-us', { month: 'long' })}}, {{(new Date(yk)).getFullYear()}}
						<div class="days">
							<div
									class="day"
									v-for="(d, dk) in days[yk][mk]"
									:key="dk + 'day'"
									:style="{'width': dayWidth + 'px'}"
									:class="{'today': d.toDateString() === now.toDateString()}">
								<span class="theday" v-if="dayWidth > 25">
									{{d.getDate()}}
								</span>
								<span class="weekday" v-if="dayWidth > 25">
									{{d.toLocaleString('en-us', { weekday: 'short' })}}
								</span>
							</div>
						</div>
					</div>
				</div>
			</template>
		</div>
		<div class="tasks" :style="{'width': fullWidth + 'px'}">
			<div class="row" v-for="(t, k) in theTasks" :key="t.id" :style="{background: 'repeating-linear-gradient(90deg, #ededed, #ededed 1px, ' + (k % 2 === 0 ? '#fafafa 1px, #fafafa ' : '#fff 1px, #fff ') + dayWidth + 'px)'}">
				<VueDragResize
						class="task"
						:class="{'done': t.done, 'is-current-edit': taskToEdit !== null && taskToEdit.id === t.id, 'has-light-text': !t.hasDarkColor(), 'has-dark-text': t.hasDarkColor()}"
                        :style="{'border-color': t.hexColor, 'background-color': t.hexColor}"
                        :isActive="true"
						:x="t.offsetDays * dayWidth - 6"
						:y="0"
						:w="t.durationDays * dayWidth"
						:h="31"
						:minw="dayWidth"
						:snapToGrid="true"
						:gridX="dayWidth"
						:sticks="['mr', 'ml']"
						axis="x"
						:parentLimitation="true"
						:parentW="fullWidth"
						@resizestop="resizeTask"
						@dragstop="resizeTask"
						@clicked="taskDragged = t"
				>
                    <span :class="{
                    'has-high-priority': t.priority >= priorities.HIGH,
                    'has-not-so-high-priority': t.priority === priorities.HIGH,
                    'has-super-high-priority': t.priority === priorities.DO_NOW
                    }">{{t.text}}</span>
					<span v-if="t.priority >= priorities.HIGH" class="high-priority" :class="{'not-so-high': t.priority === priorities.HIGH}">
						<span class="icon">
							<icon icon="exclamation"/>
						</span>
						<template v-if="t.priority === priorities.HIGH">High</template>
						<template v-if="t.priority === priorities.URGENT">Urgent</template>
						<template v-if="t.priority === priorities.DO_NOW">DO NOW</template>
						<span class="icon" v-if="t.priority === priorities.DO_NOW">
							<icon icon="exclamation"/>
						</span>
					</span>
					<!-- using the key here forces vue to use the updated version model and not the response returned by the api -->
                    <a @click="editTask(theTasks[k])" class="edit-toggle">
                        <icon icon="pen"/>
                    </a>
                 </VueDragResize>
			</div>
			<template v-if="showTaskswithoutDates">
				<div class="row" v-for="(t, k) in tasksWithoutDates" :key="t.id" :style="{background: 'repeating-linear-gradient(90deg, #ededed, #ededed 1px, ' + (k % 2 === 0 ? '#fafafa 1px, #fafafa ' : '#fff 1px, #fff ') + dayWidth + 'px)'}">
					<VueDragResize
							class="task nodate"
							:isActive="true"
							:x="dayOffsetUntilToday * dayWidth - 6"
							:y="0"
							:h="31"
							:minw="dayWidth"
							:snapToGrid="true"
							:gridX="dayWidth"
							:sticks="['mr', 'ml']"
							axis="x"
							:parentLimitation="true"
							:parentW="fullWidth"
							@resizestop="resizeTask"
							@dragstop="resizeTask"
							@clicked="taskDragged = t"
							v-tooltip="'This task has no dates set.'"
					>
						<span>{{t.text}}</span>
					</VueDragResize>
				</div>
			</template>
		</div>
		<form @submit.prevent="addNewTask()" class="add-new-task">
			<transition name="width">
				<input
					type="text"
					v-model="newTaskTitle"
					class="input"
					v-if="newTaskFieldActive"
					ref="newTaskTitleField"
					@keyup.esc="newTaskFieldActive = false"
					@blur="hideCrateNewTask"
				/>
			</transition>
			<button class="button is-primary noshadow" @click="showCreateNewTask">
				<span class="icon is-small">
					<icon icon="plus"/>
				</span>
				Add a new task
			</button>
		</form>
		<transition name="fade">
			<div class="card taskedit" v-if="isTaskEdit">
				<header class="card-header">
					<p class="card-header-title">
						Edit Task
					</p>
					<a class="card-header-icon" @click="isTaskEdit = false;taskToEdit = null">
						<span class="icon">
							<icon icon="times"/>
						</span>
					</a>
				</header>
				<div class="card-content">
					<div class="content">
						<edit-task :task="taskToEdit"/>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import VueDragResize from 'vue-drag-resize'
	import message from '../../message'
	import EditTask from './edit-task'

	import TaskService from '../../services/task'
	import TaskModel from '../../models/task'
	import ListModel from '../../models/list'
	import priorities from '../../models/priorities'

	export default {
		name: 'GanttChart',
		components: {
			EditTask,
			VueDragResize,
		},
		props: {
			list: {
				type: ListModel,
				required: true,
			},
			showTaskswithoutDates: {
				type: Boolean,
				default: false,
			},
			dateFrom: {
				default: new Date((new Date()).setDate((new Date()).getDate() - 15))
			},
			dateTo: {
				default: new Date((new Date()).setDate((new Date()).getDate() + 30))
			},
			// The width of a day in pixels, used to calculate all sorts of things.
			dayWidth: {
				type: Number,
				default: 35,
			}
		},
		data() {
			return {
				days: [],
				startDate: null,
				endDate: null,
				theTasks: [], // Pretty much a copy of the prop, since we cant mutate the prop directly
				tasksWithoutDates: [],
				taskService: TaskService,
				taskDragged: null, // Saves to currently dragged task to be able to update it
				fullWidth: 0,
				now: null,
				dayOffsetUntilToday: 0,
                isTaskEdit: false,
				taskToEdit: null,
				newTaskTitle: '',
				newTaskFieldActive: false,
				priorities: {},
			}
		},
		watch: {
			list() {
				this.parseTasks()
			},
			dateFrom() {
				this.buildTheGanttChart()
			},
			dateTo() {
				this.buildTheGanttChart()
			},
		},
		beforeMount() {
			this.now = new Date()
			this.taskService = new TaskService()
			this.priorities = priorities
			this.buildTheGanttChart()
		},
		methods: {
			buildTheGanttChart() {
				this.setDates()
				this.prepareGanttDays()
				this.parseTasks()
			},
			setDates() {
				this.startDate = new Date(this.dateFrom)
				this.endDate = new Date(this.dateTo)

				this.dayOffsetUntilToday = Math.floor((this.now - this.startDate) / 1000 / 60 / 60 / 24) +1
			},
			prepareGanttDays() {
				// Layout: years => [months => [days]]
				let years = {};
				for (let d = this.startDate; d <= this.endDate; d.setDate(d.getDate() + 1)) {
					let date = new Date(d)
					if (years[date.getFullYear() + ''] === undefined) {
						years[date.getFullYear() + ''] = {}
					}
					if (years[date.getFullYear() + ''][date.getMonth()  + ''] === undefined) {
						years[date.getFullYear() + ''][date.getMonth()  + ''] = []
					}
					years[date.getFullYear() + ''][date.getMonth()  + ''].push(date)
					this.fullWidth += this.dayWidth
				}
				this.$set(this, 'days', years)
			},
			parseTasks() {
				this.setDates()
				this.prepareTasks()
			},
			prepareTasks() {
				this.theTasks = this.list.tasks
					.filter(t => {
						if(t.startDate === null && !t.done) {
							this.tasksWithoutDates.push(t)
						}
						return t.startDate >= this.startDate && t.endDate <= this.endDate
					})
					.map(t => {
						return this.addGantAttributes(t)
					})
					.sort(function(a,b) {
						if (a.startDate < b.startDate)
							return -1
						if (a.startDate > b.startDate)
							return 1
						return 0
					})
			},
			addGantAttributes(t) {
				t.endDate === null ? this.endDate : t.endDate
				t.durationDays = Math.floor((t.endDate - t.startDate) / 1000 / 60 / 60 / 24) + 1
				t.offsetDays = Math.floor((t.startDate - this.startDate) / 1000 / 60 / 60 / 24) + 1
				return t
			},
			resizeTask(newRect) {

				// Timeout to definitly catch if the user clicked on taskedit
				setTimeout(() => {

					if(this.isTaskEdit) {
						return
					}

					let didntHaveDates = this.taskDragged.startDate === null ? true : false

					let startDate = new Date(this.startDate)
					startDate.setDate(startDate.getDate() + newRect.left / this.dayWidth)
					startDate.setUTCHours(0)
					startDate.setUTCMinutes(0)
					startDate.setUTCSeconds(0)
					startDate.setUTCMilliseconds(0)
					this.taskDragged.startDate = startDate
					let endDate = new Date(startDate)
					endDate.setDate(startDate.getDate() + newRect.width / this.dayWidth)
					this.taskDragged.startDate = startDate
					this.taskDragged.endDate = endDate

					this.taskService.update(this.taskDragged)
						.then(r => {
							// If the task didn't have dates before, we'll update the list
							if(didntHaveDates) {
								for (const t in this.tasksWithoutDates) {
									if (this.tasksWithoutDates[t].id === r.id) {
										this.tasksWithoutDates.splice(t, 1)
									}
								}
								this.theTasks.push(this.addGantAttributes(r))
							} else {
								for (const tt in this.theTasks) {
									if (this.theTasks[tt].id === r.id) {
										this.theTasks[tt] = this.addGantAttributes(r)
									}
								}
							}

							message.success({message: 'The task was successfully updated.'}, this)
						})
						.catch(e => {
							message.error(e, this)
						})
				}, 100)
			},
            editTask(task) {
				this.taskToEdit = task
				this.isTaskEdit = true
            },
			showCreateNewTask() {
				if(!this.newTaskFieldActive) {
					// Timeout to not send the form if the field isn't even shown
					setTimeout(() => {
						this.newTaskFieldActive = true
						this.$nextTick(() => this.$refs.newTaskTitleField.focus())
					}, 100)
				}
			},
			hideCrateNewTask() {
				if(this.newTaskTitle === '') {
					this.$nextTick(() => this.newTaskFieldActive = false)
				}
			},
			addNewTask() {
				if (!this.newTaskFieldActive) {
					return
				}
				let task = new TaskModel({text: this.newTaskTitle, listID: this.list.id})
				this.taskService.create(task)
					.then(r => {
						this.tasksWithoutDates.push(this.addGantAttributes(r))
						this.newTaskTitle = ''
						this.hideCrateNewTask()
						message.success({message: 'The task was successfully created.'}, this)
					})
					.catch(e => {
						message.error(e, this)
					})
			},
		},
	}
</script>