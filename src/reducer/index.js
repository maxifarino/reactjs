import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import login from './../components/auth/login/reducer';
import forgot from './../components/auth/forgot/reducer';
import reset from './../components/auth/reset/reducer';
import register from './../components/register/reducer';
import payments from './../components/payments/reducer';
import exago from './../components/exago/reducer';
import users from './../components/users/reducer';
import projectUsers from './../components/certfocus/project-users/reducer';
import formBuilder from './../components/formBuilder/reducer';
import formPreviewer from './../components/formPreviewer/reducer';
import formLink from './../components/formLink/reducer';
import forms from './../components/formList/reducer';
import formSubmissions from './../components/formSubmissions/reducer';
import templates from '../components/communication-templates/list/reducer';
import templateBuilder from './../components/communication-templates/builder/reducer';
import mailComposer from './../components/mailComposer/reducer';
import hc from './../components/hiringclients/reducer';
import sc from './../components/subcontractors/reducer';
import HCProfile from './../components/hc-profile/reducer';
import SCProfile from './../components/sc-profile/reducer';
import projects from './../components/hc-profile/tabs/projects/reducer';
import localization from './../localization/reducer';
import common from './../components/common/reducer';
import sendTemplate from './../components/sendTemplateDialog/reducer';
import workflow from './../components/hc-profile/tabs/workflow/reducer';
import notesTasks from './../components/sc-profile/tabs/notesTasks/reducer';
import financials from './../components/sc-profile/tabs/financialInfo/reducer';
import tradeCategories from './../components/hc-profile/tabs/tradeCategories/reducer';
import files from './../components/sc-profile/tabs/files/reducer';
import references from './../components/sc-profile/tabs/references/reducer';
import videos from './../components/videoPage/reducer';
import reviewApplications from './../components/reviewApplications/reducer';
import apply from './../components/reviewApplications/apply/reducer';
import holders from './../components/certfocus/holders/reducer';
import holdersProfile from './../components/certfocus/holders-profile/reducer';
import contacts from './../components/certfocus/contacts/reducer';
import holdersProjects from './../components/certfocus/projects/reducer';
import tags from './../components/certfocus/holders-profile/tabs/tags/reducer';
import projectDetails from './../components/certfocus/project-view/reducer';
import customFields from './../components/certfocus/holders-profile/tabs/custom-fields/reducer';
import documentTypes from './../components/certfocus/holders-profile/tabs/document-types/reducer';
import holderSettings from './../components/certfocus/holders-profile/tabs/settings/reducer';
import projectInsureds from './../components/certfocus/project-insureds/reducer';
import insureds from './../components/certfocus/insureds/reducer';
import insuredDetails from './../components/certfocus/insured-view/reducer';
import CFTasks from './../components/certfocus/tasks/reducer';
import CFNotes from './../components/certfocus/notes/reducer';
import search from './../components/certfocus/search/reducer';
import coverageTypes from './../components/certfocus/coverage-types/reducer';
import coverageTypesSettings from './../components/certfocus/settings/coverageTypes/reducer';
import endorsements from './../components/certfocus/holders-profile/tabs/endorsements/reducer';
import holderRequirementSets from './../components/certfocus/requirement-sets/reducer';
import holderRequirementSetsView from './../components/certfocus/requirement-sets-view/reducer';
import attachments from './../components/certfocus/attachments/reducer';
import projectCertText from './../components/certfocus/project-view/tabs/cert-text/reducer';
import projectRequirements from './../components/certfocus/project-view/tabs/requirements/reducer';
import finance from './../components/certfocus/insured-view/tabs/finance/reducer';
import coverages from './../components/certfocus/insured-view/tabs/coverages/reducer';
import processing from './../components/certfocus/processing/reducer';
import portal from './../components/certfocus/portal/reducer';
import holdersWorkflow from './../components/certfocus/holders-profile/reducer';
import certUpload from './../components/certfocus/cert-upload/reducer';
import customTerminologySettings from './../components/certfocus/settings/customTerminology/reducer';
import deficiency from './../components/certfocus/deficiency/reducer';
import waivers from './../components/certfocus/insured-view/tabs/waivers/reducer';
import documents from './../components/certfocus/documents/reducer';
import agencies from './../components/certfocus/agencies/reducer';
import documentQueueDefinitions from './../components/certfocus/settings/documentQueueDefinitions/reducer';
import copySubmissions from './../components/copySubmissions/reducer';
import deficiences from './../components/common/deficiences/reducers'
import certificates from './../components/certfocus/certificates/reducer';
import departments from './../components/certfocus/settings/departments/reducer';
import mainCoverages from './../components/certfocus/coverages/reducer';

const rootReducer = combineReducers({
  login,
  forgot,
  reset,
  register,
  payments,
  exago,
  users,
  form: formReducer,
  formBuilder,
  formPreviewer,
  formLink,
  forms,
  formSubmissions,
  templates,
  templateBuilder,
  mailComposer,
  hc,
  sc,
  HCProfile,
  SCProfile,
  projects,
  localization,
  common,
  sendTemplate,
  workflow,
  notesTasks,
  financials,
  tradeCategories,
  files,
  references,
  videos,
  reviewApplications,
  apply,
  holders,
  holdersProfile,
  contacts,
  holdersProjects,
  tags,
  projectDetails,
  customFields,
  documentTypes,
  holderSettings,
  projectInsureds,
  insureds,
  insuredDetails,
  CFTasks,
  CFNotes,
  search,
  coverageTypes,
  coverageTypesSettings,
  endorsements,
  holderRequirementSets,
  holderRequirementSetsView,
  attachments,
  projectCertText,
  projectRequirements,
  finance,
  coverages,
  processing,
  portal,
  holdersWorkflow,
  certUpload,
  customTerminologySettings,
  deficiency,
  waivers,
  documents,
  agencies,
  documentQueueDefinitions,
  projectUsers,
  copySubmissions,
  deficiences,
  certificates,
  departments,
  mainCoverages
});

export default rootReducer;
