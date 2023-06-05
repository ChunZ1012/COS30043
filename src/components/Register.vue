<template>
  <v-container fluid class="text-center">
    <h2>Register</h2>
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
              @submit.prevent="onRegisterFormSubmitted"
            >
              <v-text-field
                class="mb-2"
                v-for="f in registerInputFields"
                :type="f.type"
                :label="f.label"
                :placeholder="f.placeholder"
                v-model="f.value"
                :required="f.required"
                :disabled="!f.enabled"
                :rules="f.required ? (f.rules ? f.rules.concat(commonTextRule) : commonTextRule) : []"
                variant="outlined"
              ></v-text-field>

              <v-btn 
                color="primary" 
                class="mt-2" 
                block
                type="submit"
                :disabled="!valid"
              >
                Register
              </v-btn>
            </v-form>
            <v-sheet class="mt-4">
              <h5 class="fw-bold mt-4 mb-2">Existing User?</h5>
              <router-link class="text-decoration-none" to="/login">
                <v-btn color="yellow" class="mt-4" block> Login </v-btn>
              </router-link>
            </v-sheet>
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
import { BASEURL } from "@/inc/const";
import { useAttrs } from "vue";

export default {
  name: "Login",
  data: function() {
    const commonTextRule = [(v) => !!v || 'This field is required!'];
    return {
      valid: false,
      dialog: false,
      // Register form fields
      registerInputFields: [
        {
            type:"text",
            label:"Email Address",
            placeholder: "Your email address",
            name: "userEmail",
            required: true,
            enabled: true,
            rules: [
              (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Invalid email format!"
            ],
            value: ""
        },
        {
            type:"text",
            label:"Display Name",
            placeholder: "Your name",
            name: "userDisplayName",
            required: true,
            enabled: true,
            value: ""
        },
        {
            type:"number",
            label:"Age",
            placeholder: "Your age",
            name: "userAge",
            required: true,
            enabled: true,
            rules:[
              (v) => v > 0 || 'Invalid age value!'
            ],
            value: ""
        },
        {
            type:"text",
            label:"Contact",
            placeholder: "Your contact",
            name: "userContact",
            required: true,
            enabled: true,
            value: ""
        },
        {
            type:"password",
            label:"Password",
            placeholder: "Your password",
            name: "userPassword",
            required: true,
            enabled: true,
            value: ""
        },
        {
            type:"password",
            label:"Confirm Password",
            placeholder: "Confirm password",
            name: "userConfirmPassword",
            required: true,
            enabled: true,
            rules: [
              (v) => this.registerInputFields[4].value == v || "Password does not match!"
            ],
            value: ""
        },
      ],
      // Rule export
      commonTextRule
    }  
  },
  created() {
    this.$store.commit('loading/setLoadingStatus', false);
  },
  computed: {
    ...mapState(['auth', 'loading']),
    ...mapGetters(['auth', 'loading'])
  },
  methods: {
    onRegisterFormSubmitted() {
      this.$refs.form.validate();
      if(this.valid) {
        console.log('register form valid');

        let d = {};
        this.registerInputFields.forEach(f => {
          d[f.name] = f.value;
        });

        console.log(d);

        let url = `${BASEURL}/auth/register`;

        usePOST(url, {
          data: d,
          callback: (r, e) => {
            if(e || r.error) {
              console.log(e);
              useDialog("Oops", {
                description: e,
                sticky: true,
                icon: "error"
              });
            }
            else {
              useDialog("Hooray", {
                description: "Successfully registered! Now will redirect to the login page",
                sticky: true,
                didOpen: () => {
                  setTimeout(() => {
                    this.$router.push({
                      name: "Login"
                    });
                  }, 1000);
                }
              });
            }
          }
        });
      }
    }
  }
};
</script>
