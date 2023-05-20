import { createStore } from "vuex";
import { useGET, usePATCH, useDELETE } from "@/assets/js/HttpManager";
import { useDialog, useToast } from "@/assets/js/SweetAlert2Dialog";

const VuexCarts = createStore({
  state() {
    return {
      carts: [],
    };
  },
  // Mutations for sync
  mutations: {
    fetchCartData(state) {
      fetchCartDataFromAPI(state);
    },
    addToCart(state, payload) {
      addProductVariantToCart(payload.variantId, payload.variantOrderedQty);
    },
    editCart(state, payload) {
      editProductVariant(
        state,
        payload
      );
    },
    removeFromCart(state, payload) {
      deleteProductFromCart(payload.cartId);
    },
  },
  // Actions for async
  actions: {
    addToCart({ commit, state }, payload) {
      commit("addToCart", payload);
      commit("fetchCartData");
    },
    removeFromCart({ commit, state }, payload) {
      commit("removeFromCart", payload);
      commit("fetchCartData");
    },
  },
  getters: {
    getCarts(state) {
      return state.carts;
    },
    getCartsCount(state) {
      return state.carts?.length ?? 0;
    },
  },
});

function fetchCartDataFromAPI(state) {
  let url = "http://localhost/COS30043/index.php/carts/list";

  const { result, error, stop } = useGET(url, {
    callback: (d) => {
      if (error.value && Object.keys(error.value).length)
        useDialog("Oops", "Error when fetching the cart data!", false, true);
      else state.carts = d;

      stop();
    },
  });

  // const d = watchEffect(() => {
  //     if(result.value && Object.keys(result.value).length) {
  //         console.log('cart response contetn valid');
  //         try{
  //             state.carts = [];
  //             state.carts.push(...result.value);
  //         } catch(e) {
  //             console.log('Cart error: ', e);
  //             useDialog("Oops", "Error when fetching the cart data!", false, true);
  //         }
  //     }
  //     if(error.value) {
  //         useDialog("Oops", "Error when fetching the cart data!", false, true);
  //         state.carts = [];
  //     }
  // });

  // d();
}

function addProductVariantToCart(variantId, variantOrderedQty) {
  let url =
    "http://localhost/COS30043/index.php/carts/add?variant_id=" +
    variantId +
    "&variant_qty=" +
    variantOrderedQty;

  const { error, stop } = useGET(url, {
    callback: (r, e) => {
      if (r) useToast("Successfully added!");
      else if (e)
        useToast("Error when adding to cart! Please try again later", "error");
      stop();
    },
  });
}

function editProductVariant(state, p) {
  let url =
    "http://localhost/COS30043/index.php/carts/edit?cart_id=" +
    p.cartId +
    "&variant_id=" +
    p.variantId +
    "&variant_qty=" +
    p.variantOrderedQty;

  const { error, stop } = usePATCH(url, {
    callback: (r, e) => {
      if (!r || e) useToast("Error when modifying the cart data!", "error");
      else 
      {
        state.carts.forEach(c => {
          if(c.cartId  == p.cardId) {
            c.variantOrderedQty = p.variantOrderedQty;
          }
        });
      }
      stop();
    },
  });
}

function deleteProductFromCart(cartId) {
  let url =
    "http://localhost/COS30043/index.php/carts/delete?cart_id=" + cartId;
  const { error, stop } = useDELETE(url, {
    callback: (r, e) => {
      if (r) useToast("Successfully removed!");
      else if (e)
        useDialog("Oops", "Error when removing from the cart!", false, true);
      else useDialog("Oops", "Error when removing from the cart!", false, true);

      stop();
    },
  });
}

export default VuexCarts;
