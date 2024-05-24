import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL + '/company/';

const putData = async (data) => {
    return await axios.put(API_URL + data.id, data);
}

export function useCompanyPut() {
    const queryClient = useQueryClient();

    const mutate = useMutation({
        mutationFn: putData,
        onSuccess: () => {
            queryClient.invalidateQueries(['company']);
        }
    });

    return mutate;
}