import React, { Component } from 'react';
import { Accordion, Card } from 'react-bootstrap';

class AccordionCommon extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  renderColumns() {
    let component = "";
    if (this.props.columns) {
      component = this.props.columns.map(element => {
        return <th scope="col">element</th>
      });
    }
    return component;
  }

  

  render() {

    const rowData=!this.props.data?[] : this.props.data.map(element=>{
      return (<td>{element}</td>);
    })

    return (
      <Accordion defaultActiveKey="0">
        <Card>
          <Accordion.Toggle as={Card.Header} variant="text" eventKey="0">
            <div className="row">
              <div className="col d-flex justify-content-center">
                <span><h5>{this.props.title}</h5></span>
              </div>
            </div>
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <table class="table mt-0">
                <thead>
                  <tr>
                    {this.renderColumns()}
                    <th scope="col ml-2"></th>
                    <th scope="col ml-2"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {rowData}
                    <td><a href="javascript:void(0)" onClick={() => console.log(alert(123))}>Confirm</a></td>
                    <td><a href="javascript:void(0)" onClick={() => console.log()}>Waive</a></td>
                  </tr>
                  <tr>
                    <td>Flood</td>
                    <td>Limit</td>
                    <td>$1.750.000</td>
                    <td>$1.500.000</td>
                    <td><a href="javascript:void(0)">Confirm</a></td>
                    <td><a href="javascript:void(0)">Waive</a></td>
                  </tr>
                  <tr>
                    <td>Flood</td>
                    <td>Limit</td>
                    <td>$1.750.000</td>
                    <td>$1.500.000</td>
                    <td><a href="javascript:void(0)">Confirm</a></td>
                    <td><a href="javascript:void(0)">Waive</a></td>
                  </tr>
                </tbody>
              </table>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    )
  }
}
export default (AccordionCommon);