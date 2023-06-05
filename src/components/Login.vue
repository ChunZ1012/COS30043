<template>
  <v-container fluid class="text-center">
    <h2>Login</h2>
    <v-col>
      <v-card 
        class="mx-auto"
        variant="flat"
      >
        <v-card-item>
          <v-sheet 
            class="mx-auto col-12 col-md-4"
          >
            <v-form 
              ref="form" 
              v-model="valid"
            >
              <v-text-field
                v-model="email"
                type="email"
                name="email"
                label="Email"
                autocomplete="current-email"
                :autofocus="true"
                :rules="emailRule"
              ></v-text-field>

              <v-text-field
                v-model="password"
                name="Password"
                label="Password"
                autocomplete="current-password"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passwordRule"
                @click:appendInner="
                  () => {
                    showPassword = !showPassword;
                  }
                "
              ></v-text-field>

              <a
                class="mt-4 mb-2 text-decoration-underline"
                role="button"
                style="color: #blue"
              >
                Forget Password?
                <v-dialog
                  v-model="dialog"
                  activator="parent"
                  width="auto"
                  class="p-4"
                >
                  <v-card
                    title="Reset Password"
                    text="Enter the email address and we will send you instructions on how to create a new password."
                  >
                    <v-card-item class="mb-4">
                      <v-form>
                        <v-text-field
                          v-model="resetEmail"
                          type="email"
                          name="email"
                          label="Email"
                          :autofocus="true"
                          :rules="emailRule"
                        ></v-text-field>

                        <v-btn color="primary"> Send </v-btn>
                      </v-form>
                    </v-card-item>
                  </v-card>
                </v-dialog>
              </a>
              <v-btn 
                color="primary" 
                class="mt-2" 
                block
                @click="login"
              >
                Login
              </v-btn>

              <v-spacer></v-spacer>

              <v-sheet class="mt-4">
                <h5 class="fw-bold mt-4 mb-2">New User?</h5>
                <router-link class="text-decoration-none" to="/register">
                  <v-btn color="yellow" class="mt-4" block> Register </v-btn>
                </router-link>
              </v-sheet>
            </v-form>
          </v-sheet>
        </v-card-item>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
import { useDialog } from "@/assets/js/SweetAlert2Dialog";
import { usePOST } from '@/assets/js/HttpManager';
import { useToast } from "@/assets/js/SweetAlert2Dialog";
import { mapGetters, mapState } from "vuex";

export default {
  name: "Login",
  data: () => ({
    valid: false,
    email: "",
    password: "",
    resetEmail: "",
    showPassword: false,
    dialog: false,
    // ###########
    // Rule start
    // ###########
    emailRule: [
      (v) => !!v || "Email is required!",
      (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Please enter a valid email!",
    ],
    passwordRule: [(v) => !!v || "Password is required!"],
  }),
  created() {
    this.$store.commit('loading/setLoadingStatus', false);
  },
  computed: {
    ...mapState(['auth', 'loading']),
    ...mapGetters(['auth', 'loading'])
  },
  methods: {
    forgetPassword() {
      console.log("forget password clicked");
    },
    login() {
      this.$refs.form.validate();
      if(this.valid) {
        console.log('login form valid');

        let d = {
          'email': this.email,
          'password': this.password
        };
        this.$store.dispatch('auth/login', d);
      }
    }
  }
};
</script>
