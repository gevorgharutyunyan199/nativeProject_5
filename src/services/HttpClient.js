import axios from "axios";
import {defaultHeaders, defaultParams} from "../assets/constants";

class _HttpClient {

    constructor() {
        this.clientInstance = axios.create({
            timeout: 60000,
            headers: defaultHeaders,
            params: defaultParams
        });
    }


    async get(endpoint, config = this.clientInstance.defaults){
        return await this.clientInstance.get(endpoint, config);
    }

    async post(endpoint, data, config = this.clientInstance.defaults){
        return await this.clientInstance.post(endpoint, data, config);
    }

    async put(endpoint, data, config = this.clientInstance.defaults){
        return await this.clientInstance.put(endpoint, data, config);
    }

    async delete(endpoint, config = this.clientInstance.defaults){
        return await this.clientInstance.delete(endpoint, config);
    }

    addRequestInterceptor(interceptor) {
        return this.clientInstance.interceptors.request.use(interceptor);
    }

    addResponseInterceptor(interceptor,errorResponseHandler){
        return this.clientInstance.interceptors.response.use(interceptor,errorResponseHandler);
    }

}

const HttpClient = new _HttpClient();

export default HttpClient;
