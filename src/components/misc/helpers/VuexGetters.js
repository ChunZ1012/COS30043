import store from "@/stores";

function isLoggedIn() {
    return store.getters['auth/isLoggedIn'];
}

function getToken() {
    return store.getters['auth/getToken'];
}