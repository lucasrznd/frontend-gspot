import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL + '/company';

const postData = async (data) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 200 range
            throw new Error(error.response.status);
        } else if (error.request) {
            // Request was made but no response received
            throw new Error('Network error');
        } else {
            // Something else happened
            throw new Error(error.message);
        }
    }
}

export function useCompanyMutate() {
    const queryClient = useQueryClient();

    const mutate = useMutation({
        mutationFn: postData,
        onSuccess: () => {
            queryClient.invalidateQueries(['company']);
        }
    });

    return mutate;
}