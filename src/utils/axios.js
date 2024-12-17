import axios from 'axios';

const IP = '127.0.0.1:9090';
const SERVICE_URL = 'http://' + IP;
export {SERVICE_URL, IP};

// request 请求之前
axios.interceptors.request.use((config) => {
    config.headers['x-token'] = sessionStorage.getItem('x-token');
    return config;
});

// http response 拦截器
axios.interceptors.response.use(
    (response) => {
        return Promise.resolve(response);
    },
    (error) => {
        if (error.response && error.response.data) {
            return Promise.reject(error.response.data);
        } else {
            return Promise.reject(error.message);
        }
    }
);
export default class Http {
    static send(config, loading, isBlob) {
        const currentUrl = encodeURIComponent(window.location.href);
        const configs = Object.assign(
            {
                timeout: 30000,
            },
            config
        );
        return axios(configs)
            .then((res) => {
                if (isBlob) {
                    return res;
                }
                return res.data;
            })
            .catch((error) => {
                throw error;
            });
    }

    static post(url, params = {}, loading) {
        const config = {
            method: 'post',
            url: SERVICE_URL + url,
            data: params,
        };
        return Http.send(config, loading);
    }

    static formData(url, params = {}, loading) {
        const config = {
            method: 'post',
            url: SERVICE_URL + url,
            data: params,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        };
        return Http.send(config, loading);
    }

    static delete(url, params = {}, loading) {
        const config = {
            method: 'delete',
            url: SERVICE_URL + url,
            data: params,
        };
        return Http.send(config, loading);
    }

    static put(url, params = {}, loading) {
        const config = {
            method: 'put',
            url: SERVICE_URL + url,
            data: params,
        };
        return Http.send(config, loading);
    }

    static download(url, params = {}, loading) {
        const config = {
            responseType: 'blob',
            method: 'post',
            url: SERVICE_URL + url,
            data: params,
        };
        let isBlob = true;
        return Http.send(config, loading, isBlob);
    }

    static get(url, params = {}, loading) {
        let urlParams = [];
        Object.keys(params).forEach((key) => {
            urlParams.push(`${key}=${encodeURIComponent(params[key])}`);
        });
        if (urlParams.length) {
            urlParams = `${SERVICE_URL + url}?${urlParams.join('&')}`;
        } else {
            urlParams = SERVICE_URL + url;
        }
        const config = {
            url: urlParams,
            params: {
                randomTime: new Date().getTime(),
            },
        };
        return Http.send(config, loading);
    }

    static get2(url, params = {}, loading) {
        const config = {
            method: 'post',
            url: SERVICE_URL + url,
            data: params,
            params: {
                randomTime: new Date().getTime(),
            },
        };
        return Http.send(config, loading);
    }

    static post2(url, params = {}, loading) {
        const config = {
            method: 'post',
            url: SERVICE_URL + url,
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'},
            data: params,
        };
        return Http.send(config, loading);
    }
}
