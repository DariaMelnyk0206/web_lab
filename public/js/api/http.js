import axios from "axios";

export default class Http {
    constructor(baseURL = "") {
        this.client = axios.create({ baseURL });
    }

    async get(url) {
        const res = await this.client.get(url);
        return res.data;
    }

    async post(url, body) {
        const res = await this.client.post(url, body);
        return res.data;
    }

    async patch(url, body) {
        const res = await this.client.patch(url, body);
        return res.data;
    }
}
