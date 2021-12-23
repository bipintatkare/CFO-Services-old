import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Button,Container, UncontrolledDropdown, UncontrolledTooltip, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { Link } from "react-router-dom";
import LoadingComponent from './loadingComponent';
import { MDBDataTable } from "mdbreact";
import "./datatables.scss";


class ComMappingGrpList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }



    render() {

      const data = {
      columns: [
        {
          label: "Name",
          field: "name",
          sort: "asc",
          width: 150
        },

        {
          label: "Start date",
          field: "date",
          sort: "asc",
          width: 150
        },
        {
          label: "Salary",
          field: "salary",
          sort: "asc",
          width: 100
        }
      ],
      rows: [


        {
          name: "Michael Bruce",
          position: "Javascript Developer",
          office: "Singapore",
          age: "29",
          date: "2011/06/27",
          salary: "$183"
        },

        {
          name: "Michael Bruce",
          position: "Javascript Developer",
          office: "Singapore",
          age: "29",
          date: "2011/06/27",
          salary: "$183"
        },

        {
          name: "Michael Bruce",
          position: "Javascript Developer",
          office: "Singapore",
          age: "29",
          date: "2011/06/27",
          salary: "$183"
        },
        {
          name: "Donna Snider",
          position: "Customer Support",
          office: "New York",
          age: "27",
          date: "2011/01/25",
          salary: "$112"
        }
      ]
    };
        return (
            <React.Fragment>
            <div className="page-content">
            <Row>
            <Col md="12">
                <Container fluid>
                    <Card>
                         <CardBody>
                            <center><h2>Company Group List</h2></center>
                            <br/>
                            <Row>
                                <Col md="8"></Col>
                                <Col md="4">
                                    <div className="form-group row">
                                            <label className="col-md-2 col-form-label">Filter</label>
                                            <div className="col-md-10">
                                                <select className="form-control">
                                                    <option>Filter A</option>
                                                    <option>Filter B</option>
                                                    <option>Filter C</option>
                                                </select>
                                            </div>
                                        </div>
                                </Col>

                              <Col md="12">
                                <Card>
                                  <CardBody>

                                    <MDBDataTable responsive bordered data={data} />

                                  </CardBody>
                                </Card>
                              </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Container>
            </Col>
            </Row>
            </div>

            </React.Fragment>
        );
    }
}

export default ComMappingGrpList;