import { API_BASE_URL } from "@/constants";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

export default function useFetch() {
  const { getToken } = useAuth();

  const axiosRequest = async () => {
    return axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getToken()}`,
      },
    });
  };

  return axiosRequest;
}
