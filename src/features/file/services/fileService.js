import api from "../../../services/api";

const fileService = {

    // get PresignedURL for to upload file in s3 
    getUploadUrl: async ({ originalName, mimeType, fileSize }) => {
        const response = await api.post('/file/upload-url', {
            originalName,
            mimeType,
            fileSize
        })
        return response.data.data
    },

    // upload direct to S3 
    uploadFileToS3: async (PresignedUrl, file) => {
        const response = await fetch(PresignedUrl, {
            method: 'PUT',
            body: file,
            headers: {
                "Content-Type": file.type
            }
        })
        if (!response.ok) {
            throw new Error("Failed to upload file in S3 Bucket!")

        }
        return response
    },

    confirmUpload: async (fileId) => {
        const response = await api.post(`/file/${fileId}/confirm`)
        return response.data.data
    },

    getAllFiles: async ({ page = 1, limit = 20, status } = {}) => {
        const params = { page, limit }
        if (status) {
            params.status = status
        }
        const response = await api.get('/file/get-all-files', { params })

        return response.data.data
    },

    getSingleFile: async (fileId) => {
        const response = await api.get(`/file/${fileId}`)
        return response.data.data
    },

    getDownloadUrl: async (fileId) => {
        const response = await api.get(`/file/${fileId}/download`)
        return response.data.data
    }

}

export default fileService;