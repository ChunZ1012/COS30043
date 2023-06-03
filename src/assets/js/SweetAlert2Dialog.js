import Swal from "sweetalert2";

export function useDialog(
  title,
  options = {
    description: "",
    icon: "success",
    showCancelButton: false,
    sticky: false,
    confirmButtonAction: (r) => {},
    didOpen: () => {},
    didClose: () => {}
  }
) {
  const d = Swal.fire({
    title: title,
    html: options.description,
    icon: options.icon,
    showCancelButton: options.showCancelButton,
    allowOutsideClick: !options.sticky,
    allowEscapeKey: !options.sticky,
    didOpen: options['didOpen'] !== undefined ? options.didOpen() : () => {},
    didClose: options['didClose'] !== undefined ? options.didClose() : () => {}
  }).then((r) => {
    if(options['confirmButtonAction'] !== undefined) {
      options.confirmButtonAction(r);
    }
  });

  return d;
}

export function useLoading(
  title,
  description,
  didOpenFunc = () => {},
  didCloseFunc = () => {}
) {
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
    },
  });
  return d;
}

const Toast = Swal.mixin({
  toast:true,
  position:'top-right',
  timer:1750,
  timerProgressBar: true,
  showConfirmButton:false
});

export function useToast(title, icon = 'success') {
  const d = Toast.fire({
    title: title,
    icon: icon
  });

  return d;
}

export function useCloseDialog() {
  Swal.close();
}
