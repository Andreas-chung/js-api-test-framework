import axios from 'axios';
import {expect} from '../index';
import {debugLog} from "../config";
const log = debugLog('restClient');


const isRequestLoggingEnabled = () => {
    return true;
};

export class RestClient {
    instance = axios.create({timeout: 60000});
    constructor(isInterceptorsEnabled = true) {
        if (isInterceptorsEnabled) {
            this.instance.interceptors.request.use(request =>
                this.handleRequest(request)
            );
            this.instance.interceptors.response.use(
                response => this.handleResponse(response),
                error => this.handleError(error)
            );
        }
        this.instance.defaults.headers['Content-Type'] = 'application/json';
    }

    setAuth(jwt) {
        this.instance.defaults.headers['Authorization'] = `Bearer ${jwt}`;
    }

    resetAuth() {
        this.instance.defaults.headers['Authorization'] = null;
    }

    async sendRequest(
        method,
        url,
        expectedStatusCode,
        body = null,
        headers = null
    ) {
        const config = {
            headers: headers !== null ? headers : this.instance.defaults.headers,
            method: method,
            url: url,
            data: body
        };
        return await this.sendRequestWithConfig(config, expectedStatusCode);
    }

    async sendRequestWithConfig(config, expectedStatusCode) {
        let response;
        try {
            response = await this.instance.request(config);
            expect(response.status).to.equal(expectedStatusCode);
            return response;
        } catch (err) {
            if (err.response) {
                try {
                    expect(err.response.status).to.equal(expectedStatusCode);
                } catch (chaiError) {
                    log(err);
                    throw chaiError;
                }
            } else {
                throw err;
            }
        }
    }

    handleRequest = (request) => {
        if (isRequestLoggingEnabled()) {
            log(`Sending ${request.method.toUpperCase()} request to: ${request.url}`);
            if (request.data !== null && request.data !== undefined) {
                log('Sending with Body: ', request.data);
            }
        }
        return request;
    };

    handleResponse = (response) => {
        if (isRequestLoggingEnabled()) {
            log(`Response from: ${response.config.url} - status: ${response.status}`);
            response.data && log('Response with Body: ', response.data);
        }
        return response;
    };

    handleError = (error) => {
        if (isRequestLoggingEnabled()) {
            log('----------- ERROR -----------');
            if (error.response) {
                log(`${error.response.config.url}`);
            }
            log(error);
        }
        return error;
    };
}

export default new RestClient();