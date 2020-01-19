import debug from 'debug';
export const env = {
    url: 'https://reqres.in/'
};
export const debugLog = (namespace) => {
    debug(`api-tests:${namespace}`)
};