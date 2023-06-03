import { ref, watchEffect } from "vue";
import store from "@/stores/index";

export function useGET(url, options = {}) {
  return baseFetch(url, "GET", options);
}

export function usePOST(url, options = {}) {
  return baseFetch(url, "POST", options);
}

export function usePUT(url, options = {}) {
  return baseFetch(url, "PUT", options);
}

export function usePATCH(url, options = {}) {
  return baseFetch(url, "PATCH", options);
}

export function useDELETE(url, options = {}) {
  return baseFetch(url, "DELETE", options);
}

function baseFetch(url, type, options) {
  var headers = new Headers();
  headers.append("Accept", "application/json");
  
  var isFormData = options.hasOwnProperty('isFormData') ? (options.isFormData) : false;
  // Only include content-type header if the data is not formdata
  if(!isFormData) {
    headers.append("Content-Type", "application/json");
  }
  // Set HTTP Authorization header
  headers.append("Authorization", `Bearer ${getToken()}`);

  const dOptions = {
    data: undefined,
    callback: () => {},
    showLoading: true
  };
  // Merge incoming options with default option
  const mOptions = Object.assign(dOptions, options);
  // Display loading 
  if(mOptions.showLoading) store.commit('loading/setLoadingStatus', true);
  // Do not stringify formdata
  const body = (mOptions.data === undefined ? null : 
    (isFormData ? mOptions.data : JSON.stringify(mOptions.data)));

  const option = {
    method: type,
    headers: headers,
    body: body,
    redirect: "follow",
  };

  const result = ref(null);
  const error = ref(null);
  let status = 200;

  fetch(url, option)
    .then((r) => {
      status = r.status;
      if (!r.ok && status != 422) {
        throw new Error(`HTTP error! status: ${r.status}`);
      }
      try {
        return r.json();
      } catch(e) {
        console.log(e);
        return Promise.reject(r);
      }
    })
    .then((r) => {
      if(status != 422) result.value = r;
      else error.value = r.error;

      store.commit('loading/setLoadingStatus', false);
    })
    .catch((e) => {
      console.log(`Error: ${e}`);
      error.value = e;
      
      store.commit('loading/setLoadingStatus', false);
    });

  const stop = watchEffect(() => {
    if (
      (result.value && result.value !== null) ||
      (error.value && (error.value !== null || error.value !== undefined))
    ) {
      mOptions.callback(result.value, error.value);
    }
  });

  return { stop };
}

function getToken() {
  return store.getters['auth/getToken'];
}