import { ref, watchEffect } from "vue";

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
  headers.append("Content-Type", "application/json");

  const dOptions = {
    data: undefined,
    callback: () => {},
  };
  // Merge incoming options with default option
  const mOptions = Object.assign(dOptions, options);

  const option = {
    method: type,
    headers: headers,
    body: (mOptions.data === undefined ? null : JSON.stringify(mOptions.data)),
    redirect: "follow",
  };

  const result = ref(null);
  const error = ref(null);

  fetch(url, option)
    .then((r) => {
      if (!r.ok) {
        throw new Error(`HTTP error! status: ${r.status}`);
      }
      return r.json();
    })
    .then((r) => {
      result.value = r;
    })
    .catch((e) => {
      console.log("Error:", e);
      error.value = e;
    });

  const stop = watchEffect(() => {
    if (
      (result.value && result.value !== null) ||
      (error.value && (error.value !== null || error.value !== undefined))
    ) {
      mOptions.callback(result.value, error.value);
    }
  });

  return { error, stop };
}
