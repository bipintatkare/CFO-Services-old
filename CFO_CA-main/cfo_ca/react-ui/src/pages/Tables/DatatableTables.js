import React, { Component } from "react";
import { MDBDataTable } from "mdbreact";
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';
import "./datatables.scss";

class DatatableTables extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
          <div className="container-fluid">

            <Breadcrumbs title="Tables" breadcrumbItem="Data Tables" />

            <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>
                    <CardTitle>Default Datatable </CardTitle>
                    <CardSubtitle className="mb-3">
                      mdbreact DataTables has most features enabled by default, so
                      all you need to do to use it with your own tables is to call
                    the construction function:{" "}
                      <code>&lt;MDBDataTable /&gt;</code>.
                  </CardSubtitle>

                    <MDBDataTable responsive bordered data={data} />


                  </CardBody>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>
                    <CardTitle>Stripped example </CardTitle>
                    <CardSubtitle className="mb-3">
                      mdbreact DataTables has most features enabled by default, so
                      all you need to do to use it with your own tables is to call
                    the construction function:{" "}
                      <code>&lt;MDBDataTable striped /&gt;</code>.
                  </CardSubtitle>

                    <MDBDataTable responsive striped bordered data={data} />

                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default DatatableTables;
