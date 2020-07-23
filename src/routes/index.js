import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Login from '../components/auth/login';
import Forgot from '../components/auth/forgot';
import Reset from '../components/auth/reset';
import Register from '../components/register';
import UserAgreement from '../components/register/UserAgreement';
import Payments from '../components/payments';
import FormSubmissions from '../components/formSubmissions';
import Users from '../components/users';
import Dashboard from '../components/dashboard';
import FormBuilder from '../components/formBuilder';
import FormPreviewer from '../components/formPreviewer';
import FormLink from '../components/formLink';
import PrivateRoute from './privateRoute';
import FormList from '../components/formList';
import TemplateBuilder from '../components/communication-templates/builder';
import TemplateList from '../components/communication-templates/list';
import HiringClients from '../components/hiringclients';
import Subcontractors from '../components/subcontractors';
import HCProfile from '../components/hc-profile';
import SCProfile from '../components/sc-profile';
import UserLog from '../components/users/log';
import UserProfile from '../components/profile';
import Tasks from '../components/tasks';
import MailComposer from '../components/mailComposer';
import Mail from '../components/mail';
import VideoPage from '../components/videoPage';
import ReviewApplications from '../components/reviewApplications';
import Apply from '../components/reviewApplications/apply';
import HoldersProfile from '../components/certfocus/holders-profile';
import Contacts from '../components/certfocus/contacts';
import Projects from '../components/certfocus/projects';
import ProjectView from '../components/certfocus/project-view';
import Insureds from '../components/certfocus/insureds';
import Search from '../components/certfocus/search';
import InsuredView from '../components/certfocus/insured-view';
import DataEntryView from '../components/certfocus/processing';
import Portal from '../components/certfocus/portal';
import Settings from '../components/certfocus/settings';
import certUpload from '../components/certfocus/cert-upload';
import CertUploadError from '../components/certfocus/cert-upload/error';
import DeficiencyViewer from '../components/certfocus/deficiency';
import Documents from '../components/certfocus/documents';
import Agencies from '../components/certfocus/agencies';
import Coverages from '../components/certfocus/coverages';
import Certificates from '../components/certfocus/certificates';

const NoMatchPage = () => {
  return (
    <h3>404 - Not found</h3>
  );
};

const getRoutes = store => {
  const {
    dashboard,
    hiringClients,
    formList,
    formPreviewer,
    templates,
    subcontractors,
    users,
    video,
    holders,
    contacts,
    certFocusProjects,
    insured,
    search,
    processing,
    documents,
    agencies,
  } = store.getState().localization.strings;
  return (
    <Switch>
      <Route
        path="/login"
        component={Login} />
      <Route
        path="/forgot"
        component={Forgot} />
      <Route
        path="/register/:hash" exact
        component={Register}
        store={store} />
      <Route
        path="/agreement"
        component={UserAgreement} />
      <PrivateRoute
        path="/payments"
        component={Payments}
        store={store} />
      <PrivateRoute
        path="/" exact
        component={Dashboard}
        store={store}
        title={dashboard.title}
        hasSidebar
        onlyHeader />
      <PrivateRoute
        path="/reset"
        component={Reset}
        store={store} />
      <PrivateRoute
        path="/admin/users" exact
        component={Users}
        store={store}
        title={users.title}
        onlyHeader />
      <PrivateRoute
        path="/dashboard/" exact
        component={Dashboard}
        store={store}
        title={dashboard.title}
        onlyHeader />
      <PrivateRoute
        path="/dashboard/:printReport"
        component={Dashboard}
        store={store}
        title={'Print Report'}
        onlyHeader />
      <PrivateRoute
        path="/form-link/:link" exact
        component={FormLink}
        store={store} />
      <PrivateRoute
        path="/form-submission/:savedFormId" exact
        component={FormLink}
        store={store} />
      <PrivateRoute
        path="/forms/new-form" exact
        component={FormBuilder}
        store={store}
        title={formList.title}
        onlyHeader />
      <PrivateRoute
        path="/forms/preview" exact
        component={FormPreviewer}
        store={store}
        title={formPreviewer.title}
        onlyHeader />
      <PrivateRoute
        path="/forms/" exact
        component={FormList}
        store={store}
        title={formList.title}
        onlyHeader />
      <PrivateRoute
        path="/communication-templates/"
        exact
        component={TemplateList}
        store={store}
        title={templates.title}
        onlyHeader />
      <PrivateRoute
        path="/communication-templates/builder"
        exact
        component={TemplateBuilder}
        store={store}
        title={templates.title}
        fromhc={false}
        onlyHeader/>
      <PrivateRoute
        path="/communication-templates/builder/:id"
        exact
        component={TemplateBuilder}
        store={store}
        fromhc={true}
        title={templates.title}
        onlyHeader/>
      <PrivateRoute
        path="/hiringclients/" exact
        component={HiringClients}
        store={store}
        title={hiringClients.title}
        cfTitle={holders.title}
        onlyHeader />
      <PrivateRoute
        path="/subcontractors/" exact
        component={Subcontractors}
        store={store}
        title={subcontractors.title}
        onlyHeader />
      <PrivateRoute
        path="/hiringclients/:hcId" exact
        component={HCProfile}
        store={store}
        title={hiringClients.title}
        cfTitle={holders.title}
        onlyHeader />
      <PrivateRoute
        path="/subcontractors/:scId" exact
        component={SCProfile}
        store={store}
        title={subcontractors.title}
        onlyHeader />
      <PrivateRoute
        path="/admin/users/log" exact
        component={UserLog}
        store={store}
        title={'User Log'}
        onlyHeader />
      <PrivateRoute
        path="/forms/submissions" exact
        component={FormSubmissions}
        store={store}
        title={'Form Submissions'}
        onlyHeader />
      <PrivateRoute
        path="/profile" exact
        component={UserProfile}
        store={store}
        title={'Profile'}
        cfTitle={'Profile'}
        onlyHeader />
      <PrivateRoute
        path="/tasks" exact
        component={Tasks}
        store={store}
        title={'Tasks'}
        cfTitle={'Tasks'}
        onlyHeader />
      <PrivateRoute
        path="/mail" exact
        component={Mail}
        store={store}
        title={'Mail'}
        onlyHeader />
      <PrivateRoute
        path="/mail/:mailData" exact
        component={Mail}
        store={store}
        title={'Mail'}
        onlyHeader />
      <PrivateRoute
        path="/video" exact
        component={VideoPage}
        store={store}
        title={video.title}
        onlyHeader />
      <Route
        path="/apply"
        component={Apply}
        store={store}
        />    

      {/* CERTFOCUS ROUTES */}
      <Route
        path="/certfocus/portal"
        component={Portal}
        store={store}
      />
      <PrivateRoute
        path="/certfocus/holders/:holderId" exact
        component={HoldersProfile}
        store={store}
        cfTitle={holders.title}
        onlyHeader
      />
      <PrivateRoute
        path="/certfocus/contacts" exact
        component={Contacts}
        store={store}
        cfTitle={contacts.title}
        onlyHeader
      />
      <PrivateRoute
        path="/certfocus/projects" exact
        component={Projects}
        store={store}
        cfTitle={certFocusProjects.title}
        onlyHeader
      />
      <PrivateRoute
        path="/certfocus/projects/:projectId" exact
        component={ProjectView}
        store={store}
        cfTitle={certFocusProjects.title}
        onlyHeader
      />
      <PrivateRoute
        path="/certfocus/insureds" exact
        component={Insureds}
        store={store}
        cfTitle={insured.title}
        onlyHeader
      />
      <PrivateRoute
        path="/certfocus/settings" exact
        component={Settings}
        store={store}
        cfTitle={'Settings'}
        onlyHeader
      />
      <PrivateRoute
        path="/certfocus/settings/:reqSetId" exact
        component={Settings}
        store={store}
        title={'Settings'}
        onlyHeader
      />
      <PrivateRoute
        path="/certfocus/searchResults" exact
        component={Search}
        store={store}
        cfTitle={search.title}
        onlyHeader
      />
      <PrivateRoute
        path="/certfocus/insureds/:insuredId" exact
        component={InsuredView}
        store={store}
        cfTitle={insured.title}
        onlyHeader
      />
      <PrivateRoute
        path="/certfocus/insureds/:insuredId/:holderId/:holderName" exact
        component={InsuredView}
        store={store}
        cfTitle={insured.title}
        onlyHeader
      />
      <PrivateRoute
        path="/certfocus/processing" exact
        component={DataEntryView}
        store={store}
        cfTitle={processing.dataEntry.title}
        onlyHeader
      />
      <PrivateRoute
        path="/certfocus/processing/:certificateId" exact
        component={DataEntryView}
        store={store}
        title={processing.dataEntry.title}
        onlyHeader
      />
      <PrivateRoute
        path="/certfocus/deficiencyViewer/:documentId" exact
        component={DataEntryView}
        store={store}
        title={processing.dataEntry.title}
        onlyHeader
      />
      <Route
        path="/certfocus/certUploadError/:holderName" exact
        component={CertUploadError}
        store={store} />
      <Route
        path="/certfocus/certUpload/:hash" exact
        component={certUpload}
        store={store} />
      <PrivateRoute
        path="/certfocus/deficiency/:documentId" exact
        component={DeficiencyViewer}
        store={store}
        cfTitle={processing.deficiencyViewer.title}
        onlyHeader
      />
      <PrivateRoute
        path="/certfocus/documents" exact
        component={Documents}
        store={store}
        cfTitle={documents.title}
        onlyHeader
      />
      <PrivateRoute
        path="/certfocus/agencies" exact
        component={Agencies}
        store={store}
        cfTitle={agencies.title}
        onlyHeader
      />
      <PrivateRoute
        path="/certfocus/coverages/:projectInsuredId/:requirementSetId" exact
        component={Coverages}
        store={store}
        cfTitle="Coverages"
        onlyHeader
      />
      <PrivateRoute
        path="/certfocus/certificates/:projectInsuredId" exact
        component={Certificates}
        store={store}
        cfTitle="Certificates"
        onlyHeader
      />
      <Route
        component={NoMatchPage}
        />  
    </Switch>
  );
};

export default getRoutes;
