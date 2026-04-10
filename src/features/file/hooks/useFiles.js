import { useQuery } from "@tanstack/react-query";
import fileService from "../services/fileService";

export const useFiles = ({ page = 1, limit = 20, status } = {}) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['files', page, limit, status],
        queryFn: async () => {
            const result = await fileService.getAllFiles({ page, limit, status })
            console.log('getAllFiles result:', result)  // ← add karo
            return result ?? { files: [], pagination: {} }  // ← null safeguard
        },
        refetchInterval: (data) => {
            const hasProcessingCompleted = data?.files?.some(
                (file) => { file.status === 'pending' || file.status === 'processing' }
            )
            return hasProcessingCompleted ? 5000 : false
        }
    })

    return {
        //TODO: return some information
        files: data?.files || [],
        pagination: data?.pagination,
        isLoading,
        error,
        refetch
    }
}

export const useSingleFile = ({ fileId }) => {
    const { data: file, isLoading, error } = useQuery({
        queryKey: ['file', fileId],
        queryFn: async () => {
            const result = await fileService.getSingleFile(fileId)
            console.log("result ->", result);
            return result;
        },
        refetchInterval: (data) => {
            if (data?.status === "pending" || data?.status === "processing") {
                return 5000;
            }
            return false;
        }
    })
    return {
        file,
        isLoading,
        error
    }
}

