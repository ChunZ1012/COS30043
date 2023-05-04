function showDialog(title, desc) { 
    if(this.isLoading) {
        this.$swal({
            title:title,
            html:desc,
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
}

function dismissDialog() {
    this.dialog = false;
    this.$swal.close();
}
