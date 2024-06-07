import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL + '/spot/calculate-price';

const fetchData = async (params) => {
    const response = await axios.get(API_URL, { params });
    return response.data;
}

export function useSpotCalculatePrice(params) {
    const query = useQuery({
        queryFn: () => fetchData(params),
        queryKey: ['spotPrice', params],
    });

    return query;
}