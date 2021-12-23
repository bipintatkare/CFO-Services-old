import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Button, UncontrolledDropdown, UncontrolledTooltip, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { Link } from "react-router-dom";

//Simple bar
import SimpleBar from "simplebar-react";

const tableborder = {
    td:{
            border:"1px solid black" }
        }

class Trailbalance extends Component {
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
            <center>


            <h2 style={{marginTop:"10%"}}>Provisional Cashflow for the period</h2></center>
            <br/>
            <button style={{marginLeft:"6%",marginBottom:"2%"}} type="button" class="btn btn-success">Total Mapped: 0</button> <button style={{marginLeft:"1%",marginBottom:"2%"}} type="button" class="btn  btn-info">Remaining: 242</button>

                            <Col style={{marginTop:"0%",marginLeft:"5%",marginBottom:"10%"}} xl="11">
                                <Card>
                                    <table className="table">
                                      <thead className="thead-dark">
                                        <tr>
                                          <th scope="col"><center>Sr No.</center></th>
                                          <th scope="col"><center>Description</center></th>
                                          <th scope="col"><center>Final</center></th>
                                          <th scope="col"><center>Primary Mapping</center></th>
                                          <th scope="col"><center>Parent Mapping</center></th>
                                        </tr>
                                      </thead>
                                      <tbody>

                                        <tr>
                                        <th style={tableborder.td} scope="row"><center>1</center></th>
                                        <td style={tableborder.td}><center>Adbul Quddoos</center></td>
                                        <td style={tableborder.td}><center>22500.0</center></td>
                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        </tr>

                                        <tr>
                                        <th style={tableborder.td} scope="row"><center>2</center></th>
                                        <td style={tableborder.td}><center>Accrued Interest on FD</center></td>
                                        <td style={tableborder.td}><center>22500.0</center></td>
                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        </tr>
                                        <tr>
                                        <th style={tableborder.td} scope="row"><center>3</center></th>
                                        <td style={tableborder.td}><center>A.D Kirtane</center></td>
                                        <td style={tableborder.td}><center>22500.0</center></td>
                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        </tr>
                                        <tr>
                                        <th style={tableborder.td} scope="row"><center>4</center></th>
                                        <td style={tableborder.td}><center>Tanmay</center></td>
                                        <td style={tableborder.td}><center>22500.0</center></td>
                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        </tr>
                                        <tr>
                                        <th style={tableborder.td} scope="row"><center>5</center></th>
                                        <td style={tableborder.td}><center>Harsh</center></td>
                                        <td style={tableborder.td}><center>22500.0</center></td>
                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        </tr>
                                        <tr>
                                        <th style={tableborder.td} scope="row"><center>6</center></th>
                                        <td style={tableborder.td}><center>Vikas</center></td>
                                        <td style={tableborder.td}><center>22500.0</center></td>
                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        </tr>
                                        <tr>
                                        <th style={tableborder.td} scope="row"><center>7</center></th>
                                        <td style={tableborder.td}><center>Kamlesh</center></td>
                                        <td style={tableborder.td}><center>22500.0</center></td>
                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        </tr>
                                        <tr>
                                        <th style={tableborder.td} scope="row"><center>8</center></th>
                                        <td style={tableborder.td}><center>Mike</center></td>
                                        <td style={tableborder.td}><center>22500.0</center></td>
                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        </tr>
                                        <tr>
                                        <th style={tableborder.td} scope="row"><center>9</center></th>
                                        <td style={tableborder.td}><center>Tyson</center></td>
                                        <td style={tableborder.td}><center>22500.0</center></td>
                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        </tr>
                                        <tr>
                                        <th style={tableborder.td} scope="row"><center>10</center></th>
                                        <td style={tableborder.td}><center>Hemant</center></td>
                                        <td style={tableborder.td}><center>22500.0</center></td>
                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        </tr>
                                        <tr>
                                        <th style={tableborder.td} scope="row"><center>11</center></th>
                                        <td style={tableborder.td}><center>Rahul</center></td>
                                        <td style={tableborder.td}><center>22500.0</center></td>
                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        </tr>
                                        <tr>
                                        <th style={tableborder.td} scope="row"><center>12</center></th>
                                        <td style={tableborder.td}><center>Ankush</center></td>
                                        <td style={tableborder.td}><center>22500.0</center></td>
                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        </tr>
                                        <tr>
                                        <th style={tableborder.td} scope="row"><center>13</center></th>
                                        <td style={tableborder.td}><center>Anush</center></td>
                                        <td style={tableborder.td}><center>22500.0</center></td>
                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>

                                        <td style={tableborder.td}><center>Sunny Creditors <Button style={{height:"auto",fontSize: "10px"}}><center><i class="fa fa-pencil-square-o" aria-hidden="true" style={{marginTop:"0px"}}></i></center></Button></center></td>
                                        </tr>
                                      </tbody>
                                    </table>

                                </Card>
                            </Col>
            </React.Fragment>
        );
    }
}

export default Trailbalance;