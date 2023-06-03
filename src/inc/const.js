export const BASEURL = "http://localhost/COS30043/index.php";

import { useToast } from "@/assets/js/SweetAlert2Dialog";
import store from "@/stores";
import router from "@/router";

export function resetLoginAndRedirect() {
    useToast("Please login before continue", 'error');
    // reset login status
    store.commit('auth/resetLoginState');
    // Redirect to login page
    router.push({
      name:"Login"
    });
}