import React, { Component } from "react";
import { Container, Row, Col, Button, Card, CardBody,
CardTitle, Modal, ModalHeader, ModalBody, ModalFooter, Table, Label, Input, Form } from "reactstrap";
import { Link } from "react-router-dom";

//import Charts
import { MDBDataTable } from "mdbreact";

import modalimage1 from "../../assets/images/product/img-7.png";
import modalimage2 from "../../assets/images/product/img-4.png";


//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

//i18n
import { withNamespaces } from 'react-i18next';


    const data = {
      columns: [
        {
          label: "Company Name",
          field: "companyName",
          sort: "asc",
          width: 150
        },
        {
          label: "XYZ",
          field: "xyz",
          sort: "asc",
          width: 270
        },
        {
          label: "<30",
          field: "range1",
          sort: "asc",
          width: 200
        },
        {
          label: "40>",
          field: "range2",
          sort: "asc",
          width: 100
        },
        {
          label: "<60 & 80>",
          field: "range3",
          sort: "asc",
          width: 150
        },

      ],
      rows: [

        {
          companyName: "Googli",
          xyz: "Bev Site",
          range1: "3232",
          range2: "4436",
          range3: "4326",
        },

        {
          companyName: "Appla",
          xyz: "Saptware",
          range1: "32324",
          range2: "54527",
          range3: "201232",
        }
      ]
    };


class TryTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
        rows: [],
        rows1: [],
        visible: false,
        modal_standard: false,
        from_range:'',
        to_range:''

        };
        this.tog_standard = this.tog_standard.bind(this);
    }
  tog_standard() {
    this.setState(prevState => ({
      modal_standard: !prevState.modal_standard
    }));
    this.removeBodyCss();
  }
  removeBodyCss() {
    document.body.classList.add("no_padding");
  }
  show() {
    this.setState({ visible: true });
  }
  hide() {
    this.setState({ visible: false });
  }
 handleAddRow = () => {
    const item = {
      name: ""
    };
    this.setState({
      rows: [...this.state.rows, item]
    });
  };

  handleAddRowNested = () => {
    const item1 = {
      name1: ""
    };
    this.setState({
      rows1: [...this.state.rows1, item1]
    });
  };
  handleRemoveRow = (e, idx) => {
    if (typeof (idx) != "undefined")
      document.getElementById("addr" + idx).style.display = "none";
  };
  handleRemoveRowNested = (e, idx) => {
    document.getElementById("nested" + idx).style.display = "none";
  };

  handleFormChange (event) {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
}

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        {/* Render Breadcrumb */}
                        <Breadcrumbs title={this.props.t('Dashboard')} breadcrumbItem={this.props.t('Dashboard')} />
                         <div className="text-center">
                          <button
                            type="button"
                            onClick={this.tog_standard}
                            className="btn btn-primary waves-effect waves-light"
                            data-toggle="modal"
                            data-target="#myModal"
                          >
                            Select Range
                        </button>
                        </div>

                        <Modal
                          isOpen={this.state.modal_standard}
                          toggle={this.tog_standard}
                        >
                        <Form>
                          <div className="modal-header">
                            <h5 className="modal-title mt-0" id="myModalLabel">
                              Select Range
                          </h5>
                            <button
                              type="button"
                              onClick={() =>
                                this.setState({ modal_standard: false })
                              }
                              className="close"
                              data-dismiss="modal"
                              aria-label="Close"
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                          <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">Click Add to add row</CardTitle>
                    <h6>You Have Selected Range From {this.state.from_range} To {this.state.to_range}</h6>
                    <table style={{ width: "100%" }}>
                      <tbody>

                        {this.state.rows.map((item, idx) => (
                          <tr id={"addr" + idx} key={idx}>
                            <td>
                              <form
                                className="repeater"
                                encType="multipart/form-data"
                              >
                                <div data-repeater-list="group-a">
                                  <Row data-repeater-item>
                                  <Col lg="4" className="form-group">

                                    <Label htmlFor="from">From</Label>
                                    <Input
                                      type="number"
                                      id="from"
                                      name="from_range"
                                      className="form-control"
                                       onChange={event => this.handleFormChange(event)}
                                    />
                                  </Col>

                                  <Col lg="4" className="form-group">
                                    <Label htmlFor="to">To</Label>
                                    <Input
                                    type="number"
                                    id="to"
                                    name="to_range"
                                    className="form-control"
                                     onChange={event => this.handleFormChange(event)}
                                    />
                                  </Col>

                                  <Col
                                    lg="3"
                                    className="form-group align-self-center"
                                  >

                                      <Button
                                        onClick={e =>
                                          this.handleRemoveRow(e, idx)
                                        }
                                        color="primary"
                                        className="mt-3"
                                        style={{ width: "100%" }}
                                      >Delete
                                      </Button>
                                    </Col>
                                  </Row>
                                </div>
                              </form>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Button onClick={this.handleAddRow} color="success">
                      Add{" "}
                    </Button>{" "}
                  </CardBody>
                </Card>
              </Col>
            </Row>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              onClick={this.tog_standard}
                              className="btn btn-secondary waves-effect"
                              data-dismiss="modal"
                            >
                              Close
                          </button>
                            <button
                              type="submit"
                              className="btn btn-primary waves-effect waves-light"
                            >
                              Submit
                          </button>
                          </div>
                          </Form>

                        </Modal>

                            <MDBDataTable responsive bordered data={data} />

                    </Container>
                </div>

            </React.Fragment>
        );
    }
}

export default withNamespaces()(TryTable);
