import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL + '/top/companies';

const fetchData = async () => {
    const response = await axios.get(API_URL);
    return response.data;
}

export function useCompanyTopMonthly() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['topMonthlyCompany'],
        refetchInterval: 60 * 5 * 1000
    });

    return query;
}