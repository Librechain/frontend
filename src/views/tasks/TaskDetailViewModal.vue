<template>
	<div class="modal-mask">
		<div class="modal-container" @click.self="close()">
			<div class="scrolling-content">
				<a @click="close()" class="close">
					<icon icon="times"/>
				</a>
				<task-detail-view/>
			</div>
		</div>
	</div>
</template>

<script>
	import TaskDetailView from './TaskDetailView'
	import router from '../../router'

	export default {
		name: 'TaskDetailViewModal',
		components: {
			TaskDetailView,
		},
		methods: {
			close() {
				router.back()
			},
		},
	}
</script>
