import { Link } from 'react-router-dom'
import { useFiles } from '../../features/file/hooks/useFiles'
import toast from 'react-hot-toast'
import fileService from '../../features/file/services/fileService'

// Status ke hisaab se badge color
const statusConfig = {
    pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-700' },
    processing: { label: 'Processing', class: 'bg-blue-100 text-blue-700' },
    completed: { label: 'Completed', class: 'bg-green-100 text-green-700' },
    failed: { label: 'Failed', class: 'bg-red-100 text-red-700' },
}

function FileCard({ file }) {

    const handleDownload = async () => {
        try {
            const { downloadUrl } = await fileService.getDownloadUrl(file._id)
            window.open(downloadUrl, '_blank') // nayi tab mein download
        } catch (error) {
            toast.error('Download failed')
        }
    }

    const savedPercent = file.processedSize
        ? (((file.originalSize - file.processedSize) / file.originalSize) * 100).toFixed(1)
        : null

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">

            {/* File Name + Status */}
            <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-gray-800 truncate flex-1">
                    📄 {file.originalName}
                </p>
                <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${statusConfig[file.status]?.class}`}>
                    {statusConfig[file.status]?.label}
                </span>
            </div>

            {/* File Info */}
            <div className="flex flex-col gap-1 text-xs text-gray-500">
                <span>Original: {(file.originalSize / 1024).toFixed(1)} KB</span>

                {file.processedSize && (
                    <span>Processed: {(file.processedSize / 1024).toFixed(1)} KB</span>
                )}

                {savedPercent && (
                    <span className="text-green-600 font-medium">
                        ✅ Saved: {savedPercent}%
                    </span>
                )}
            </div>

            {/* Processing indicator */}
            {(file.status === 'pending' || file.status === 'processing') && (
                <div className="flex items-center gap-2 text-xs text-blue-600">
                    <div className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    Processing in background...
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-1">
                <Link
                    to={`/files/${file._id}`}
                    className="flex-1 text-center text-xs py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                    View Details
                </Link>

                {file.status === 'completed' && (
                    <button
                        onClick={handleDownload}
                        className="flex-1 text-xs py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Download
                    </button>
                )}
            </div>

        </div>
    )
}

function AllFiles() {
    const { files, isLoading, error } = useFiles()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">Failed to load files</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">My Files</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {files.length} files total
                        </p>
                    </div>
                    <Link
                        to="/files/add-file"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                        + Upload File
                    </Link>
                </div>

                {/* Files Grid */}
                {files.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-400 text-lg mb-4">No files yet</p>
                        <Link
                            to="/files/upload"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                            Upload your first file
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {files.map((file) => (
                            <FileCard key={file._id} file={file} />
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}

export default AllFiles