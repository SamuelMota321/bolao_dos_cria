import axios from "axios";

export const api = axios.create({
    baseURL: "https://api.api-futebol.com.br/v1",
    timeout: 8 * 1000
})