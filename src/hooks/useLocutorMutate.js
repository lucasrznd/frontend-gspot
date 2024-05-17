import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://localhost:4000/locutor";

const postData = async (data) => {
    return await axios.post(API_URL, data);
}

export function useLocutorMutate() {
    const queryClient = useQueryClient();

    const mutate = useMutation({
        mutationFn: postData,
        onSuccess: () => {
            queryClient.invalidateQueries(['locutor']);
        }
    });

    return mutate;
}