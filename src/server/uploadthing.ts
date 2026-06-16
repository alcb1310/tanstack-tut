import { createUploadthing, type FileRouter } from "uploadthing/server"

const f = createUploadthing()

export const uploadRouter = {
	fileUploader: f({
		blob: {
			maxFileSize: "32MB",
			maxFileCount: 1,
		},
	}).onUploadComplete(async ({ file }) => {
		return {
			url: file.url,
			name: file.name,
		}
	}),
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter
