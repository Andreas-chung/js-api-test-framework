import {restClient} from '../index';
import {env} from '../config';

export const login = async (email, password, expectedStatusCode = 200) => {
    return await restClient.sendRequest('post', `${env.url}/api/login`, expectedStatusCode, {email, password})
};
