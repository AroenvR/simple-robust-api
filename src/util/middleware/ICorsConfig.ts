/**
 * Defines the configuration options for CORS middleware.
 */
export interface ICorsConfig {
    /**
     * An array of allowed origins for incoming requests.  
     * Requests from origins not included in this array will be blocked by the CORS middleware.
     */
    originAllowList: string[];
}