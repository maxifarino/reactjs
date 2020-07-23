import Utils from '../../../lib/utils';

export const determineStatus = (user, action) => {
  let status = action.usersData.statusInactive;

  if (user.isEnabled) {
    status = action.usersData.statusActive;
    if(user.mustRenewPass) {
      status = action.usersData.statusChangePassword;
    }
  }

  return status

}

export const MapUserPropsToState = (user, status) => {
  return {
    id: user.id,
    isAssociated: user.isAssociated,
    name: `${user.firstName} ${user.lastName}`,
    email: user.mail,
    userType: user.role,
    CFUserType: user.CFRole,
    company: user.company,
    AssociatedHCsOfSC: user.AssociatedHCsOfSC,
    // latestEvent value is hardcoded because we are not receiving this value from endpoint
    // TO DO: Add latestEvent from response JSON
    // latestEvent: '5 hours ago',
    status,
    quickViewLink: '/',
    editUserLink: '/',
    extraUserInfo: {
      firstName: user.firstName,
      lastName: user.lastName,
      cellphone: user.cellPhone,
      phone: Utils.normalizePhoneNumber(user.phone),
      role: user.role,
      roleId: user.roleID,
      cfRole: user.CFRole,
      cfRoleId: user.CFRoleId,
      holderUserArchived: user.holderUserArchived,
      department: user.department,
    }
  };
}
