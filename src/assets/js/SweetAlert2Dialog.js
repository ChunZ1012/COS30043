import Swal from 'sweetalert2';

export function useDialog(
    title, description, showCancelButton = true
){
    const d = Swal.fire({
        title:title,
        html:description,
        showCancelButton: showCancelButton
    });

    return d;
}

export function useLoading(
    title, description, didOpenFunc = () => {}, didCloseFunc = () => {}
){
    const d = Swal.fire({
        title: title,
        html: description,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
            didOpenFunc();
        },
        didClose: () => {
            didCloseFunc();
        }
    });
    return d;
}

export function useToast(
    title, description, icon = 'success'
) {
    const d = Swal.fire({
        title:title,
        icon:icon,
        html:description,
        toast: true,
        position:'top-right',
        showConfirmButton:false,
        timer:3000,
        timerProgressBar: true
    });

    return d;
}

export function useCloseDialog() {
    Swal.close();
}