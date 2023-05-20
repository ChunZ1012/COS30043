import Swal from "sweetalert2";

export function useDialog(
  title,
  description,
  showCancelButton = true,
  sticky = false,
  confirmButtonAction = (r) => {}
) {
  const d = Swal.fire({
    title: title,
    html: description,
    showCancelButton: showCancelButton,
    allowOutsideClick: !sticky,
    allowEscapeKey: !sticky,
  }).then((r) => {
    confirmButtonAction(r);
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

export function useToast(title, icon = "success") {
  const d = Swal.fire({
    title: title,
    icon: icon,
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  return d;
}

export function useCloseDialog() {
  Swal.close();
}
