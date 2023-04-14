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
