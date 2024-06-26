import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL + '/spot';

const postData = async (data) => {
    return await axios.post(API_URL, data);
}

export function useSpotMutate() {
    const queryClient = useQueryClient();

    const mutate = useMutation({
        mutationFn: postData,
        onSuccess: () => {
            queryClient.invalidateQueries(['locutor']);
        }
    });

    return mutate;
}