import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Button,Container, UncontrolledDropdown, UncontrolledTooltip, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { Link } from "react-router-dom";
import SearchFilter from "./SearchFilter"

//Simple bar
import SimpleBar from "simplebar-react";

const tableborder = {
    td:{
            border:"1px solid black" }
        }

class Tables extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
            <div className="page-content">
                    <Container fluid>
            <SearchFilter/>
            <center><h2 style={{marginTop:"2%"}}>Profit & Loss Account With Segmentation</h2></center>
                            <Col style={{marginTop:"2%",marginLeft:"5%",marginBottom:"10%"}} xl="11">
                                <Card>
                                <table className="table">
                                  <thead className="thead-dark">
                                    <tr>
                                      <th scope="col"><center>Details</center></th>
                                      <th scope="col"><center>Segment 1</center></th>
                                      <th scope="col"><center>Segment 2 </center></th>
                                      <th scope="col"><center>Segment 3</center></th>
                                      <th scope="col"><center>Total</center></th>
                                    </tr>
                                  </thead>
                                  <tbody>

                                    <tr>
                                      <th style={tableborder.td} scope="row">Sales</th>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                    </tr>
                                        <tr>
                                      <th style={tableborder.td} scope="row">High Sea Sales</th>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                    </tr>

                                        <tr>
                                      <th style={tableborder.td} scope="row">Service Sale</th>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                    </tr>


                                        <tr>
                                      <th style={tableborder.td} scope="row">COGS (B)=(a+b-c)</th>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                    </tr>

                                        <tr>
                                      <th style={tableborder.td} scope="row">Opening Stock (a)</th>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                    </tr>

                                        <tr>
                                      <th style={tableborder.td} scope="row">+ Purchases (b)</th>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                    </tr>

                                        <tr>
                                      <th style={tableborder.td} scope="row">- Closing Stock (c)</th>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                    </tr>

                                        <tr>
                                      <th style={tableborder.td} scope="row">XX</th>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                    </tr>
                                        <tr>
                                      <th style={tableborder.td} scope="row">Sales (A)</th>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                    </tr>

                                        <tr>
                                      <th style={tableborder.td} scope="row">GROSS Profits (C=A-B)</th>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                    </tr>

                                        <tr>
                                      <th style={tableborder.td} scope="row">GROSS G.P. (%)</th>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                    </tr>

                                        <tr>
                                      <th style={tableborder.td} scope="row">Indirect Expenses (D)</th>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                    </tr>

                                        <tr>
                                      <th style={tableborder.td} scope="row">Salaries</th>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                    </tr>

                                        <tr>
                                      <th style={tableborder.td} scope="row">Admin Expenses</th>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                    </tr>

                                        <tr>
                                      <th style={tableborder.td} scope="row">Interest Expenses</th>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                    </tr>
                                        <tr>
                                      <th style={tableborder.td} scope="row">Net Profit (C-D)</th>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                      <td style={tableborder.td}><center>XX</center></td>
                                    </tr>
                                        <tr>
                                      <th style={tableborder.td} scope="row">Net G.P. (%)</th>
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

export default Tables;