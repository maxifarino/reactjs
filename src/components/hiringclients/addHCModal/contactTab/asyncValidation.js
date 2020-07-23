import Api from '../../../../lib/api';

const asyncValidate = (values) => {
  const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
  const urlQuery = `users/checkmail?mail=${values.email}`;
  return Api.get(urlQuery, token).then(response => {
    const { data } = response.data;
    const errors = {};
    if(data.mailExists) {
      errors.email = 'This email was already taken';
      throw errors;
    }
  });
}

export default asyncValidate;
