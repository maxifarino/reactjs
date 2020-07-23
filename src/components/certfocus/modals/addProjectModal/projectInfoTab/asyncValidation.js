import Api from '../../../../../lib/api';

const asyncValidate = (values, dispatch, props) => {
  console.log(props);
  const errors = {};
  const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
  const urlQuery = `hiringclientdetail?hiringClientName=${values.companyName}`;
  return Api.get(urlQuery, token).then(response => {
    const { success, data } = response.data;
    if (success && data[0].id !== props.profile.id) {
      errors.companyName = 'This name was already taken';
      throw errors;
    }
  });
}

export default asyncValidate;
