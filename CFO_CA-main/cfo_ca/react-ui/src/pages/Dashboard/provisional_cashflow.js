import React, { Component } from 'react';
import { Row, Col, Card, CardBody,Container, Button, UncontrolledDropdown, UncontrolledTooltip, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { Link } from "react-router-dom";
import SearchFilter from "./SearchFilter"

//Simple bar
import SimpleBar from "simplebar-react";

const tableborder = {
    td:{
            border:"1px solid black" }
        }

class ProvisinalCashflow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search_Menu: false,
            settings_Menu: false,
            other_Menu: false,
        }
        this.toggleSearch = this.toggleSearch.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);
        this.toggleOther = this.toggleOther.bind(this);
    }

    //Toggle Chat Box Menus
    toggleSearch() {
        this.setState(prevState => ({
            search_Menu: !prevState.search_Menu
        }));
    }

    toggleSettings() {
        this.setState(prevState => ({
            settings_Menu: !prevState.settings_Menu
        }));
    }

    toggleOther() {
        this.setState(prevState => ({
            other_Menu: !prevState.other_Menu
        }));
    }

    render() {
        return (
            <React.Fragment>
            <div className="page-content">
                    <Container fluid>
            <SearchFilter/>
            <center>


            <h2 style={{marginTop:"2%"}}>Provisional Cashflow for the period</h2></center>
                            <Col style={{marginTop:"2%",marginLeft:"5%",marginBottom:"10%"}} xl="11">
                                <Card>
                                    <table className="table">
                                      <thead className="thead-dark">
                                        <tr>
                                          <th scope="col"><center>Details</center></th>
                                          <th scope="col"><center>Week 1</center></th>
                                          <th scope="col"><center>Week 2</center></th>
                                          <th scope="col"><center>Week 3</center></th>
                                          <th scope="col"><center>Week 4</center></th>
                                          <th scope="col"><center>Total</center></th>
                                        </tr>
                                      </thead>
                                      <tbody>

                                        <tr>
                                          <th style={tableborder.td} scope="row">Opening Balance</th>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                        </tr>

                                        <tr>
                                          <th style={tableborder.td} scope="row">Receipt From Debtors</th>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                        </tr>
                                        <tr>
                                          <th style={tableborder.td} scope="row">Loan Received</th>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                        </tr>
                                        <tr>
                                          <th style={tableborder.td} scope="row">Subsidy Received</th>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                        </tr>
                                        <tr>
                                          <th style={tableborder.td} scope="row">Total Collection (A)</th>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                        </tr>
                                        <tr>
                                          <th style={tableborder.td} scope="row">Less</th>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                        </tr>
                                        <tr>
                                          <th style={tableborder.td} scope="row">Payment Of Expenses</th>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                        </tr>
                                        <tr>
                                          <th style={tableborder.td} scope="row">Payment Of Creditors</th>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                        </tr>
                                        <tr>
                                          <th style={tableborder.td} scope="row">Payment Of Statutory Dues</th>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                        </tr>
                                        <tr>
                                          <th style={tableborder.td} scope="row">Payment Of Loans</th>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                        </tr>
                                        <tr>
                                          <th style={tableborder.td} scope="row">Investment Made</th>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                        </tr>
                                        <tr>
                                          <th style={tableborder.td} scope="row">Total Payments (B)</th>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                        </tr>
                                        <tr>
                                          <th style={tableborder.td} scope="row">Closing Balance</th>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                          <td style={tableborder.td}><center>XX</center></td>
                                        </tr>
                                      </tbody>
                                    </table>

                                </Card>
                            </Col>
                            </Container>
                            </div>
            </React.Fragment>
        );
    }
}

export default ProvisinalCashflow;