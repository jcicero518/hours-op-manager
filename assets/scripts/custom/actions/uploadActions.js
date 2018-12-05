
import {FILE_UPLOAD, FILE_UPLOAD_SUCCESS} from "./actionTypes";

export function uploadFile() {
	return {
		type: FILE_UPLOAD
	}
}

export function fileUploaded() {
	return {
		type: FILE_UPLOAD_SUCCESS
	}
}