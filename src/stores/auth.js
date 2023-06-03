import { usePOST } from "@/assets/js/HttpManager";
import { useDialog, useToast } from "@/assets/js/SweetAlert2Dialog";
import router from "@/router/index";
import { BASEURL } from "@/inc/const";

export default {
    namespaced: true,
    state: {
        token: localStorage.getItem('token') ?? '',
        isLoggedIn: localStorage.getItem('isLoggedIn') ?? false
    },
    mutations: {
        resetLoginState(state) {
            state.token = "";
            state.isLoggedIn = false;

            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');
        }
    },
    actions: {
        login({ commit, state }, payload) {
            login(payload, state);
        },
        logout({ commit, state }) {
            logout(state);
        }
    },
    getters: {
        getToken: state => state.token,
        isLoggedIn: state => state.isLoggedIn
    }
}

function login(cred, state) {
    let url = BASEURL + "/auth/login";

    usePOST(url, {
        data: cred,
        callback: (r, e) => {
            if(e || r.error) {
                useDialog("Oops", {
                    description: e,
                    icon:'error',
                    sticky:false
                });
                console.log(`login error: ${e}`);
            }
            else {
                state.token = r.token;
                state.isLoggedIn = true;
                localStorage.setItem('token', r.token);
                localStorage.setItem('isLoggedIn', true);

                useToast('Successfully logged in');
                setTimeout(() => {
                    router.push({
                        name:"Home"
                    });
                }, 1000);
            }
        }
    });
}

function logout(state) {
    let url = BASEURL + "/auth/logout";

    usePOST(url, {
        callback: (r, e) => {
            if(e || r.error) console.log(`logout error: ${e}`);

            state.token = '';
            state.isLoggedIn = false;
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');

            useToast("Successfully logged out!");
            setTimeout(() => {
                console.log(router.currentRoute.value.name)
                if(router.currentRoute.value.name == 'Home') window.location.reload();
                else {
                    router.push({
                        name: "Home"
                    });
                }
            }, 1000);
        }
    })
}