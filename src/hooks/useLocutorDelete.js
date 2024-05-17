import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://localhost:4000/locutor/";

const deleteData = async (id) => {
    return await axios.delete(API_URL + id, id);
}

export function useLocutorDelete() {
    const queryClient = useQueryClient();

    const mutatePut = useMutation({
        mutationFn: deleteData, onSuccess: () => {
            queryClient.invalidateQueries(['locutor']);
        },
    },
    );

    return mutatePut;
}