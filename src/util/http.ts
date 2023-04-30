import axios from 'axios';

const instance = axios.create({
    timeout: 1000,
    headers: {
        'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

/**
 * Simple GET request using HTTP.
 * @param url addition to the base domain url to send the getRequest to.
 * @returns server's response object if response.ok, else returns void.
 * Response.ok: https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
 */
export const httpGet = async (url: string): Promise<void | object | any> => {
    return instance.get(`http://${url}`)
        .then((response) => {
            if (response.status === 200) {
                return response;
            }

            throw new Error(`httpGet: Response status ${response.status} not OK.`);
        })
        .catch((error) => {
            console.error("Error in httpGet: ", error);
            throw error;
        });
}

/**
 * Simple GET request using HTTPS.
 * @param url addition to the base domain url to send the getRequest to.
 * @returns server's response object if response.ok, else returns void.
 * Response.ok: https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
 */
export const httpsGet = async (url: string): Promise<void | object | any> => {
    return instance.get(`https://${url}`)
        .then((response) => {
            if (response.status === 200) {
                return response.data;
            }
        })
        .catch((error) => {
            console.error("Error in httpGet: ", error);
            throw error;
        });
}

/**
 * Simple POST Request.
 * @param url The url to send the post request to.
 * @param payload The data to send to the server.
 * @returns server's response object if response.ok, else returns void.
 */
export const httpsPost = async (url: string, payload: any, token?: string): Promise<any> => {
    if (token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return instance.post(`https://${url}`, payload)
        .then((response) => {
            if (response.status === 200) {
                return response.data;
            }

            throw Error(`Response status not OK: ${response.status}`);
        })
        .catch((error) => {
            console.error("Error in httpPost: ", error);
            throw error;
        });
}