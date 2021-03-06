import UserShareBaseModel from "./userShareBase";
import {merge} from 'lodash'

// This class extends the user share model with a 'rights' parameter which is used in sharing
export default class UserNamespaceModel extends UserShareBaseModel {
	defaults() {
		return merge(
			super.defaults(),
			{
				namespaceId: 0,
			}
		)
	}
}