/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** TwoFactorEnum */
export enum TwoFactorEnum {
  Email = 'email',
  Otp = 'otp',
}

/** ApiResponse[UserResponse] */
export interface ApiResponseUserResponse {
  /** Data */
  data?: UserResponse | Record<string, any>;
  /** Info */
  info?: string | null;
}

/** ConfirmPasswordResetRequest */
export interface ConfirmPasswordResetRequest {
  /** New Password */
  new_password: string;
}

export type EmptyStrToNone = string | null;

export type FormConfirmPasswordResetRequest = ConfirmPasswordResetRequest;

export type FormSignInRequest = SignInRequest;

export type FormSignUpRequest = SignUpRequest;

export type FormUpdateUserRequest = UpdateUserRequest;

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** MessageResponse */
export interface MessageResponse {
  /** Message */
  message: string;
}

/** SignInRequest */
export interface SignInRequest {
  /** Email */
  email: string;
  /** Password */
  password: string;
}

/** SignOutRequest */
export interface SignOutRequest {
  /**
   * All Sessions
   * @default false
   */
  all_sessions?: boolean;
}

/** SignUpRequest */
export interface SignUpRequest {
  /** Display Name */
  display_name?: string | null;
  /** Name */
  name: string;
  /** Email */
  email: string;
  /** Password */
  password: string;
}

/** UpdateUserRequest */
export interface UpdateUserRequest {
  display_name?: EmptyStrToNone;
  name?: EmptyStrToNone;
  email?: EmptyStrToNone;
}

/** UserResponse */
export interface UserResponse {
  /** Id */
  id: string;
  /** Name */
  name: string;
  /** Email */
  email: string;
  /** Displayname */
  displayName: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
  /** Input */
  input?: any;
  /** Context */
  ctx?: object;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  'body' | 'method' | 'query' | 'path'
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<
  D extends unknown,
  E extends unknown = unknown,
> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  JsonApi = 'application/vnd.api+json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = '';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => 'undefined' !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== 'string'
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { 'Content-Type': type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === 'undefined' || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Enso Api
 * @version 0.1.0
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags accounts
     * @name MeApiV1AccountsMeGet
     * @summary Me
     * @request GET:/api/v1/accounts/me
     */
    meApiV1AccountsMeGet: (params: RequestParams = {}) =>
      this.request<ApiResponseUserResponse, any>({
        path: `/api/v1/accounts/me`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags accounts
     * @name UpdateUserApiV1AccountsMePatch
     * @summary Update User
     * @request PATCH:/api/v1/accounts/me
     */
    updateUserApiV1AccountsMePatch: (
      query: {
        request: FormUpdateUserRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApiResponseUserResponse, HTTPValidationError>({
        path: `/api/v1/accounts/me`,
        method: 'PATCH',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description Returns message. Sends confirmational email to the user. Raises 400 if user didn't verified their email
     *
     * @tags accounts
     * @name Enable2FaApiV1Accounts2FaPut
     * @summary Enable 2Fa
     * @request PUT:/api/v1/accounts/2fa
     */
    enable2FaApiV1Accounts2FaPut: (
      query: {
        type: TwoFactorEnum;
      },
      params: RequestParams = {},
    ) =>
      this.request<MessageResponse, HTTPValidationError>({
        path: `/api/v1/accounts/2fa`,
        method: 'PUT',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description Returns a presigned url that can be used to access s3 for a user's qrcode. Qrcode can be scanned with microsoft authenticator app
     *
     * @tags accounts
     * @name GetQrCodeApiV1Accounts2FaOtpQrGet
     * @summary Get Qr Code
     * @request GET:/api/v1/accounts/2fa/otp/qr
     */
    getQrCodeApiV1Accounts2FaOtpQrGet: (params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/api/v1/accounts/2fa/otp/qr`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Returns message. Sends an email verification letter to the user
     *
     * @tags accounts
     * @name VerifyUserApiV1AccountsVerificationPost
     * @summary Verify User
     * @request POST:/api/v1/accounts/verification
     */
    verifyUserApiV1AccountsVerificationPost: (params: RequestParams = {}) =>
      this.request<MessageResponse, any>({
        path: `/api/v1/accounts/verification`,
        method: 'POST',
        format: 'json',
        ...params,
      }),

    /**
     * @description Returns message
     *
     * @tags accounts
     * @name VerifyUserConfirmApiV1AccountsVerificationCodePut
     * @summary Verify User Confirm
     * @request PUT:/api/v1/accounts/verification/{code}
     */
    verifyUserConfirmApiV1AccountsVerificationCodePut: (
      code: string,
      params: RequestParams = {},
    ) =>
      this.request<MessageResponse, HTTPValidationError>({
        path: `/api/v1/accounts/verification/${code}`,
        method: 'PUT',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags accounts
     * @name ResetPasswordApiV1AccountsPasswordResetPost
     * @summary Reset Password
     * @request POST:/api/v1/accounts/password-reset
     */
    resetPasswordApiV1AccountsPasswordResetPost: (params: RequestParams = {}) =>
      this.request<MessageResponse, any>({
        path: `/api/v1/accounts/password-reset`,
        method: 'POST',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags accounts
     * @name ResetPasswordConfirmApiV1AccountsPasswordResetTokenPut
     * @summary Reset Password Confirm
     * @request PUT:/api/v1/accounts/password-reset/{token}
     */
    resetPasswordConfirmApiV1AccountsPasswordResetTokenPut: (
      token: string,
      query: {
        request: FormConfirmPasswordResetRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<MessageResponse, HTTPValidationError>({
        path: `/api/v1/accounts/password-reset/${token}`,
        method: 'PUT',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name SignUpApiV1AuthSignUpPost
     * @summary Sign Up
     * @request POST:/api/v1/auth/sign-up
     */
    signUpApiV1AuthSignUpPost: (
      query: {
        request: FormSignUpRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApiResponseUserResponse, HTTPValidationError>({
        path: `/api/v1/auth/sign-up`,
        method: 'POST',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name SignInApiV1AuthSignInPost
     * @summary Sign In
     * @request POST:/api/v1/auth/sign-in
     */
    signInApiV1AuthSignInPost: (
      query: {
        request: FormSignInRequest;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        ApiResponseUserResponse | MessageResponse,
        HTTPValidationError
      >({
        path: `/api/v1/auth/sign-in`,
        method: 'POST',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name Verify2FaApiV1AuthSignInCodePost
     * @summary Verify 2Fa
     * @request POST:/api/v1/auth/sign-in/{code}
     */
    verify2FaApiV1AuthSignInCodePost: (
      code: string,
      params: RequestParams = {},
    ) =>
      this.request<ApiResponseUserResponse, HTTPValidationError>({
        path: `/api/v1/auth/sign-in/${code}`,
        method: 'POST',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name SignOutApiV1AuthSignOutDelete
     * @summary Sign Out
     * @request DELETE:/api/v1/auth/sign-out
     */
    signOutApiV1AuthSignOutDelete: (
      data: SignOutRequest,
      params: RequestParams = {},
    ) =>
      this.request<MessageResponse, HTTPValidationError>({
        path: `/api/v1/auth/sign-out`,
        method: 'DELETE',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name RefreshApiV1AuthRefreshGet
     * @summary Refresh
     * @request GET:/api/v1/auth/refresh
     */
    refreshApiV1AuthRefreshGet: (params: RequestParams = {}) =>
      this.request<MessageResponse, any>({
        path: `/api/v1/auth/refresh`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
}
