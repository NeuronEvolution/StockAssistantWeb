export interface FetchAPI {
    (url: string, init?: any): Promise<any>;
}
export interface FetchArgs {
    url: string;
    options: any;
}
export declare class BaseAPI {
    basePath: string;
    fetch: FetchAPI;
    constructor(fetch?: FetchAPI, basePath?: string);
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
 * User stock setting
 */
export interface UserSetting {
    /**
     * Key
     */
    "key"?: string;
    /**
     * Value
     */
    "value"?: string;
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
/**
 * DefaultApi - fetch parameter creator
 */
export declare const DefaultApiFetchParamCreator: {
    stockGet(params: {
        "stockId": string;
    }, options?: any): FetchArgs;
    stockIndexAdviceList(params: {
        "userId"?: string;
        "pageToken"?: string;
        "pageSize"?: number;
    }, options?: any): FetchArgs;
    userIndexEvaluateGet(params: {
        "userId": string;
        "stockId": string;
        "indexName": string;
    }, options?: any): FetchArgs;
    userIndexEvaluateList(params: {
        "userId": string;
        "stockId": string;
    }, options?: any): FetchArgs;
    userIndexEvaluateSave(params: {
        "userId": string;
        "stockId": string;
        "indexEvaluate": UserIndexEvaluate;
    }, options?: any): FetchArgs;
    userSettingDelete(params: {
        "userId": string;
        "configKey": string;
    }, options?: any): FetchArgs;
    userSettingGet(params: {
        "userId": string;
        "configKey": string;
    }, options?: any): FetchArgs;
    userSettingList(params: {
        "userId": string;
    }, options?: any): FetchArgs;
    userSettingSave(params: {
        "userId": string;
        "setting": UserSetting;
    }, options?: any): FetchArgs;
    userStockEvaluateGet(params: {
        "userId": string;
        "stockId": string;
    }, options?: any): FetchArgs;
    userStockEvaluateList(params: {
        "userId": string;
        "pageToken"?: string;
        "pageSize"?: number;
        "sort"?: string;
        "notEvaluated"?: boolean;
    }, options?: any): FetchArgs;
    userStockIndexAdd(params: {
        "userId": string;
        "index": UserStockIndex;
    }, options?: any): FetchArgs;
    userStockIndexDelete(params: {
        "userId": string;
        "indexName": string;
    }, options?: any): FetchArgs;
    userStockIndexGet(params: {
        "userId": string;
        "indexName": string;
    }, options?: any): FetchArgs;
    userStockIndexList(params: {
        "userId": string;
    }, options?: any): FetchArgs;
    userStockIndexRename(params: {
        "userId": string;
        "nameOld": string;
        "nameNew": string;
    }, options?: any): FetchArgs;
    userStockIndexUpdate(params: {
        "userId": string;
        "indexName": string;
        "index": UserStockIndex;
    }, options?: any): FetchArgs;
};
/**
 * DefaultApi - functional programming interface
 */
export declare const DefaultApiFp: {
    stockGet(params: {
        "stockId": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<Stock>;
    stockIndexAdviceList(params: {
        "userId"?: string;
        "pageToken"?: string;
        "pageSize"?: number;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<StockIndexAdvice[]>;
    userIndexEvaluateGet(params: {
        "userId": string;
        "stockId": string;
        "indexName": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserIndexEvaluate>;
    userIndexEvaluateList(params: {
        "userId": string;
        "stockId": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserIndexEvaluate[]>;
    userIndexEvaluateSave(params: {
        "userId": string;
        "stockId": string;
        "indexEvaluate": UserIndexEvaluate;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserIndexEvaluate>;
    userSettingDelete(params: {
        "userId": string;
        "configKey": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<any>;
    userSettingGet(params: {
        "userId": string;
        "configKey": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserSetting>;
    userSettingList(params: {
        "userId": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserSetting[]>;
    userSettingSave(params: {
        "userId": string;
        "setting": UserSetting;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserSetting>;
    userStockEvaluateGet(params: {
        "userId": string;
        "stockId": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserStockEvaluate>;
    userStockEvaluateList(params: {
        "userId": string;
        "pageToken"?: string;
        "pageSize"?: number;
        "sort"?: string;
        "notEvaluated"?: boolean;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserStockEvaluateListResponse>;
    userStockIndexAdd(params: {
        "userId": string;
        "index": UserStockIndex;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserStockIndex>;
    userStockIndexDelete(params: {
        "userId": string;
        "indexName": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<any>;
    userStockIndexGet(params: {
        "userId": string;
        "indexName": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserStockIndex>;
    userStockIndexList(params: {
        "userId": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserStockIndex[]>;
    userStockIndexRename(params: {
        "userId": string;
        "nameOld": string;
        "nameNew": string;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserStockIndex>;
    userStockIndexUpdate(params: {
        "userId": string;
        "indexName": string;
        "index": UserStockIndex;
    }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<UserStockIndex>;
};
/**
 * DefaultApi - object-oriented interface
 */
export declare class DefaultApi extends BaseAPI {
    /**
     *
     * @summary get stock
     * @param stockId
     */
    stockGet(params: {
        "stockId": string;
    }, options?: any): Promise<Stock>;
    /**
     *
     * @summary list
     * @param userId
     * @param pageToken
     * @param pageSize
     */
    stockIndexAdviceList(params: {
        "userId"?: string;
        "pageToken"?: string;
        "pageSize"?: number;
    }, options?: any): Promise<StockIndexAdvice[]>;
    /**
     *
     * @summary
     * @param userId User id
     * @param stockId stock id
     * @param indexName index name
     */
    userIndexEvaluateGet(params: {
        "userId": string;
        "stockId": string;
        "indexName": string;
    }, options?: any): Promise<UserIndexEvaluate>;
    /**
     *
     * @summary
     * @param userId User id
     * @param stockId stock id
     */
    userIndexEvaluateList(params: {
        "userId": string;
        "stockId": string;
    }, options?: any): Promise<UserIndexEvaluate[]>;
    /**
     *
     * @summary
     * @param userId User id
     * @param stockId stock id
     * @param indexEvaluate
     */
    userIndexEvaluateSave(params: {
        "userId": string;
        "stockId": string;
        "indexEvaluate": UserIndexEvaluate;
    }, options?: any): Promise<UserIndexEvaluate>;
    /**
     *
     * @summary
     * @param userId User id
     * @param configKey config key
     */
    userSettingDelete(params: {
        "userId": string;
        "configKey": string;
    }, options?: any): Promise<any>;
    /**
     *
     * @summary
     * @param userId User id
     * @param configKey config key
     */
    userSettingGet(params: {
        "userId": string;
        "configKey": string;
    }, options?: any): Promise<UserSetting>;
    /**
     *
     * @summary list
     * @param userId User id
     */
    userSettingList(params: {
        "userId": string;
    }, options?: any): Promise<UserSetting[]>;
    /**
     *
     * @summary save
     * @param userId User id
     * @param setting setting
     */
    userSettingSave(params: {
        "userId": string;
        "setting": UserSetting;
    }, options?: any): Promise<UserSetting>;
    /**
     *
     * @summary
     * @param userId User id
     * @param stockId stock id
     */
    userStockEvaluateGet(params: {
        "userId": string;
        "stockId": string;
    }, options?: any): Promise<UserStockEvaluate>;
    /**
     *
     * @summary
     * @param userId User id
     * @param pageToken page token
     * @param pageSize page size
     * @param sort sort
     * @param notEvaluated not evaluated
     */
    userStockEvaluateList(params: {
        "userId": string;
        "pageToken"?: string;
        "pageSize"?: number;
        "sort"?: string;
        "notEvaluated"?: boolean;
    }, options?: any): Promise<UserStockEvaluateListResponse>;
    /**
     *
     * @summary add
     * @param userId User id
     * @param index Index
     */
    userStockIndexAdd(params: {
        "userId": string;
        "index": UserStockIndex;
    }, options?: any): Promise<UserStockIndex>;
    /**
     *
     * @summary
     * @param userId User id
     * @param indexName index id
     */
    userStockIndexDelete(params: {
        "userId": string;
        "indexName": string;
    }, options?: any): Promise<any>;
    /**
     *
     * @summary Get user index
     * @param userId User id
     * @param indexName index id
     */
    userStockIndexGet(params: {
        "userId": string;
        "indexName": string;
    }, options?: any): Promise<UserStockIndex>;
    /**
     *
     * @summary Get user indices
     * @param userId User id
     */
    userStockIndexList(params: {
        "userId": string;
    }, options?: any): Promise<UserStockIndex[]>;
    /**
     *
     * @summary
     * @param userId User id
     * @param nameOld old name
     * @param nameNew new name
     */
    userStockIndexRename(params: {
        "userId": string;
        "nameOld": string;
        "nameNew": string;
    }, options?: any): Promise<UserStockIndex>;
    /**
     *
     * @summary update
     * @param userId User id
     * @param indexName index id
     * @param index Index
     */
    userStockIndexUpdate(params: {
        "userId": string;
        "indexName": string;
        "index": UserStockIndex;
    }, options?: any): Promise<UserStockIndex>;
}
/**
 * DefaultApi - factory interface
 */
export declare const DefaultApiFactory: (fetch?: FetchAPI, basePath?: string) => {
    stockGet(params: {
        "stockId": string;
    }, options?: any): Promise<Stock>;
    stockIndexAdviceList(params: {
        "userId"?: string;
        "pageToken"?: string;
        "pageSize"?: number;
    }, options?: any): Promise<StockIndexAdvice[]>;
    userIndexEvaluateGet(params: {
        "userId": string;
        "stockId": string;
        "indexName": string;
    }, options?: any): Promise<UserIndexEvaluate>;
    userIndexEvaluateList(params: {
        "userId": string;
        "stockId": string;
    }, options?: any): Promise<UserIndexEvaluate[]>;
    userIndexEvaluateSave(params: {
        "userId": string;
        "stockId": string;
        "indexEvaluate": UserIndexEvaluate;
    }, options?: any): Promise<UserIndexEvaluate>;
    userSettingDelete(params: {
        "userId": string;
        "configKey": string;
    }, options?: any): Promise<any>;
    userSettingGet(params: {
        "userId": string;
        "configKey": string;
    }, options?: any): Promise<UserSetting>;
    userSettingList(params: {
        "userId": string;
    }, options?: any): Promise<UserSetting[]>;
    userSettingSave(params: {
        "userId": string;
        "setting": UserSetting;
    }, options?: any): Promise<UserSetting>;
    userStockEvaluateGet(params: {
        "userId": string;
        "stockId": string;
    }, options?: any): Promise<UserStockEvaluate>;
    userStockEvaluateList(params: {
        "userId": string;
        "pageToken"?: string;
        "pageSize"?: number;
        "sort"?: string;
        "notEvaluated"?: boolean;
    }, options?: any): Promise<UserStockEvaluateListResponse>;
    userStockIndexAdd(params: {
        "userId": string;
        "index": UserStockIndex;
    }, options?: any): Promise<UserStockIndex>;
    userStockIndexDelete(params: {
        "userId": string;
        "indexName": string;
    }, options?: any): Promise<any>;
    userStockIndexGet(params: {
        "userId": string;
        "indexName": string;
    }, options?: any): Promise<UserStockIndex>;
    userStockIndexList(params: {
        "userId": string;
    }, options?: any): Promise<UserStockIndex[]>;
    userStockIndexRename(params: {
        "userId": string;
        "nameOld": string;
        "nameNew": string;
    }, options?: any): Promise<UserStockIndex>;
    userStockIndexUpdate(params: {
        "userId": string;
        "indexName": string;
        "index": UserStockIndex;
    }, options?: any): Promise<UserStockIndex>;
};
