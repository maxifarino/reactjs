import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getWorkFlow, getWorkFlowComponents, saveWorkFlowComponents, resetWorkFlowComponents } from './service';
import _ from 'lodash';

import './workflow.css';

import Utils from '../../../../../lib/utils';
import PTable from '../../../../common/ptable';

const Alerts = require('../../../../alerts');

class Workflow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableOrderActive: 'description',
      filter: {
        pageNumber: 1
      },
      order: {
        detail: 'desc',
        description: 'asc'
      },
      loading: false,
      isTableVisible: true,
      currentWorkflow: {},
      workflows: [],
      components: [],
    }
  }

  componentWillMount() {
    getWorkFlow(this.props.holderId, this.props.userProfile.authToken, (err, data) => {
      this.setState({ workflows: data })
    });
  }

  clickOnColumnHeader = (e, field) => {
    if (field === 'view') return;
    let newState = {
      tableOrderActive: field,
      order: {
        detail: field === 'detail' ? 'asc' : 'desc',
        description: field === 'description' ? 'asc' : 'desc',
      }
    };
    newState.order[field] = this.state.order[field] === 'asc' ? 'desc' : 'asc';
    this.setState(newState);
  }

  setPageFilter = (e, pageNumber) => {
    if (this.state.filter.pageNumber !== pageNumber) {
      // save page number
      this.setState({
        filter: {
          pageNumber
        }
      });

    }
  }

  onViewWorkflow = (workflow) => {
    if (this.state.loading || !workflow.workflowId) return;

    this.setState({ loading: true });

    getWorkFlowComponents(workflow.workflowId, this.props.userProfile.authToken, (err, data) => {
      if (!data || !data.possible_values) return;
      const components = this.buildComponents(data.components, data.possible_values);
      this.setState({
        loading: false,
        isTableVisible: false,
        currentWorkflow: workflow,
        components,
        possible_values: data.possible_values
      });
    });
  }

  onSaveChanges = () => {
    const payload = this.buildPayload();
    //console.log(JSON.stringify(payload));
    this.setState({ loading: true, isTableVisible: true });
    saveWorkFlowComponents(payload, this.props.userProfile.authToken, (err, data) => {
      this.setState({ loading: false, isTableVisible: false });
    });
  }

  onResetWorkflow = () => {

    const onResetConfirmation = (confirmed) => {
      if (!confirmed) return;
      this.setState({ loading: true, isTableVisible: true });
      resetWorkFlowComponents(this.state.currentWorkflow.workflowId, this.props.userProfile.authToken, (err, data) => {
        if (!data || !data.possible_values) return;
        const components = this.buildComponents(data.components, data.possible_values);
        this.setState({
          loading: false,
          isTableVisible: false,
          components,
          possible_values: data.possible_values
        });
      });
    }

    const alertContent = {
      title: 'Reset To Default',
      text: 'Are you sure you want to reset this workflow?',
      btn_no: 'Cancel',
      btn_yes: 'Accept'
    }
    Alerts.showActionConfirmation(alertContent, onResetConfirmation);
  }

  onAddComponent = () => {
    const newComponents = this.state.components;
    newComponents.push({
      positionIndex: this.state.components.length + 1,
      current_value: { componentId: "" },
      current_parameters: []
    });
    this.setState({ components: newComponents });
  }

  buildPayload = () => {
    const payload = {
      hiringClientId: this.props.holderId,
      workflowTypeId: this.state.currentWorkflow.id,
      components: []
    }
    const components = this.state.components;
    for (var i = 0; i < components.length; i++) {
      // create the component
      const component = {
        positionIndex: components[i].positionIndex,
        componentId: components[i].current_value.componentId,
        parameters: []
      }

      // get components parameters
      const parameters = components[i].current_parameters;
      for (var j = 0; j < parameters.length; j++) {
        const parameter = {
          componentParameterId: parameters[j].componentParameterId,
          value: parameters[j].value
        }
        component.parameters.push(parameter)
      }

      payload.components.push(component);
    }
    return payload;
  }

  buildComponents = (components, possible_values) => {
    for (var i = 0; i < components.length; i++) {
      // look for all possible params for the current components
      let parameters = [];
      for (var j = 0; j < possible_values.length; j++) {
        if (components[i].current_value.componentId.toString() === possible_values[j].id.toString()) {
          components[i].current_value.name = possible_values[j].name;
          parameters = possible_values[j].parameters;
          break;
        }
      }
      components[i].current_parameters = this.buildComponentParams(components[i].current_parameters, parameters);
    }
    return components;
  }

  buildComponentParams = (currentParams, allParameters) => {
    const newParams = [];
    for (var i = 0; i < allParameters.length; i++) {
      // create a new possible param for this component
      const newParam = {
        componentParameterId: allParameters[i].id,
        name: allParameters[i].name,
        value: ""
      }
      //check if there's an stored value
      for (var j = 0; j < currentParams.length; j++) {
        if (currentParams[j].componentParameterId === allParameters[i].id) {
          newParam.value = currentParams[j].value;
          break;
        }
      }
      //add new param
      newParams.push(newParam);
    }
    return newParams;
  }

  renderParameter = (component, parameter, idx) => {
    const index = _.findIndex(component.current_parameters, function (o) { return o.componentParameterId.toString() === parameter.id.toString() });
    const currentParam = component.current_parameters[index];
    // create the list of options
    const possibleValues = Utils.getOptionsList("Select an option", parameter.possible_values, 'value', 'id', 'value');

    const onParamChange = (e) => {
      // modify the component's current parameter value
      const componentParams = component.current_parameters;
      componentParams[index].value = e.target.value;
      // look for the component and asign the new params
      const newComponents = this.state.components.map(
        (a, index) => a.positionIndex === component.positionIndex ?
          {
            ...a,
            current_parameters: componentParams
          } : a
      );
      //console.log(newComponents);
      // save the modified component list
      this.setState({ components: newComponents })
    }

    return (
      <div key={idx} className="row parameters-row">
        <div className="col col-lg-3 parameter-col">
          <div className="param-name">{parameter.name}:</div>
        </div>
        <div className="col col-lg-9 parameter-col" style={{ paddingLeft: '15px' }}>
          {
            parameter.possible_values.length > 0 ?
              <select className="param-select" onChange={onParamChange} value={currentParam.value}>
                {
                  possibleValues.map((item, idx) => {
                    return (
                      <option key={idx} value={item.value}>{item.label}</option>
                    )
                  })
                }
              </select>
              :
              <input className="param-select" type="text" value={currentParam.value} onChange={onParamChange} />
          }

        </div>
      </div>
    );
  }

  renderComponent = (component, idx) => {
    const positionIndex = component.positionIndex;
    const currentValueId = component.current_value.componentId || "";

    // get all selected component's possible parameters
    let parameters = [];
    if (currentValueId !== "") {
      const index = _.findIndex(this.state.possible_values, function (o) { return o.id.toString() === currentValueId.toString() });
      parameters = this.state.possible_values[index].parameters;
    }

    // create the list of options
    const possibleValues = Utils.getOptionsList("Select an action", this.state.possible_values, 'name', 'id', 'name');

    const onComponentChange = (e) => {
      //look for the modified component and change the current_value.componentId
      let newComponents = this.state.components;
      for (var i = 0; i < newComponents.length; i++) {
        if (newComponents[i].positionIndex === positionIndex) {
          newComponents[i].current_value.componentId = e.target.value;
          break;
        }
      }
      //build components to get new current_value.name and parameters
      newComponents = this.buildComponents(newComponents, this.state.possible_values);
      // save the modified component list
      this.setState({ components: newComponents })
    }

    return (
      <div key={idx} className="row component-row">
        <div className="col col-lg-2 cell">
          <span className="component-line-id">{positionIndex}</span>
        </div>
        <div className="col col-lg-5 cell dashed-border-left">
          <select className="component-select" onChange={onComponentChange} value={currentValueId}>
            {
              possibleValues.map((item, idx) => {
                return (
                  <option key={idx} value={item.value}>{item.label}</option>
                )
              })
            }
          </select>
        </div>
        <div className="col col-lg-5 cell dashed-border-left" style={{ display: 'flex', flexDirection: 'column' }}>
          {parameters.map((param, idx) => this.renderParameter(component, param, idx))}
        </div>
      </div>
    );
  }

  render() {
    if (!this.state.workflows) {
      return null;
    }

    const workflowsTableMetadata = {
      fields: [
        'description',
        'detail',
        'view'
      ],
      header: {
        description: 'Type',
        detail: 'Description',
        view: ''
      }
    };

    const field = this.state.tableOrderActive;
    const direction = this.state.order[field];
    const orderedLanguagesList = _.orderBy(this.state.workflows, [o => o[field] ? o[field].toLowerCase() : ""], direction);
    const workflowsTableBody = orderedLanguagesList.map((item) => {
      const style = item.workflowId ? {} : { color: 'red' };
      return {
        description: item.description,
        detail: item.detail,
        view: (
          <a className="cell-table-link icon-quick_view" style={style}
            onClick={(e) => { this.onViewWorkflow(item) }}>
            VIEW WORKFLOW
          </a>
        ),
      };
    });

    const start = (this.state.filter.pageNumber - 1) * 10;
    const end = start + 10;
    const workflowsTableData = {
      fields: workflowsTableMetadata.fields,
      header: workflowsTableMetadata.header,
      body: workflowsTableBody.slice(start, end)
    };
    const paginationSettings = {
      total: this.state.workflows.length,//total elements rendered after search is applied
      itemsPerPage: 10,
      setPageHandler: this.setPageFilter,
      currentPageNumber: this.state.filter.pageNumber,
    };

    return (
      <div className="list-view admin-view-body">
        {
          !this.state.isTableVisible ?
            <section className="list-view-header projects-view-header">
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <nav className="list-view-nav">
                  <ul>
                    <li><a
                      className="list-view-nav-link nav-bn icon-login-door no-overlapping"
                      onClick={() => this.setState({ isTableVisible: true })}>
                      BACK TO WORKFLOWS
                    </a></li>
                  </ul>
                </nav>
                <nav className="list-view-nav" style={{ marginRight: '20px' }}>
                  <ul>
                    <li><a
                      className="list-view-nav-link nav-bn icon-log no-overlapping"
                      onClick={this.onResetWorkflow}>
                      {"RESET TO DEFAULT"}
                    </a></li>
                    <li><a
                      className="list-view-nav-link nav-bn icon-save no-overlapping"
                      onClick={this.onSaveChanges} >
                      {"SAVE CHANGES"}
                    </a></li>
                  </ul>
                </nav>
              </div>
            </section> : null
        }

        {
          this.state.isTableVisible ?
            <div className="list-view admin-view-body">
              <PTable
                sorted={true}
                items={workflowsTableData}
                wrapperState={this.state}
                tableOrderActive={this.state.tableOrderActive}
                clickOnColumnHeader={this.clickOnColumnHeader}
                isFetching={this.state.loading}
                customClass='templates-list'
                pagination={paginationSettings}
              />
            </div> : null
        }

        {
          !this.state.isTableVisible ?
            <div className="edit-workflow-container">
              <div className="workflow-title">
                {this.state.currentWorkflow.description}
              </div>
              <div className="workflow-components">
                <div className="row component-row">
                  <div className="col col-lg-2 cell">
                  </div>
                  <div className="col col-lg-5 cell dashed-border-left">
                    <span className="component-title">WORKFLOW ACTION</span>
                  </div>
                  <div className="col col-lg-5 cell dashed-border-left">
                    <span className="component-title">ACTION PARAMETERS</span>
                  </div>
                </div>
                {this.state.components.map(this.renderComponent)}
              </div>
              <div className="add-component-btn-container">
                <button className="add-component-btn" onClick={this.onAddComponent}>Add Action</button>
              </div>
            </div> : null
        }
      </div>
    );
  }

};

const mapStateToProps = (state) => {
  return {
    userProfile: state.login,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //sendTemplateActions: bindActionCreators(sendTemplateActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Workflow);
