import React, { Component } from 'react';
import { Row, Col, Card, CardBody,CardTitle, Label, Button,Container, UncontrolledDropdown, UncontrolledTooltip,
 Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup,
  InputGroupAddon, Modal } from "reactstrap";
import { Link } from "react-router-dom";
import SearchFilter from "../SearchFilter"
import { MDBDataTable } from "mdbreact";

class VoucherTypes extends Component {
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
          label: "Type Id",
          field: "type_id",
          sort: "asc",
        },
        {
          label: "Total Entry",
          field: "total_entry",
          sort: "asc",
        },
      ],
      rows: [
        {
        id: "1",
        name: "ABCD",
        type_id: "23",
        total_entry: "",
        },
        {
        id: "2",
        name: "Baroda Voucher",
        type_id: "44",
        total_entry: "1",
        },
        {
        id: "3",
        name: "Cash-Debit",
        type_id: "122",
        total_entry: "74",
        },
        {
        id: "4",
        name: "Debit Note",
        type_id: "2342",
        total_entry: "32",
        },
        {
        id: "5",
        name: "Fleet Reciept",
        type_id: "431",
        total_entry: "56",
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
                                    Voucher Types
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

export default VoucherTypes;