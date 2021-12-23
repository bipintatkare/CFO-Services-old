import React, { Component } from 'react';
import { Row, Col, Card, CardBody,CardTitle, Label, Button,Container, UncontrolledDropdown, UncontrolledTooltip,
 Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup,
  InputGroupAddon, Modal } from "reactstrap";
import { Link } from "react-router-dom";
import SearchFilter from "../SearchFilter"
import { MDBDataTable } from "mdbreact";

class GroupsTableCollapse extends Component {
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
          label: "Parent",
          field: "parent",
          sort: "asc",
        },
        {
          label: "Grand Parent",
          field: "grand_parent",
          sort: "asc",
        },
        {
          label: "Primary Group",
          field: "primary_group",
          sort: "asc",
        },
        {
          label: "This Yr Bal",
          field: "this_yr_bal",
          sort: "asc",
        },
        {
          label: "Prev Yr Bal",
          field: "prev_yr_bal",
          sort: "",
        },
      ],
      rows: [
        {
        id: "1",
        name: "Administrative",
        parent: "Indirect Expense",
        grand_parent: "Primary",
        primary_group: "Indirect Expense",
        this_yr_bal: "74647",
        prev_yr_bal: "564765"
        },

        {
        id: "2",
        name: "Bank Account",
        parent: "Indirect Expense",
        grand_parent: "Primary",
        primary_group: "Indirect Expense",
        this_yr_bal: "74647",
        prev_yr_bal: "564765"
        },

        {
        id: "3",
        name: "Capitabl Account",
        parent: "Indirect Expense",
        grand_parent: "Primary",
        primary_group: "Indirect Expense",
        this_yr_bal: "74647",
        prev_yr_bal: "564765"
        },

        {
        id: "4",
        name: "Driver Deposite",
        parent: "Indirect Expense",
        grand_parent: "Primary",
        primary_group: "Indirect Expense",
        this_yr_bal: "74647",
        prev_yr_bal: "564765"
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
                                    Groups
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

export default GroupsTableCollapse;