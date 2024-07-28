import { API_BASE_URL } from "@/constants";
import axios from "axios";

export const axiosRequest = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
})