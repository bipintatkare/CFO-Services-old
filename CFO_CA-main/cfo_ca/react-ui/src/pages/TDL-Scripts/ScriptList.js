import React, { Component } from "react";
import { MDBDataTable } from "mdbreact";
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";

//Import Breadcrumb
import "./datatables.scss";

class ScriptList extends Component {
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
        <div className="">
          <div className="container-fluid">

            <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>
                    <CardTitle>Script List </CardTitle>
                    <br/>

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

export default ScriptList;
