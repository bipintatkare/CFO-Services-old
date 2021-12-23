import React, { Component } from 'react';
import { Row, Col, Card, CardBody,CardTitle, Label, Button,Container, UncontrolledDropdown, UncontrolledTooltip,
 Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup,
  InputGroupAddon, Modal } from "reactstrap";
import { Link } from "react-router-dom";
import SearchFilter from "../SearchFilter"
import { MDBDataTable } from "mdbreact";

class Ledgers extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
    const data = {
      columns: [
        {
          label: "Id",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Phone",
          field: "phone",
          sort: "asc",
        },
        {
          label: "Email",
          field: "email",
          sort: "asc",
        },
        {
          label: "GST",
          field: "gst",
          sort: "asc",
        },
        {
          label: "Is Cost Center On",
          field: "is_cost_center_on",
          sort: "asc",
        },
        {
          label: "Opening Balance",
          field: "opening_balance",
          sort: "asc",
        },
        {
          label: "Closing Balance",
          field: "closing_balance",
          sort: "asc",
        },
      ],
      rows: [
        {
        id: "1",
        name: "Abhijeet",
        phone: "8421764686",
        email: "abhg@gmail.com",
        gst: "18%",
        is_cost_center_on: "",
        opening_balance: "542234",
        closing_balance: "75485",
        },
        {
        id: "2",
        name: "Cash",
        phone: "9766323877",
        email: "ihdfg@gmail.com",
        gst: "18%",
        is_cost_center_on: "",
        opening_balance: "2342343",
        closing_balance: "57567857",
        },
        {
        id: "3",
        name: "Sales",
        phone: "9730644834",
        email: "sales@gmail.com",
        gst: "18%",
        is_cost_center_on: "",
        opening_balance: "633425",
        closing_balance: "5755678",
        },
        {
        id: "4",
        name: "Abhishek",
        phone: "9860918453",
        email: "abhishek@gmail.com",
        gst: "18%",
        is_cost_center_on: "",
        opening_balance: "54252432",
        closing_balance: "246787",
        },
        {
        id: "5",
        name: "Waseem Khan",
        phone: "7507072366",
        email: "waseem@gmail.com",
        gst: "18%",
        is_cost_center_on: "",
        opening_balance: "2525",
        closing_balance: "56678757",
        },
      ]
    };
        return (
            <React.Fragment>
            <div className="page-content">
                    <Container fluid>
                     <SearchFilter/>
                     <Card>
                        <CardBody>
                            <CardTitle>
                                <center>
                                    Ledgers
                                </center>
                            </CardTitle>
                            <br/>
                            <MDBDataTable responsive striped bordered data={data} />

                        </CardBody>
                     </Card>


                    </Container>
            </div>

            </React.Fragment>
        );
    }
}

export default Ledgers;