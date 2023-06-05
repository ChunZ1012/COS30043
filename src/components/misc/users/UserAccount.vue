<template>
    <div
        class="p-2 p-md-1"
    >
        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
        <v-spacer></v-spacer>
        <v-col cols="12" class="p-1 p-md-3">
            <h2>{{ breadcrumbTitle }}</h2>
            <v-card
                variant="plain"
            >
                <v-tabs
                    v-model="currentTab"
                >
                    <v-tab
                        v-for="(o, idx) in tabList"
                        :key="idx"
                        :value="idx"
                    >{{ o }}</v-tab>
                </v-tabs>

                <v-card-item
                    class="p-1 p-md-2"
                >
                    <v-window
                        v-model="currentTab"
                    >
                        <!-- Account Information -->
                        <v-window-item
                            :value="0"
                        >
                            <!-- Account Information Input Form -->
                            <v-form
                                ref="profileForm"
                                v-model="isProfileFormValid"
                                @submit.prevent="uploadProfileData"
                                class="row p-1"
                            > 
                                <v-card
                                    @click.prevent="$refs.profileAvatarFileInput.click()"
                                    @change="updateAvatarPreview"
                                    elevation="0"
                                    variant="flat"
                                    class="col-12 col-md-5 my-4 mb-md-0 d-flex flex-row justify-content-center align-items-center"
                                >
                                    <v-file-input
                                        ref="profileAvatarFileInput"
                                        v-model="profileAvatarFile"
                                        accept="image/*"
                                        class="d-none"
                                    ></v-file-input>
                                    <v-avatar
                                        size="300"
                                        rounded="0"
                                    >
                                        <v-img
                                            :src="profileAvatarUrl"
                                            contain
                                        ></v-img>
                                    </v-avatar>
                                </v-card>
                                <!-- Profle Input Fields -->
                                <div
                                    class="col-12 col-md-7"
                                >
                                    <v-text-field
                                        class="mb-2"
                                        v-for="f in profileInputFields"
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
                                        class="col-md-auto col-12 mb-2 mb-md-0"
                                        variant="outlined"
                                        type="submit"
                                        color="red"
                                        @click.stop.prevent
                                    >
                                        Reset Password

                                        <v-dialog
                                            v-model="showResetPasswordDialog"
                                            activator="parent"
                                            width="auto"
                                        >
                                            <v-card
                                                :elevation="8"
                                            >
                                                <v-card-title
                                                    class="fs-3 fw-bold"
                                                >Reset Your Password</v-card-title>                             <v-card-text>Here you can reset your password to a new password</v-card-text>
                                                <v-card-item
                                                >
                                                    <v-form
                                                        ref="resetPasswordForm"
                                                        v-model="isResetPasswordFormValid"
                                                        @submit.prevent="onResetPasswordFormSubmitted"
                                                    >
                                                        <v-text-field
                                                            class="mb-2"
                                                            v-for="f in resetPasswordInputFields"
                                                            :type="f.type"
                                                            :label="f.label"
                                                            :placeholder="f.placeholder"
                                                            v-model="f.value"
                                                            :required="f.required"
                                                            :disabled="!f.enabled"
                                                            :rules="f.required ? (f.rules ? f.rules.concat(commonTextRule) : commonTextRule) : []"
                                                            autocomplete="new-password"
                                                            variant="outlined"
                                                        ></v-text-field>
                                                        <v-btn
                                                            class="col-md-auto col-12 float-right mb-4"
                                                            variant="outlined"
                                                            type="submit"
                                                            :disabled="!isResetPasswordFormValid"
                                                        >Reset</v-btn>
                                                    </v-form>
                                                </v-card-item>
                                            </v-card>
                                        </v-dialog>
                                    </v-btn>
                                    <v-btn
                                        class="col-md-auto float-right col-12 me-0 me-md-2"
                                        variant="outlined"
                                        type="submit"
                                        :disabled="!isProfileFormValid"
                                    >Save</v-btn>
                                </div>
                            </v-form>
                        </v-window-item>
                        <!-- Delivery Tab -->
                        <v-window-item
                            class="p-2"
                            :value="1"
                        >
                            <!-- Available Delivery Information -->
                            <v-card
                                v-for="d in deliveryInformations"
                                :elevation="4"
                                variant="default"
                                class="mb-2"
                            >
                                <v-card-item
                                >
                                    <div 
                                        class="row align-items-center mb-2"
                                    >
                                        <h4
                                            class="col-auto mb-0"
                                        > {{ d.deliveryName }}</h4>
                                        <v-icon
                                            end
                                            size="small"
                                            icon="mdi-pencil"
                                            class="float-right"
                                            @click.stop.prevent="editDeliveryInfo(d.deliveryID)"
                                        ></v-icon>
                                    </div>
                                    <p class="mb-1">Address: {{ getCombinedDeliveryAddress(d) }} </p>
                                    <p class="mb-1">Email: {{ d.deliveryEmail }} </p>
                                    <span class="mb-1">Contact: {{ d.deliveryContact }} </span>
                                    <v-icon
                                        end
                                        icon="mdi-delete"
                                        class="float-right me-4"
                                        @click.stop.prevent="deleteDeliveryInfo(d.deliveryID)"
                                    ></v-icon>
                                </v-card-item>
                            </v-card>
                            <!-- Delivery Information Input Form -->
                            <div
                                class="mt-4"
                                v-if="showAddDeliveryForm"
                            >
                                <h4>Add New Delivery Information</h4>
                                <v-form
                                    ref="deliveryForm"
                                    class="mt-4"
                                    v-model="isDeliveryFormValid"
                                    @submit.prevent.stop
                                >
                                    <template
                                        v-for="f in deliveryInputFields"
                                    >
                                        <v-text-field
                                            class="mb-2"
                                            :type="f.type"
                                            :label="f.label"
                                            :placeholder="f.placeholder"
                                            v-model="f.value"
                                            :required="f.required"
                                            :disabled="!f.enabled"
                                            :rules="f.required ? (f.rules ? f.rules.concat(commonTextRule) : commonTextRule) : []"
                                            v-if="!f.hidden !== undefined ? !f.hidden : true"
                                            variant="outlined"
                                        ></v-text-field>    
                                    </template>
    
                                    <div 
                                        class="d-flex flex-row justify-content-end gap-3"
                                    >
                                        <v-btn
                                            class=""
                                            variant="outlined"
                                            type="submit"
                                            @click="onHideAddDeliveryFormClicked"
                                        >Close</v-btn>
                                        <v-btn
                                            class="float-right"
                                            variant="outlined"
                                            type="submit"
                                            :disabled="!isDeliveryFormValid"
                                            @click="uploadDeliveryData"
                                        >Save</v-btn>
                                    </div>
                                </v-form>
                            </div>
                            <VLayoutItem 
                                    model-value 
                                    position="bottom" 
                                    class="text-end" 
                                    size="88"
                                    @click.stop.prevent="onShowAddDeliveryFormClicked"
                                >
                                    <div class="ma-4">
                                        <VBtn icon="mdi-plus" size="large" color="secondary" elevation="8" />
                                    </div>
                                </VLayoutItem>
                        </v-window-item>
                    </v-window>
                </v-card-item>
            </v-card>
        </v-col>
    </div>
</template>

<script>
import { usePOST, useDELETE } from '@/assets/js/HttpManager';
import { useDialog, useToast } from '@/assets/js/SweetAlert2Dialog';
import { BASEURL, resetLoginAndRedirect } from '@/inc/const';

export default {
    name:"UserAccount",
    data: function() {
        const commonTextRule = [(v) => !!v || 'This field is required!'];
        return {
            breadcrumbTitle: "My Account",
            breadcrumbs: ["Home", "My Account"],
            currentTab: '0',
            tabList: [
                'Profile',
                'Delivery Information'
            ],
            // Profile
            profileInputFields: [
                {
                    type:"text",
                    label:"User ID",
                    placeholder: "Your user ID",
                    name: "accountUserID",
                    required: false,
                    enabled: false,
                    value: ""
                },
                {
                    type:"text",
                    label:"Name",
                    placeholder: "Your name",
                    name: "accountName",
                    required: true,
                    enabled: true,
                    value: ""
                },
                {
                    type:"number",
                    label:"Age",
                    placeholder: "Your age",
                    name: "accountAge",
                    required: true,
                    enabled: true,
                    value: ""
                },
                {
                    type:"tel",
                    label:"Contact",
                    placeholder: "Your contact",
                    name: "accountContact",
                    required: true,
                    enabled: true,
                    value: ""
                },
                {
                    type:"email",
                    label:"Email",
                    placeholder: "Your email",
                    name: "accountEmail",
                    required: true,
                    rules: [
                        (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Invalid email format!"
                    ],
                    enabled: true,
                    value: ""
                },
            ],
            // Profile Avatar
            profileAvatarUrl: "https://www.murrayglass.com/wp-content/uploads/2020/10/avatar-2048x2048.jpeg",
            profileAvatarFile: undefined,
            // Delivery
            deliveryInformations:[],
            deliveryInputFields: [
                {
                    type:"text",
                    label:"",
                    placeholder: "",
                    name: "deliveryID",
                    required: false,
                    enabled: false,
                    hidden:true,
                    value: ""
                },
                {
                    type:"text",
                    label:"Delivery Name",
                    placeholder: "Your name",
                    name: "deliveryName",
                    required: true,
                    enabled: true,
                    value:""
                },
                {
                    type:"text",
                    label:"Delivery Address 1",
                    placeholder: "Your delivery address 1",
                    name: "deliveryAddress1",
                    required: true,
                    enabled: true,
                    value:""
                },
                {
                    type:"text",
                    label:"Delivery Address 2",
                    placeholder: "Your delivery address 2",
                    name: "deliveryAddress2",
                    required: true,
                    enabled: true,
                    value:""
                },
                {
                    type:"text",
                    label:"Delivery Contact",
                    placeholder: "Your delivery contact",
                    name: "deliveryContact",
                    required: true,
                    enabled: true,
                    value:""
                },
                {
                    type:"text",
                    label:"Delivery Email",
                    placeholder: "Your delivery email",
                    name: "deliveryEmail",
                    required: true,
                    rules: [
                        (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Invalid email format!"
                    ],
                    enabled: true,
                    value:""
                },
            ],
            resetPasswordInputFields: [
                {
                    type:"password",
                    label:"New Password",
                    placeholder: "Your new password",
                    name: "accountNewPassword",
                    required: true,
                    rules: [
                        (v) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v) || 'Your password should at least 8 characters, contains at least one Upper case, one lower case and number!'
                    ],
                    enabled: true,
                    value:""
                },
                {
                    type:"password",
                    label:"Confirm Password",
                    placeholder: "Retype your new password",
                    name: "accountConfirmPassword",
                    required: true,
                    rules: [
                        (v) => this.resetPasswordInputFields[0].value === v || 'Password does not match!'
                    ],
                    enabled: true,
                    value:""
                }
            ],
            // Form
            isProfileFormValid: false,
            showAddDeliveryForm: false,
            isDeliveryFormValid: false,
            isResetPasswordFormValid: false,
            commonTextRule,
            // Dialog
            showResetPasswordDialog: false
        }
    },
    created() {
        // get user account info
        this.getAccountInfo();
        // get user delivery information
        this.getDeliveryInformation();
    },
    methods: {
        getAccountInfo() {
            let url = `${BASEURL}/account/get`;

            usePOST(url, {
                callback: (r, e) => {
                    if(e) resetLoginAndRedirect();
                    else {
                        this.profileInputFields.forEach(p => {
                            if(r.hasOwnProperty(p.name)) {
                                p.value = r[p.name];
                            }
                        });
                        if(r['accountProfilePicture'] != null) this.profileAvatarUrl = r['accountProfilePicture'];
                    }
                }
            });
        },
        getDeliveryInformation() {
            let url = `${BASEURL}/account/list-delivery`;

            usePOST(url, {
                callback: (r, e) => {
                    if(e) resetLoginAndRedirect();
                    else this.deliveryInformations = r;
                }
            });
        },
        updateAvatarPreview() {
            if(!this.profileAvatarFile || this.profileAvatarFile.length < 1) return;
            this.profileAvatarUrl = URL.createObjectURL(this.profileAvatarFile[0]);
        },
        uploadProfileData() {
            let valid = this.$refs.profileForm.validate();
            if(valid) {
                let fd = new FormData();
                this.profileInputFields.forEach(p => {
                    fd.append(p.name, p.value);
                });
                if(this.profileAvatarFile) fd.append('accountProfilePicture', this.profileAvatarFile[0], this.profileAvatarFile[0].name);

                let url = `${BASEURL}/account/update-profile`;
                usePOST(url, {
                    isFormData: true,
                    data: fd,
                    callback: (r, e) => {
                        if(e || !r) {
                            console.log(e);
                            useDialog("Oops", {
                                description: "Error when updating the profile data!",
                                sticky:true,
                                icon:'error'
                            });
                        }
                        else useToast("Successfully updated!");
                    }
                });
            }
        },
        onResetPasswordFormSubmitted() {
            let valid = this.$refs.resetPasswordForm.validate();
            if(valid) {
                let url = `${BASEURL}/auth/change-password`;
                let d = {
                    accountNewPassword: this.resetPasswordInputFields[0].value
                }

                usePOST(url, {
                    data: d,
                    callback: (r, e) => {
                        // close reset password dialog before toasting
                        this.showResetPasswordDialog = false;
                        if(e || !r) {
                            console.log(e);
                            useDialog("Oops", {
                                description: e,
                                sticky:true,
                                icon:'error'
                            });
                        }
                        else useToast("Successfully updated!");
                    }
                });
            }
        },
        onShowAddDeliveryFormClicked() {
            this.showAddDeliveryForm = true;
            // intialize the id to -1, meaning of add new
            this.deliveryInputFields[0].value = -1;
        },
        onHideAddDeliveryFormClicked() {
            this.showAddDeliveryForm = false;
            // Reset form data
            this.deliveryInputFields.forEach(d => d.value = "");
        },
        uploadDeliveryData() {
            let valid = this.$refs.deliveryForm.validate();
            if(valid) {
                let url = `${BASEURL}/account/upload-delivery`;

                let data = {};
                this.deliveryInputFields.forEach(d => {
                    data[d.name] = d.value;
                });

                usePOST(url, {
                    data: data,
                    callback: (r, e) => {
                        if(e || !r) {
                            console.log(e);
                            useDialog("Oops", {
                                description: e,
                                sticky: true,
                                icon:'error'
                            });
                        }
                        else {
                            useToast("Successfully added!");
                            this.getDeliveryInformation();
                        }
                    }
                })
            }
        },
        editDeliveryInfo(deliveryID) {
            let d = this.deliveryInformations.find(de => de.deliveryID == deliveryID);
            this.deliveryInputFields.forEach(p => {
                if(d.hasOwnProperty(p.name)) {
                    p.value = d[p.name];
                }
            });
            // Set form to valid status
            this.isDeliveryFormValid = true;
            this.showAddDeliveryForm = true;
        },
        deleteDeliveryInfo(deliveryID) {
            useDialog("Delete Delivery", {
                description: "Are you sure to delete this delivery information",
                showCancelButton: true,
                sticky: false,
                icon:"question",
                confirmButtonAction: (r) => {
                    if(r.isConfirmed) {
                        let url = `${BASEURL}/account/delete-delivery?delivery-id=${deliveryID}`;

                        useDELETE(url, {
                            callback: (r, e) => {
                                if(e || !r) {
                                    console.log(e);
                                    useDialog("Oops", {
                                        description: "Error when deleting the information! Please try again later",
                                        sticky: true,
                                        icon:'error'
                                    });
                                }
                                else {
                                    useToast("Successfully deleted!");
                                    this.getDeliveryInformation();
                                }
                            }
                        })
                    }
                }
            });
        },
        getCombinedDeliveryAddress(d) {
            return `${d.deliveryAddress1}, ${d.deliveryAddress2}`;
        },
    }
}
</script>