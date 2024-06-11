import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL + '/spot/latest';

const fetchData = async () => {
    const response = await axios.get(API_URL);
    return response.data;
}

export function useSpotLatest() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['latestSpots'],
        refetchInterval: 60 * 5 * 1000
    });

    return query;
}