<template>
  <v-container fluid class="text-center">
    <img
      :src="require('../assets/logo.svg')"
      :class="my - 3"
      contain
      :height="150"
    />
    <h2>Login</h2>

    <v-col>
      <v-card class="mx-auto">
        <v-card-item>
          <v-sheet width="350" class="mx-auto">
            <v-form>
              <v-text-field
                v-model="email"
                type="email"
                name="email"
                label="Email"
                :autofocus="true"
                :rules="emailRule"
              ></v-text-field>

              <v-text-field
                v-model="password"
                name="Password"
                label="Password"
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
                @click="promptDialog()"
              >
                Login
                <Dialog
                  ref="loginDialog"
                  :isLoading="true"
                  :persistent="true"
                  :activator="'parent'"
                  :title="'Loading'"
                  :desc="'Please wait......'"
                ></Dialog>
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
import Dialog from '@/components/misc/dialogs/Dialog.vue';

export default {
  name: "Login",
  data: () => ({
    email: "",
    password: "",
    resetEmail:"",
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
  mounted() {
    setTimeout(() => {
      this.$refs.loginDialog.dismissDialog();
      console.log("3 seconds passed");
    }, 5000);
  },
  methods: {
    forgetPassword() {
      console.log("forget password clicked");
    },
    promptDialog() {
      this.$refs.loginDialog.showDialog();
    }
  },
  components: {
    Dialog,
  },
};
</script>
