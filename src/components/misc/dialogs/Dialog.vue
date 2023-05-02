<!--
<template>
    <v-dialog
      v-if="false"
      v-model="dialog"
      :scrim="true"
      :persistent="isPersistent"
      :activator="activator"
      width="auto"
      height="auto"
      class="p-4"
    >
      <v-card class="p-2" color="white">
        <v-card-title class="text-center fw-bold fs-1">
          {{ title }}
        </v-card-title>
        <p
            class="text-center mt-3 fs-5 fw-normal"
        >
            {{ desc }}
        </p>
        <v-card-actions
            v-if="!isLoading"
            class="d-flex flex-row justify-content-center"
        >
            <router-link
                class="router-link-btn"
                :to="{
                    name:'Home'
                }"
            >
                <v-btn
                    variant="outlined"
                    color="dark"
                    density="default"
                    class="fs-6"
                    @click="dialog = false"
                >
                    Back to Homepage
                </v-btn>
            </router-link>
        </v-card-actions>

        <v-progress-linear
            v-else
          indeterminate
          color="dark"
          class="mb-0 mt-2"
        ></v-progress-linear>

      </v-card>
    </v-dialog>
</template>
-->
<script>
export default {
    name: "Dialog",
    props: {
        isPersistent: {
            type:Boolean,
            default:false
        },
        isLoading: {
            type:Boolean,
            default:false
        },
        activator: {
            type:String||undefined,
            default:undefined
        },
        confirmButtonText: {
            type:String,
            default:'OK'
        },
        confirmButtonAction: {
            type:Object,
            default:{}
        },
        cancelButtonText: {
            type:String,
            default:'Cancel'
        },
        singleButtonOnly: {
            type:Boolean,
            default:true
        },
        title: {
            type:String,
            default:"Oops!"
        },
        desc:{
            type:String,
            default:"Please wait"
        }
    },
    methods: {
        showDialog(title, desc) {
            let dTitle = (title !== undefined && title.length > 0) ? title : this.title;
            let dDesc = (desc !== undefined && desc.length > 0) ? desc : this.desc;

            if(this.isLoading) {
                this.$swal({
                    title:dTitle,
                    html:dDesc,
                    allowOutsideClick: !this.isLoading,
                    showCancelButton:false,
                    showConfirmButton:false,
                    didOpen:() => {
                        this.$swal.showLoading();
                    }
                });
            }
            else {
                this.$swal({
                    title:title,
                    html:desc,
                    allowOutsideClick: !this.isPersistent,
                    showCancelButton:!this.singleButtonOnly,
                    showConfirmButton:true,
                    confirmButtonText: this.confirmButtonText,
                    didClose:() => {
                        let type = this.confirmButtonAction.type;
                        if(type == 'route') {
                            this.$router.push({
                                name: this.confirmButtonAction.name
                            })
                        }
                        else if(type == 'dialog') {
                            this.$swal.close();
                        }
                    }
                })
            }
        },
        dismissDialog() {
            this.dialog = false;
            this.$swal.close();
        }
    },
    expose:['showDialog', 'dismissDialog', 'title', 'desc', 'dialog']
};
</script>
  