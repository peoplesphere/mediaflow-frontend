import React from 'react'
import toast from 'react-hot-toast'
import { useSingleFile } from '../../features/file/hooks/useFiles'
import { Link } from 'react-router-dom'
import fileService from '../../features/file/services/fileService'
import { useParams, useNavigate } from 'react-router-dom'

const statusConfig = {
    pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-700' },
    processing: { label: 'Processing', class: 'bg-blue-100 text-blue-700' },
    completed: { label: 'Completed', class: 'bg-green-100 text-green-700' },
    failed: { label: 'Failed', class: 'bg-red-100 text-red-700' },
}

function SingleFile() {
    const { fileId } = useParams()
    const navigate = useNavigate()
    const { file, isLoading, error } = useSingleFile({ fileId })
    console.log("file -> ", file);

    const handleDownload = async () => {
        try {
            const { downloadUrl } = await fileService.getDownloadUrl(fileId)
            window.open(downloadUrl, '_blank')
        } catch (error) {
            toast.error('Download failed')
        }
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <p className="text-red-500">Failed to load file</p>
                <button
                    onClick={() => navigate('/files/all-files')}
                    className="text-blue-600 hover:underline text-sm"
                >
                    ← Back to files
                </button>
            </div>
        )
    }

    const savedBytes = file.processedSize
        ? file.originalSize - file.processedSize
        : null

    const savedPercent = savedBytes
        ? ((savedBytes / file.originalSize) * 100).toFixed(1)
        : null

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">

                <button
                    onClick={() => navigate('/files/all-files')}
                    className="text-gray-500 hover:text-gray-700 text-sm mb-6 flex items-center gap-1"
                >
                    ← Back to files
                </button>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">

                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 break-all">
                                {file.originalName}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">{file.mimeType}</p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium flex-shrink-0 ${statusConfig[file.status]?.class}`}>
                            {statusConfig[file.status]?.label}
                        </span>
                    </div>

                    {/* Processing indicator */}
                    {(file.status === 'pending' || file.status === 'processing') && (
                        <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">
                            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full flex-shrink-0"></div>
                            <div>
                                <p className="text-sm font-medium text-blue-700">Processing in background</p>
                                <p className="text-xs text-blue-500 mt-0.5">Page automatically update hoga</p>
                            </div>
                        </div>
                    )}

                    {/* File Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-xs text-gray-500 mb-1">Original Size</p>
                            <p className="text-lg font-bold text-gray-800">
                                {(file.originalSize / 1024).toFixed(1)} KB
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-xs text-gray-500 mb-1">Processed Size</p>
                            <p className="text-lg font-bold text-gray-800">
                                {file.processedSize ? `${(file.processedSize / 1024).toFixed(1)} KB` : '—'}
                            </p>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4">
                            <p className="text-xs text-gray-500 mb-1">Space Saved</p>
                            <p className="text-lg font-bold text-green-600">
                                {savedPercent ? `${savedPercent}%` : '—'}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-xs text-gray-500 mb-1">Processing Time</p>
                            <p className="text-lg font-bold text-gray-800">
                                {file.processingTimeMS ? `${(file.processingTimeMS / 1000).toFixed(1)}s` : '—'}
                            </p>
                        </div>
                    </div>

                    {/* Upload Date */}
                    <div className="text-sm text-gray-500">
                        Uploaded: {new Date(file.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                        })}
                    </div>

                    {/* Failed */}
                    {file.status === 'failed' && file.errorLog && (
                        <div className="bg-red-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-red-700 mb-1">Processing Failed</p>
                            <p className="text-xs text-red-500">{file.errorLog}</p>
                        </div>
                    )}

                    {/* Download */}
                    {file.status === 'completed' && (
                        <button
                            onClick={handleDownload}
                            className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                        >
                            Download Processed File
                        </button>
                    )}

                </div>  {/* ← bg-white card close */}
            </div>
        </div>
    )
}

export default SingleFile