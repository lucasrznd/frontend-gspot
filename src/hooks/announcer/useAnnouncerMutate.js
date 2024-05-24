import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL + '/announcer';

const postData = async (data) => {
    return await axios.post(API_URL, data);
}

export function useAnnouncerMutate() {
    const queryClient = useQueryClient();

    const mutate = useMutation({
        mutationFn: postData,
        onSuccess: () => {
            queryClient.invalidateQueries(['announcer']);
        }
    });

    return mutate;
}