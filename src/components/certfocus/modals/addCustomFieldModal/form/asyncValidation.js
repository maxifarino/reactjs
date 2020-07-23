import Api from '../../../../../lib/api';

const asyncValidate = (values) => {
  const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
  const urlQuery = `hiringclientdetail?hiringClientName=${values.holderName}`;
  return Api.get(urlQuery, token).then(response => {
    const {success } = response.data;
    const errors = {};
    if(success) {
      errors.holderName = 'This name was already taken';
      throw errors;
    }
  });
}

export default asyncValidate;
