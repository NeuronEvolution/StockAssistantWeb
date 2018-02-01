import * as url from "url";

import * as isomorphicFetch from "isomorphic-fetch";
import * as assign from "core-js/library/fn/object/assign";

interface Dictionary<T> { [index: string]: T; }
export interface FetchAPI { (url: string, init?: any): Promise<any>; }

const BASE_PATH = "https://localhost/api/v1/stock-assistant-private".replace(/\/+$/, "");

export interface FetchArgs {
    url: string;
    options: any;
}

export class BaseAPI {
    basePath: string;
    fetch: FetchAPI;

    constructor(fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) {
        this.basePath = basePath;
        this.fetch = fetch;
    }
}

export interface InlineResponseDefault {
    "status"?: string;
    /**
     * Error code
     */
    "code"?: string;
    /**
     * Error message
     */
    "message"?: string;
    /**
     * Errors
     */
    "errors"?: Array<InlineResponseDefaultErrors>;
}

export interface InlineResponseDefaultErrors {
    /**
     * field name
     */
    "field"?: string;
    /**
     * error code
     */
    "code"?: string;
    /**
     * error message
     */
    "message"?: string;
}

/**
 * stock
 */
export interface Stock {
    /**
     * Stock id
     */
    "stockId"?: string;
    /**
     * Exchange id
     */
    "exchangeId"?: string;
    /**
     * Stock code
     */
    "stockCode"?: string;
    /**
     * Stock name cn
     */
    "stockNameCN"?: string;
    /**
     * Launch date
     */
    "launchDate"?: Date;
    /**
     * Website url
     */
    "websiteUrl"?: string;
    /**
     * Industry name
     */
    "industryName"?: string;
    /**
     * City name cn
     */
    "cityNameCN"?: string;
    /**
     * Province name cn
     */
    "provinceNameCN"?: string;
    /**
     * url list
     */
    "stockUrlList"?: Array<StockUrl>;
}

/**
 * stock index
 */
export interface StockIndexAdvice {
    /**
     * name
     */
    "indexName"?: string;
    /**
     * used count
     */
    "usedCount"?: number;
    /**
     * i have used
     */
    "haveUsed"?: boolean;
}

/**
 * stock url
 */
export interface StockUrl {
    /**
     * name
     */
    "name"?: string;
    /**
     * icon
     */
    "icon"?: string;
    /**
     * url
     */
    "url"?: string;
}

/**
 * index evaluate
 */
export interface UserIndexEvaluate {
    /**
     * index name
     */
    "indexName"?: string;
    /**
     * eval stars
     */
    "evalStars"?: number;
    /**
     * eval remark
     */
    "evalRemark"?: string;
    /**
     * update time
     */
    "updateTime"?: Date;
}

/**
 * stock evaluate
 */
export interface UserStockEvaluate {
    /**
     * stock id
     */
    "stockId"?: string;
    /**
     * score
     */
    "totalScore"?: number;
    /**
     * index count
     */
    "indexCount"?: number;
    /**
     * remark
     */
    "evalRemark"?: string;
    /**
     * Exchange id
     */
    "exchangeId"?: string;
    /**
     * Exchange name
     */
    "exchangeName"?: string;
    /**
     * Stock code
     */
    "stockCode"?: string;
    /**
     * Stock name cn
     */
    "stockNameCN"?: string;
    /**
     * Launch date
     */
    "launchDate"?: Date;
    /**
     * Industry name
     */
    "industryName"?: string;
}

export interface UserStockEvaluateListResponse {
    "items"?: Array<UserStockEvaluate>;
    "nextPageToken"?: string;
}

/**
 * User stock index
 */
export interface UserStockIndex {
    /**
     * name
     */
    "name"?: string;
    /**
     * desc
     */
    "desc"?: string;
    /**
     * Eval weight
     */
    "evalWeight"?: number;
    /**
     * ai weight
     */
    "aiWeight"?: number;
}



export const DefaultApiFetchParamCreator = {
    stockGet(params: {  "stockId": string; }, options?: any): FetchArgs {
        // verify required parameter "stockId" is set
        if (params["stockId"] == null) {
            throw new Error("Missing required parameter stockId when calling stockGet");
        }
        const baseUrl = `/stocks/{stockId}`
            .replace(`{${"stockId"}}`, `${ params["stockId"] }`);
        let urlObj = url.parse(baseUrl, true);
        let fetchOptions: RequestInit = assign({}, { method: "GET" }, options);

        let contentTypeHeader: Dictionary<string> = {};
        if (contentTypeHeader) {
            fetchOptions.headers = assign({}, contentTypeHeader, fetchOptions.headers);
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
        };
    },
    stockIndexAdviceList(params: {  "userId"?: string; "pageToken"?: string; "pageSize"?: number; }, options?: any): FetchArgs {
        const baseUrl = `/stockIndexAdvices`;
        let urlObj = url.parse(baseUrl, true);
        urlObj.query = assign({}, urlObj.query, {
            "userId": params["userId"],
            "pageToken": params["pageToken"],
            "pageSize": params["pageSize"],
        });
        let fetchOptions: RequestInit = assign({}, { method: "GET" }, options);

        let contentTypeHeader: Dictionary<string> = {};
        if (contentTypeHeader) {
            fetchOptions.headers = assign({}, contentTypeHeader, fetchOptions.headers);
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
        };
    },
    userIndexEvaluateGet(params: {  "userId": string; "stockId": string; "indexName": string; }, options?: any): FetchArgs {
        // verify required parameter "userId" is set
        if (params["userId"] == null) {
            throw new Error("Missing required parameter userId when calling userIndexEvaluateGet");
        }
        // verify required parameter "stockId" is set
        if (params["stockId"] == null) {
            throw new Error("Missing required parameter stockId when calling userIndexEvaluateGet");
        }
        // verify required parameter "indexName" is set
        if (params["indexName"] == null) {
            throw new Error("Missing required parameter indexName when calling userIndexEvaluateGet");
        }
        const baseUrl = `/{userId}/stockEvaluates/{stockId}/indexEvaluates/{indexName}`
            .replace(`{${"userId"}}`, `${ params["userId"] }`)
            .replace(`{${"stockId"}}`, `${ params["stockId"] }`)
            .replace(`{${"indexName"}}`, `${ params["indexName"] }`);
        let urlObj = url.parse(baseUrl, true);
        let fetchOptions: RequestInit = assign({}, { method: "GET" }, options);

        let contentTypeHeader: Dictionary<string> = {};
        if (contentTypeHeader) {
            fetchOptions.headers = assign({}, contentTypeHeader, fetchOptions.headers);
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
        };
    },
    userIndexEvaluateList(params: {  "userId": string; "stockId": string; }, options?: any): FetchArgs {
        // verify required parameter "userId" is set
        if (params["userId"] == null) {
            throw new Error("Missing required parameter userId when calling userIndexEvaluateList");
        }
        // verify required parameter "stockId" is set
        if (params["stockId"] == null) {
            throw new Error("Missing required parameter stockId when calling userIndexEvaluateList");
        }
        const baseUrl = `/{userId}/stockEvaluates/{stockId}/indexEvaluates`
            .replace(`{${"userId"}}`, `${ params["userId"] }`)
            .replace(`{${"stockId"}}`, `${ params["stockId"] }`);
        let urlObj = url.parse(baseUrl, true);
        let fetchOptions: RequestInit = assign({}, { method: "GET" }, options);

        let contentTypeHeader: Dictionary<string> = {};
        if (contentTypeHeader) {
            fetchOptions.headers = assign({}, contentTypeHeader, fetchOptions.headers);
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
        };
    },
    userIndexEvaluateSave(params: {  "userId": string; "stockId": string; "indexEvaluate": UserIndexEvaluate; }, options?: any): FetchArgs {
        // verify required parameter "userId" is set
        if (params["userId"] == null) {
            throw new Error("Missing required parameter userId when calling userIndexEvaluateSave");
        }
        // verify required parameter "stockId" is set
        if (params["stockId"] == null) {
            throw new Error("Missing required parameter stockId when calling userIndexEvaluateSave");
        }
        // verify required parameter "indexEvaluate" is set
        if (params["indexEvaluate"] == null) {
            throw new Error("Missing required parameter indexEvaluate when calling userIndexEvaluateSave");
        }
        const baseUrl = `/{userId}/stockEvaluates/{stockId}/indexEvaluates`
            .replace(`{${"userId"}}`, `${ params["userId"] }`)
            .replace(`{${"stockId"}}`, `${ params["stockId"] }`);
        let urlObj = url.parse(baseUrl, true);
        let fetchOptions: RequestInit = assign({}, { method: "POST" }, options);

        let contentTypeHeader: Dictionary<string> = {};
        contentTypeHeader = { "Content-Type": "application/json" };
        if (params["indexEvaluate"]) {
            fetchOptions.body = JSON.stringify(params["indexEvaluate"] || {});
        }
        if (contentTypeHeader) {
            fetchOptions.headers = assign({}, contentTypeHeader, fetchOptions.headers);
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
        };
    },
    userStockEvaluateGet(params: {  "userId": string; "stockId": string; }, options?: any): FetchArgs {
        // verify required parameter "userId" is set
        if (params["userId"] == null) {
            throw new Error("Missing required parameter userId when calling userStockEvaluateGet");
        }
        // verify required parameter "stockId" is set
        if (params["stockId"] == null) {
            throw new Error("Missing required parameter stockId when calling userStockEvaluateGet");
        }
        const baseUrl = `/{userId}/stockEvaluates/{stockId}`
            .replace(`{${"userId"}}`, `${ params["userId"] }`)
            .replace(`{${"stockId"}}`, `${ params["stockId"] }`);
        let urlObj = url.parse(baseUrl, true);
        let fetchOptions: RequestInit = assign({}, { method: "GET" }, options);

        let contentTypeHeader: Dictionary<string> = {};
        if (contentTypeHeader) {
            fetchOptions.headers = assign({}, contentTypeHeader, fetchOptions.headers);
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
        };
    },
    userStockEvaluateList(params: {  "userId": string; "pageToken"?: string; "pageSize"?: number; "sort"?: string; "notEvaluated"?: boolean; }, options?: any): FetchArgs {
        // verify required parameter "userId" is set
        if (params["userId"] == null) {
            throw new Error("Missing required parameter userId when calling userStockEvaluateList");
        }
        const baseUrl = `/{userId}/stockEvaluates`
            .replace(`{${"userId"}}`, `${ params["userId"] }`);
        let urlObj = url.parse(baseUrl, true);
        urlObj.query = assign({}, urlObj.query, {
            "pageToken": params["pageToken"],
            "pageSize": params["pageSize"],
            "sort": params["sort"],
            "notEvaluated": params["notEvaluated"],
        });
        let fetchOptions: RequestInit = assign({}, { method: "GET" }, options);

        let contentTypeHeader: Dictionary<string> = {};
        if (contentTypeHeader) {
            fetchOptions.headers = assign({}, contentTypeHeader, fetchOptions.headers);
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
        };
    },
    userStockIndexAdd(params: {  "userId": string; "index": UserStockIndex; }, options?: any): FetchArgs {
        // verify required parameter "userId" is set
        if (params["userId"] == null) {
            throw new Error("Missing required parameter userId when calling userStockIndexAdd");
        }
        // verify required parameter "index" is set
        if (params["index"] == null) {
            throw new Error("Missing required parameter index when calling userStockIndexAdd");
        }
        const baseUrl = `/{userId}/stockIndices`
            .replace(`{${"userId"}}`, `${ params["userId"] }`);
        let urlObj = url.parse(baseUrl, true);
        let fetchOptions: RequestInit = assign({}, { method: "POST" }, options);

        let contentTypeHeader: Dictionary<string> = {};
        contentTypeHeader = { "Content-Type": "application/json" };
        if (params["index"]) {
            fetchOptions.body = JSON.stringify(params["index"] || {});
        }
        if (contentTypeHeader) {
            fetchOptions.headers = assign({}, contentTypeHeader, fetchOptions.headers);
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
        };
    },
    userStockIndexDelete(params: {  "userId": string; "indexName": string; }, options?: any): FetchArgs {
        // verify required parameter "userId" is set
        if (params["userId"] == null) {
            throw new Error("Missing required parameter userId when calling userStockIndexDelete");
        }
        // verify required parameter "indexName" is set
        if (params["indexName"] == null) {
            throw new Error("Missing required parameter indexName when calling userStockIndexDelete");
        }
        const baseUrl = `/{userId}/stockIndices/{indexName}`
            .replace(`{${"userId"}}`, `${ params["userId"] }`)
            .replace(`{${"indexName"}}`, `${ params["indexName"] }`);
        let urlObj = url.parse(baseUrl, true);
        let fetchOptions: RequestInit = assign({}, { method: "DELETE" }, options);

        let contentTypeHeader: Dictionary<string> = {};
        if (contentTypeHeader) {
            fetchOptions.headers = assign({}, contentTypeHeader, fetchOptions.headers);
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
        };
    },
    userStockIndexGet(params: {  "userId": string; "indexName": string; }, options?: any): FetchArgs {
        // verify required parameter "userId" is set
        if (params["userId"] == null) {
            throw new Error("Missing required parameter userId when calling userStockIndexGet");
        }
        // verify required parameter "indexName" is set
        if (params["indexName"] == null) {
            throw new Error("Missing required parameter indexName when calling userStockIndexGet");
        }
        const baseUrl = `/{userId}/stockIndices/{indexName}`
            .replace(`{${"userId"}}`, `${ params["userId"] }`)
            .replace(`{${"indexName"}}`, `${ params["indexName"] }`);
        let urlObj = url.parse(baseUrl, true);
        let fetchOptions: RequestInit = assign({}, { method: "GET" }, options);

        let contentTypeHeader: Dictionary<string> = {};
        if (contentTypeHeader) {
            fetchOptions.headers = assign({}, contentTypeHeader, fetchOptions.headers);
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
        };
    },
    userStockIndexList(params: {  "userId": string; }, options?: any): FetchArgs {
        // verify required parameter "userId" is set
        if (params["userId"] == null) {
            throw new Error("Missing required parameter userId when calling userStockIndexList");
        }
        const baseUrl = `/{userId}/stockIndices`
            .replace(`{${"userId"}}`, `${ params["userId"] }`);
        let urlObj = url.parse(baseUrl, true);
        let fetchOptions: RequestInit = assign({}, { method: "GET" }, options);

        let contentTypeHeader: Dictionary<string> = {};
        if (contentTypeHeader) {
            fetchOptions.headers = assign({}, contentTypeHeader, fetchOptions.headers);
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
        };
    },
    userStockIndexRename(params: {  "userId": string; "nameOld": string; "nameNew": string; }, options?: any): FetchArgs {
        // verify required parameter "userId" is set
        if (params["userId"] == null) {
            throw new Error("Missing required parameter userId when calling userStockIndexRename");
        }
        // verify required parameter "nameOld" is set
        if (params["nameOld"] == null) {
            throw new Error("Missing required parameter nameOld when calling userStockIndexRename");
        }
        // verify required parameter "nameNew" is set
        if (params["nameNew"] == null) {
            throw new Error("Missing required parameter nameNew when calling userStockIndexRename");
        }
        const baseUrl = `/{userId}/stockIndices/rename`
            .replace(`{${"userId"}}`, `${ params["userId"] }`);
        let urlObj = url.parse(baseUrl, true);
        urlObj.query = assign({}, urlObj.query, {
            "nameOld": params["nameOld"],
            "nameNew": params["nameNew"],
        });
        let fetchOptions: RequestInit = assign({}, { method: "POST" }, options);

        let contentTypeHeader: Dictionary<string> = {};
        if (contentTypeHeader) {
            fetchOptions.headers = assign({}, contentTypeHeader, fetchOptions.headers);
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
        };
    },
    userStockIndexUpdate(params: {  "userId": string; "indexName": string; "index": UserStockIndex; }, options?: any): FetchArgs {
        // verify required parameter "userId" is set
        if (params["userId"] == null) {
            throw new Error("Missing required parameter userId when calling userStockIndexUpdate");
        }
        // verify required parameter "indexName" is set
        if (params["indexName"] == null) {
            throw new Error("Missing required parameter indexName when calling userStockIndexUpdate");
        }
        // verify required parameter "index" is set
        if (params["index"] == null) {
            throw new Error("Missing required parameter index when calling userStockIndexUpdate");
        }
        const baseUrl = `/{userId}/stockIndices/{indexName}`
            .replace(`{${"userId"}}`, `${ params["userId"] }`)
            .replace(`{${"indexName"}}`, `${ params["indexName"] }`);
        let urlObj = url.parse(baseUrl, true);
        let fetchOptions: RequestInit = assign({}, { method: "POST" }, options);

        let contentTypeHeader: Dictionary<string> = {};
        contentTypeHeader = { "Content-Type": "application/json" };
        if (params["index"]) {
            fetchOptions.body = JSON.stringify(params["index"] || {});
        }
        if (contentTypeHeader) {
            fetchOptions.headers = assign({}, contentTypeHeader, fetchOptions.headers);
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
        };
    },
};


export const DefaultApiFp = {
    stockGet(params: { "stockId": string;  }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Stock> {
        const fetchArgs = DefaultApiFetchParamCreator.stockGet(params, options);
        return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
            return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                } else {
                    return response.json().then((data: {}) => {throw data; });
                }
            });
        };
    },
    stockIndexAdviceList(params: { "userId"?: string; "pageToken"?: string; "pageSize"?: number;  }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Array<StockIndexAdvice>> {
        const fetchArgs = DefaultApiFetchParamCreator.stockIndexAdviceList(params, options);
        return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
            return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                } else {
                    return response.json().then((data: {}) => {throw data; });
                }
            });
        };
    },
    userIndexEvaluateGet(params: { "userId": string; "stockId": string; "indexName": string;  }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserIndexEvaluate> {
        const fetchArgs = DefaultApiFetchParamCreator.userIndexEvaluateGet(params, options);
        return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
            return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                } else {
                    return response.json().then((data: {}) => {throw data; });
                }
            });
        };
    },
    userIndexEvaluateList(params: { "userId": string; "stockId": string;  }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Array<UserIndexEvaluate>> {
        const fetchArgs = DefaultApiFetchParamCreator.userIndexEvaluateList(params, options);
        return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
            return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                } else {
                    return response.json().then((data: {}) => {throw data; });
                }
            });
        };
    },
    userIndexEvaluateSave(params: { "userId": string; "stockId": string; "indexEvaluate": UserIndexEvaluate;  }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserIndexEvaluate> {
        const fetchArgs = DefaultApiFetchParamCreator.userIndexEvaluateSave(params, options);
        return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
            return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                } else {
                    return response.json().then((data: {}) => {throw data; });
                }
            });
        };
    },
    userStockEvaluateGet(params: { "userId": string; "stockId": string;  }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserStockEvaluate> {
        const fetchArgs = DefaultApiFetchParamCreator.userStockEvaluateGet(params, options);
        return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
            return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                } else {
                    return response.json().then((data: {}) => {throw data; });
                }
            });
        };
    },
    userStockEvaluateList(params: { "userId": string; "pageToken"?: string; "pageSize"?: number; "sort"?: string; "notEvaluated"?: boolean;  }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserStockEvaluateListResponse> {
        const fetchArgs = DefaultApiFetchParamCreator.userStockEvaluateList(params, options);
        return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
            return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                } else {
                    return response.json().then((data: {}) => {throw data; });
                }
            });
        };
    },
    userStockIndexAdd(params: { "userId": string; "index": UserStockIndex;  }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserStockIndex> {
        const fetchArgs = DefaultApiFetchParamCreator.userStockIndexAdd(params, options);
        return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
            return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                } else {
                    return response.json().then((data: {}) => {throw data; });
                }
            });
        };
    },
    userStockIndexDelete(params: { "userId": string; "indexName": string;  }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<any> {
        const fetchArgs = DefaultApiFetchParamCreator.userStockIndexDelete(params, options);
        return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
            return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response;
                } else {
                    return response.json().then((data: {}) => {throw data; });
                }
            });
        };
    },
    userStockIndexGet(params: { "userId": string; "indexName": string;  }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserStockIndex> {
        const fetchArgs = DefaultApiFetchParamCreator.userStockIndexGet(params, options);
        return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
            return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                } else {
                    return response.json().then((data: {}) => {throw data; });
                }
            });
        };
    },
    userStockIndexList(params: { "userId": string;  }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Array<UserStockIndex>> {
        const fetchArgs = DefaultApiFetchParamCreator.userStockIndexList(params, options);
        return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
            return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                } else {
                    return response.json().then((data: {}) => {throw data; });
                }
            });
        };
    },
    userStockIndexRename(params: { "userId": string; "nameOld": string; "nameNew": string;  }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserStockIndex> {
        const fetchArgs = DefaultApiFetchParamCreator.userStockIndexRename(params, options);
        return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
            return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                } else {
                    return response.json().then((data: {}) => {throw data; });
                }
            });
        };
    },
    userStockIndexUpdate(params: { "userId": string; "indexName": string; "index": UserStockIndex;  }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserStockIndex> {
        const fetchArgs = DefaultApiFetchParamCreator.userStockIndexUpdate(params, options);
        return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
            return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                } else {
                    return response.json().then((data: {}) => {throw data; });
                }
            });
        };
    },
};

export class DefaultApi extends BaseAPI {
    stockGet(params: {  "stockId": string; }, options?: any) {
        return DefaultApiFp.stockGet(params, options)(this.fetch, this.basePath);
    }
    stockIndexAdviceList(params: {  "userId"?: string; "pageToken"?: string; "pageSize"?: number; }, options?: any) {
        return DefaultApiFp.stockIndexAdviceList(params, options)(this.fetch, this.basePath);
    }
    userIndexEvaluateGet(params: {  "userId": string; "stockId": string; "indexName": string; }, options?: any) {
        return DefaultApiFp.userIndexEvaluateGet(params, options)(this.fetch, this.basePath);
    }
    userIndexEvaluateList(params: {  "userId": string; "stockId": string; }, options?: any) {
        return DefaultApiFp.userIndexEvaluateList(params, options)(this.fetch, this.basePath);
    }
    userIndexEvaluateSave(params: {  "userId": string; "stockId": string; "indexEvaluate": UserIndexEvaluate; }, options?: any) {
        return DefaultApiFp.userIndexEvaluateSave(params, options)(this.fetch, this.basePath);
    }
    userStockEvaluateGet(params: {  "userId": string; "stockId": string; }, options?: any) {
        return DefaultApiFp.userStockEvaluateGet(params, options)(this.fetch, this.basePath);
    }
    userStockEvaluateList(params: {  "userId": string; "pageToken"?: string; "pageSize"?: number; "sort"?: string; "notEvaluated"?: boolean; }, options?: any) {
        return DefaultApiFp.userStockEvaluateList(params, options)(this.fetch, this.basePath);
    }
    userStockIndexAdd(params: {  "userId": string; "index": UserStockIndex; }, options?: any) {
        return DefaultApiFp.userStockIndexAdd(params, options)(this.fetch, this.basePath);
    }
    userStockIndexDelete(params: {  "userId": string; "indexName": string; }, options?: any) {
        return DefaultApiFp.userStockIndexDelete(params, options)(this.fetch, this.basePath);
    }
    userStockIndexGet(params: {  "userId": string; "indexName": string; }, options?: any) {
        return DefaultApiFp.userStockIndexGet(params, options)(this.fetch, this.basePath);
    }
    userStockIndexList(params: {  "userId": string; }, options?: any) {
        return DefaultApiFp.userStockIndexList(params, options)(this.fetch, this.basePath);
    }
    userStockIndexRename(params: {  "userId": string; "nameOld": string; "nameNew": string; }, options?: any) {
        return DefaultApiFp.userStockIndexRename(params, options)(this.fetch, this.basePath);
    }
    userStockIndexUpdate(params: {  "userId": string; "indexName": string; "index": UserStockIndex; }, options?: any) {
        return DefaultApiFp.userStockIndexUpdate(params, options)(this.fetch, this.basePath);
    }
}

export const DefaultApiFactory = function (fetch?: FetchAPI, basePath?: string) {
    return {
        stockGet(params: {  "stockId": string; }, options?: any) {
            return DefaultApiFp.stockGet(params, options)(fetch, basePath);
        },
        stockIndexAdviceList(params: {  "userId"?: string; "pageToken"?: string; "pageSize"?: number; }, options?: any) {
            return DefaultApiFp.stockIndexAdviceList(params, options)(fetch, basePath);
        },
        userIndexEvaluateGet(params: {  "userId": string; "stockId": string; "indexName": string; }, options?: any) {
            return DefaultApiFp.userIndexEvaluateGet(params, options)(fetch, basePath);
        },
        userIndexEvaluateList(params: {  "userId": string; "stockId": string; }, options?: any) {
            return DefaultApiFp.userIndexEvaluateList(params, options)(fetch, basePath);
        },
        userIndexEvaluateSave(params: {  "userId": string; "stockId": string; "indexEvaluate": UserIndexEvaluate; }, options?: any) {
            return DefaultApiFp.userIndexEvaluateSave(params, options)(fetch, basePath);
        },
        userStockEvaluateGet(params: {  "userId": string; "stockId": string; }, options?: any) {
            return DefaultApiFp.userStockEvaluateGet(params, options)(fetch, basePath);
        },
        userStockEvaluateList(params: {  "userId": string; "pageToken"?: string; "pageSize"?: number; "sort"?: string; "notEvaluated"?: boolean; }, options?: any) {
            return DefaultApiFp.userStockEvaluateList(params, options)(fetch, basePath);
        },
        userStockIndexAdd(params: {  "userId": string; "index": UserStockIndex; }, options?: any) {
            return DefaultApiFp.userStockIndexAdd(params, options)(fetch, basePath);
        },
        userStockIndexDelete(params: {  "userId": string; "indexName": string; }, options?: any) {
            return DefaultApiFp.userStockIndexDelete(params, options)(fetch, basePath);
        },
        userStockIndexGet(params: {  "userId": string; "indexName": string; }, options?: any) {
            return DefaultApiFp.userStockIndexGet(params, options)(fetch, basePath);
        },
        userStockIndexList(params: {  "userId": string; }, options?: any) {
            return DefaultApiFp.userStockIndexList(params, options)(fetch, basePath);
        },
        userStockIndexRename(params: {  "userId": string; "nameOld": string; "nameNew": string; }, options?: any) {
            return DefaultApiFp.userStockIndexRename(params, options)(fetch, basePath);
        },
        userStockIndexUpdate(params: {  "userId": string; "indexName": string; "index": UserStockIndex; }, options?: any) {
            return DefaultApiFp.userStockIndexUpdate(params, options)(fetch, basePath);
        },
    };
};

export interface StockGetParams {
    stockId: string;
}

export interface StockIndexAdviceListParams {
    userId?: string;
    pageToken?: string;
    pageSize?: number;
}

export interface UserIndexEvaluateGetParams {
    userId: string;
    stockId: string;
    indexName: string;
}

export interface UserIndexEvaluateListParams {
    userId: string;
    stockId: string;
}

export interface UserIndexEvaluateSaveParams {
    userId: string;
    stockId: string;
    indexEvaluate: UserIndexEvaluate;
}

export interface UserStockEvaluateGetParams {
    userId: string;
    stockId: string;
}

export interface UserStockEvaluateListParams {
    userId: string;
    pageToken?: string;
    pageSize?: number;
    sort?: string;
    notEvaluated?: boolean;
}

export interface UserStockIndexAddParams {
    userId: string;
    index: UserStockIndex;
}

export interface UserStockIndexDeleteParams {
    userId: string;
    indexName: string;
}

export interface UserStockIndexGetParams {
    userId: string;
    indexName: string;
}

export interface UserStockIndexListParams {
    userId: string;
}

export interface UserStockIndexRenameParams {
    userId: string;
    nameOld: string;
    nameNew: string;
}

export interface UserStockIndexUpdateParams {
    userId: string;
    indexName: string;
    index: UserStockIndex;
}


export const stockGet_REQUEST = "stockGet_REQUEST";
export const stockGet_FAILURE = "stockGet_FAILURE";
export const stockGet_SUCCESS = "stockGet_SUCCESS";
export const stockIndexAdviceList_REQUEST = "stockIndexAdviceList_REQUEST";
export const stockIndexAdviceList_FAILURE = "stockIndexAdviceList_FAILURE";
export const stockIndexAdviceList_SUCCESS = "stockIndexAdviceList_SUCCESS";
export const userIndexEvaluateGet_REQUEST = "userIndexEvaluateGet_REQUEST";
export const userIndexEvaluateGet_FAILURE = "userIndexEvaluateGet_FAILURE";
export const userIndexEvaluateGet_SUCCESS = "userIndexEvaluateGet_SUCCESS";
export const userIndexEvaluateList_REQUEST = "userIndexEvaluateList_REQUEST";
export const userIndexEvaluateList_FAILURE = "userIndexEvaluateList_FAILURE";
export const userIndexEvaluateList_SUCCESS = "userIndexEvaluateList_SUCCESS";
export const userIndexEvaluateSave_REQUEST = "userIndexEvaluateSave_REQUEST";
export const userIndexEvaluateSave_FAILURE = "userIndexEvaluateSave_FAILURE";
export const userIndexEvaluateSave_SUCCESS = "userIndexEvaluateSave_SUCCESS";
export const userStockEvaluateGet_REQUEST = "userStockEvaluateGet_REQUEST";
export const userStockEvaluateGet_FAILURE = "userStockEvaluateGet_FAILURE";
export const userStockEvaluateGet_SUCCESS = "userStockEvaluateGet_SUCCESS";
export const userStockEvaluateList_REQUEST = "userStockEvaluateList_REQUEST";
export const userStockEvaluateList_FAILURE = "userStockEvaluateList_FAILURE";
export const userStockEvaluateList_SUCCESS = "userStockEvaluateList_SUCCESS";
export const userStockIndexAdd_REQUEST = "userStockIndexAdd_REQUEST";
export const userStockIndexAdd_FAILURE = "userStockIndexAdd_FAILURE";
export const userStockIndexAdd_SUCCESS = "userStockIndexAdd_SUCCESS";
export const userStockIndexDelete_REQUEST = "userStockIndexDelete_REQUEST";
export const userStockIndexDelete_FAILURE = "userStockIndexDelete_FAILURE";
export const userStockIndexDelete_SUCCESS = "userStockIndexDelete_SUCCESS";
export const userStockIndexGet_REQUEST = "userStockIndexGet_REQUEST";
export const userStockIndexGet_FAILURE = "userStockIndexGet_FAILURE";
export const userStockIndexGet_SUCCESS = "userStockIndexGet_SUCCESS";
export const userStockIndexList_REQUEST = "userStockIndexList_REQUEST";
export const userStockIndexList_FAILURE = "userStockIndexList_FAILURE";
export const userStockIndexList_SUCCESS = "userStockIndexList_SUCCESS";
export const userStockIndexRename_REQUEST = "userStockIndexRename_REQUEST";
export const userStockIndexRename_FAILURE = "userStockIndexRename_FAILURE";
export const userStockIndexRename_SUCCESS = "userStockIndexRename_SUCCESS";
export const userStockIndexUpdate_REQUEST = "userStockIndexUpdate_REQUEST";
export const userStockIndexUpdate_FAILURE = "userStockIndexUpdate_FAILURE";
export const userStockIndexUpdate_SUCCESS = "userStockIndexUpdate_SUCCESS";

