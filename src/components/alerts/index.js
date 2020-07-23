import swal from 'sweetalert2'

export function showInformationAlert (title, text, confirmButtonText, showCancelButton, callbackFunction) {
  const cb = callbackFunction;
  swal({
    title,
    text,
    type: 'info',
    showCancelButton,
    cancelButtonText: 'Cancel',
    confirmButtonClass: 'btn-danger',
    confirmButtonColor: '#2e5965',
    confirmButtonText,
  }).then((result) => {
    cb(result.value);
  });
};

// content = {title, text, btn_no, btn_yes}
export function showActionConfirmation (content, callbackFunction) {
  const cb = callbackFunction;
  swal({
    title: content.title,
    text: content.text,
    type: 'question',
    showCancelButton: true,
    cancelButtonText: content.btn_no,
    cancelButtonColor: '#2e5965',
    confirmButtonClass: 'btn-danger',
    confirmButtonColor: '#2e5965',
    confirmButtonText: content.btn_yes,
    allowEscapeKey: false,
    allowOutsideClick: false,
  }).then((result) => {
    cb(result.value);
  });
};

export function showQuickConfirmation (content) {
  let timerInterval
  swal({
    html: `<h5>${content.title}</h5>`,
    timer: content.timer,
    showConfirmButton: false,
    onClose: () => {
      clearInterval(timerInterval)
    }
  })
}

export function showErrorAlert (title, text) {
  swal({
    type: 'error',
    title,
    text,
    confirmButtonColor: '#f27474',
  });
}
