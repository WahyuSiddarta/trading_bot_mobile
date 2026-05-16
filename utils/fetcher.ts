import axios, { AxiosResponse } from "axios";
import { router } from "expo-router";

import config from "@/config";
const API_BASE_URL = config.BASE_URL.replace(/\/+$/, "");
const PRIVATE_API_PREFIX = "/v1";
const PUBLIC_API_PREFIX = "/public";

const withLeadingSlash = (url: string) =>
  url.startsWith("/") ? url : `/${url}`;

const stripPrefix = (url: string, prefix: string) => {
  const normalizedUrl = withLeadingSlash(url);

  if (normalizedUrl === prefix) {
    return "/";
  }

  return normalizedUrl.startsWith(`${prefix}/`)
    ? normalizedUrl.slice(prefix.length)
    : normalizedUrl;
};

const privatePath = (url: string) => stripPrefix(url, PRIVATE_API_PREFIX);
const publicPath = (url: string) => stripPrefix(url, PUBLIC_API_PREFIX);
const appError = (status: number | string = 500) => ({
  status,
  code: "ERROR_APPS",
});

/**
 * Private API instance (initialize the base of public API from Axios)
 */
const privateApi = axios.create({
  baseURL: `${API_BASE_URL}${PRIVATE_API_PREFIX}`,
  headers: {
    "Accept-encoding": "gzip",
  },
});

privateApi.interceptors.request.use(
  function (reqConfig) {
    if (!reqConfig.headers.Authorization) {
      return Promise.reject(appError(401));
    }

    return reqConfig;
  },
  function (error) {
    return Promise.reject(error);
  },
);

/**
 * Public API instance (initialize the base of public API from Axios)
 */
const publicApi = axios.create({
  baseURL: `${API_BASE_URL}${PUBLIC_API_PREFIX}`,
  headers: {
    "Accept-encoding": "gzip",
  },
});

/**
 * The method for setting the private API Authorization
 */
export const initPrivateAPI = (token: string) => {
  privateApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

/**
 * The method for deleting the private API Authorization
 */
export const deletePrivateAPI = () => {
  delete privateApi.defaults.headers.common["Authorization"];
};

/**
 * The method to handle POST public API
 *
 * @param {*} url
 * @param {*} param
 * @returns
 */
async function postPublic(url: string, param: Record<string, any>) {
  let data = new URLSearchParams(param);

  try {
    let response = await publicApi.post(publicPath(url), data.toString());
    return response?.data;
  } catch (errCatch: any) {
    if (errCatch?.response) {
      return handleResponse(errCatch.response, true);
    } else {
      console.log("handleResponse postPublic");
      return Promise.reject(appError());
    }
  }
}

/**
 * The method to handle POST private API
 *
 * @param {*} url
 * @param {*} param
 * @returns
 */
async function postPrivate(url: string, param: Record<string, any>) {
  let data = new URLSearchParams(param);

  try {
    let response = await privateApi.post(privatePath(url), data.toString());
    return response?.data;
  } catch (errCatch: any) {
    return errCatch.response
      ? handleResponse(errCatch.response, true)
      : Promise.reject(appError());
  }
}
async function putPrivate(
  url: string,
  param: Record<string, any>,
) {
  let data = new URLSearchParams(param);

  try {
    let response = await privateApi.put(privatePath(url), data.toString());
    return response?.data;
  } catch (errCatch: any) {
    return errCatch.response
      ? handleResponse(errCatch.response, true)
      : Promise.reject(appError());
  }
}
async function deletePrivate(
  url: string,
  param: Record<string, any>,
) {
  let data = new URLSearchParams(param);

  try {
    // axios.delete sends payload via the `data` field of config
    let response = await privateApi.delete(privatePath(url), {
      data: data?.toString(),
    });
    return response?.data;
  } catch (errCatch: any) {
    return errCatch.response
      ? handleResponse(errCatch.response, true)
      : Promise.reject(appError());
  }
}

/**
 * The method to handle the GET public API
 *
 * @param {*} url
 * @returns
 */
const getPublic = async (url: string) => {
  try {
    let response = await publicApi.get(publicPath(url));
    return response?.data;
  } catch (errCatch: any) {
    if (errCatch?.response) {
      return handleResponse(errCatch.response);
    } else {
      console.log("handleResponse getPublic ::: ", errCatch);
      return Promise.reject(appError());
    }
  }
};
const getPrivate = async (url: string) => {
  try {
    console.log("=== getPrivate ===");
    let response = await privateApi.get(privatePath(url));
    return response?.data;
  } catch (errCatch: any) {
    if (errCatch?.response) {
      return handleResponse(errCatch.response, true);
    } else {
      console.log("handleResponse getPrivate ::: ", errCatch);
      return Promise.reject(appError());
    }
  }
};

type LogoutOptions = {
  redirectTo?: string;
};

export const logoutSession = async ({
  redirectTo = "/register",
}: LogoutOptions = {}) => {
  try {
    deletePrivateAPI();
    const { useAuthStore } = await import("@/stores/auth-store");
    await useAuthStore.getState().logout();

    if (redirectTo) {
      router.replace(redirectTo as any);
    }
  } catch (errCatch: any) {
    console.log("handleResponse logoutSession ::: ", errCatch);
  }
};

let logoutInProgress = false;

const logoutExpiredSession = () => {
  if (logoutInProgress) {
    return;
  }

  logoutInProgress = true;
  logoutSession().finally(() => {
    setTimeout(() => {
      logoutInProgress = false;
    }, 1000);
  });
};

async function handleResponse(
  response: AxiosResponse | any,
  privateRoute = false,
) {
  const data = response?.data;
  try {
    const status = response?.status;
    const headers = response?.headers || {};

    if (typeof status !== "undefined" && !(status >= 200 && status < 300)) {
      if ([401, 403].includes(status) && privateRoute) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        logoutExpiredSession();
        return Promise.reject(data || appError(status));
      }

      const contentType = String(headers["content-type"] || "");
      if (!contentType.includes("application/json")) {
        console.log("handleResponse content-type");
        return Promise.reject(appError(status));
      }

      return Promise.reject(data || appError(status));
    }
  } catch (errCatch: any) {
    console.log(`handleResponse err : ${errCatch}`);
    console.error(`handleResponse err : ${errCatch}`);
    return Promise.reject(appError());
  }

  return data;
}

export const fetchWrapper = {
  getPrivate,
  getPublic,
  postPrivate,
  putPrivate,
  postPublic,
  deletePrivate,
};
