import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://localhost:4000/locutor";

const fetchData = async () => {
    const response = await axios.get(API_URL);
    return response.data;
}

export function useLocutorData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['locutor'],
        refetchInterval: 60 * 5 * 1000
    });

    return query;
}