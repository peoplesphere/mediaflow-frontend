import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import fileService from '../../features/file/services/fileService'

const fileSchema = z.object({
    selectedFile: z.any()
        .refine((files) => files?.[0], 'File required hai')
        .refine((files) => files?.[0]?.size <= 100 * 1024 * 1024, 'Max 5MB allowed')
        .refine(
            (files) => ['image/jpeg', 'image/png', 'video/mp4'].includes(files?.[0]?.type),
            'Only jpg, png, mp4 allowed'
        )
})

function AddFile() {
    const navigate = useNavigate()
    const [uploading, setUploading] = useState(false)

    const {
        handleSubmit,
        register,
        // setError,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(fileSchema)
    })

    const onSubmit = async (data) => {
        console.log("formdata ->", {
            ...data, selectedFile: data.selectedFile[0]
        })
        const file = data.selectedFile[0] // actual file object
        //TODO: api call
        try {
            setUploading(true)

            // step1. get presigned URL
            toast.loading('Getting upload URL...')
            const { fileId, presignedUrl } = await fileService.getUploadUrl({
                originalName: file.name,
                mimeType: file.type,
                fileSize: file.size,
            })

            console.log('presignedUrl:', presignedUrl)
            console.log('fileId:', fileId)


            // step2. upload file to s3 
            toast.dismiss()
            toast.loading("Uploading to client....")
            await fileService.uploadFileToS3(presignedUrl, file)

            // step3. start processing 
            toast.dismiss()
            toast.loading("Starting processing...")
            await fileService.confirmUpload(fileId)

            toast.dismiss()
            toast.success("File Uploaded! Processing in background")
            navigate('/file/all-files')


        } catch (error) {
            toast.dismiss()
            toast.error(error.response?.data?.message || "File Upload Failed!")

        } finally {
            setUploading(false)
        }

    }
    return (
        <section className='dynamic-react-form-sec'>
            <div className='dynamic-form-insidebox'>
                <div className="dynamic-form-header">
                    <h2>Add File</h2>
                </div>
                <div className='main-form-sec mt-3'>
                    <form onSubmit={handleSubmit(onSubmit)} className='dynamic-react-form'>
                        <div className='form-field'>
                            <label className='form-label'>Select File</label>
                            <input
                                type="file"
                                placeholder='Enter Title'
                                {...register('selectedFile')}
                                className='form-input-field'
                            />
                            {errors.selectedFile && <p className='error-message'>{errors.selectedFile.message}</p>}
                        </div>
                        <button type='submit' className='form-submit-btn'>
                            {isSubmitting ? "Submitting" : "Submit"}
                        </button>
                        {errors.root && <p className='error-message'>{errors.root.message}</p>}
                    </form>
                </div>
            </div>
        </section>
    )
}

export default AddFile