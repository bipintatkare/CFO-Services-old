import React, { Component } from 'react';
import { Row, Col, Card,Collapse, CardBody, Button,Container, UncontrolledDropdown, UncontrolledTooltip, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { Link } from "react-router-dom";
import SearchFilter from "./SearchFilter"
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';


//Simple bar
import SimpleBar from "simplebar-react";


const tableborder = {
    td:{
            border:"1px solid black" }
        }
class Funds_flow extends Component {
    constructor(props) {
        super(props);
         this.state = {
                 showDiv: true,

data:[],
col1: true,
col2: true,
col3: true,
current_assets_tog: false,
current_liablities_tog: false,
        }
        this.t_col1 = this.t_col1.bind(this);
        this.t_col2 = this.t_col2.bind(this);
        this.t_col3 = this.t_col3.bind(this);
        this.t_current_assets_tog = this.t_current_assets_tog.bind(this);
        this.t_current_liablities_tog = this.t_current_liablities_tog.bind(this);
    }

    t_col1() {
		this.setState({ col1: !this.state.col1 });
	}

	    t_col2() {
		this.setState({ col2: !this.state.col2 });
	}

	    t_col3() {
		this.setState({ col3: !this.state.col3 });
	}
	    t_current_assets_tog() {
		this.setState({ current_assets_tog: !this.state.current_assets_tog });
	}
	    t_current_liablities_tog() {
		this.setState({ current_liablities_tog: !this.state.current_liablities_tog });
	}

               load_companies = () => {
//        const token = cookie.load("token")
//        const csrf  = cookie.load("csrftoken")

        const lookups = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                 'Accept': 'application/json'
//                "X-CSRFToken": csrf,
//                "Authorization": `token ${token}`
            }
        }

        fetch("1/api/v1/mis_ffsftp/"+`${this.props.company_id}`, lookups)
        .then(res => {
            if(res.status > 400){
                return console.log("Something went wrong")
            }
            return res.json()
        })
        .then(res => {
            console.log("response recruiter list", res)
            return this.setState({
                data : res
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

        componentDidMount(){
        this.load_companies()
    }

    render() {
            const { showDiv } = this.state

    const {data} = this.state
    const data_received_ca = this.state.data
        return (
            <React.Fragment>
             <div className="page-content">
                    <Container fluid>
            <SearchFilter/>
            <center><h2 style={{marginTop:"2%"}}>Fund Flow Statement</h2></center>
             <div>
                <button onClick={() => this.setState({ showDiv: !showDiv })}>
                    { showDiv ? 'hide' : 'show' }
                </button>
                { showDiv && (
                    <div id="the div you want to show and hide">Peek a boo</div>
                )}
            </div>

            {data!=null && data.length > 0? data.map((obj,index)=>{
                            return(

                            <Col style={{marginTop:"2%",marginLeft:"5%",marginBottom:"10%"}} xl="11">
                                <Card>
                            <table className="table table table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th scope="col" colspan="4"><center>Statement Of Source & Application Of Funds</center></th>
                                </tr>
                              </thead>
                              <tbody>


                                     <tr>
                                <td  style={tableborder.td}><center>SOURCES</center></td>
                                <td  style={tableborder.td} rowspan="2"><center style={{marginTop:"10%"}}>As On 31st May 2019</center></td>
                                <td  style={tableborder.td}><center>APPLICATION</center></td>
                                <td  style={tableborder.td} rowspan="2"><center style={{marginTop:"10%"}}>As On 31st May 2019</center></td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}><center>Particulars</center></td>
                                <td  style={tableborder.td}><center>Particulars</center></td>
                              </tr>
                              <tr>
                                <td  style={tableborder.td}><center>Loans</center></td>
                                <td  style={tableborder.td}><center>{data_received_ca.loans_val}</center></td>
                                <td  style={tableborder.td}><center>Capital Accounts</center></td>
                                <td  style={tableborder.td}><center>{data_received_ca.capital_ac_val}</center></td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}><center>Net Profit</center></td>
                                <td  style={tableborder.td}><center>{data_received_ca.net_profit_val}</center></td>
                                <td  style={tableborder.td}><center>Fixed Assets</center></td>
                                <td  style={tableborder.td}><center>{data_received_ca.fixed_asset_val}</center></td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}><center></center></td>
                                <td  style={tableborder.td}><center></center></td>
                                <td  style={tableborder.td}><center>Increase In Working Capital</center></td>
                                <td  style={tableborder.td}><center>N/A</center></td>
                              </tr>
                              <tr>
                                <td  style={tableborder.td}><center>Total Source Of Funds</center></td>
                                <td  style={tableborder.td}><center>N/A</center></td>
                                <td  style={tableborder.td}><center>Total Application Of Funds</center></td>
                                <td  style={tableborder.td}><center>N/A</center></td>
                              </tr>
                              </tbody>
                            </table>

                            </Card>
                            <Card>
                            <table className="table table table-bordered" style={{marginTop:"0%"}}>
                              <thead className="thead-dark">
                                <tr>
                                  <th scope="col"><center>B.STATEMENT OF CHANGES IN WORKING CAPITAL</center></th>
                                  <th scope="col"><center>Opening</center></th>
                                  <th scope="col"><center>Closing</center></th>
                                  <th scope="col"><center>Change Increase / Decrease</center></th>
                                </tr>
                              </thead>
                              <tbody>

                             <tr>
                              <td style={tableborder.td}><center>Current Assets:</center></td>
                              <td style={tableborder.td}><center></center></td>
                              <td style={tableborder.td}><center></center></td>
                              <td style={tableborder.td}><center></center></td>
                            </tr>

                            {data_received_ca.current_assets!=null && data_received_ca.current_assets.length > 0? data_received_ca.current_assets.map((object,index)=>{
                            const diff= object.amt-object.opening_balance;
                            return(

                          <tr key={index}>
                            <td style={tableborder.td}><center>{object.name}</center></td>
                              <td style={tableborder.td}><center>{object.opening_balance}</center></td>
                              <td style={tableborder.td}><center>{object.amt}</center></td>
                              <td style={tableborder.td}><center>{diff}</center></td>

                          </tr>
)
                })
                 :
                 <tr>
                            <td style={tableborder.td}><center>Inventory / Stock</center></td>
                            <td style={tableborder.td}><center>Value</center></td>

                          </tr>
                 }


                            <tr>
                              <th style={tableborder.td}><center>Total</center></th>
                              <th style={tableborder.td}><center>0</center></th>
                             <td style={tableborder.td}><center>{data_received_ca.current_assets_val}</center></td>
                             <td style={tableborder.td}><center>{data_received_ca.current_assets_val}</center></td>
                            </tr>





                            <tr>
                              <td style={tableborder.td}><center>Current Liabilites:</center></td>
                              <td style={tableborder.td}><center></center></td>
                              <td style={tableborder.td}><center></center></td>
                              <td style={tableborder.td}><center></center></td>
                            </tr>


                                                    {data_received_ca.current_liablities!=null && data_received_ca.current_liablities.length > 0? data_received_ca.current_liablities.map((object,index)=>{
                                                       const diff= object.amt-object.opening_balance;

                            return(


                          <tr key={index}>
                              <td style={tableborder.td}><center>{object.name}</center></td>
                              <td style={tableborder.td}><center>{object.opening_balance}</center></td>
                              <td style={tableborder.td}><center>{object.amt}</center></td>
                              <td style={tableborder.td}><center>{diff}</center></td>
                            </tr>
)
                })
                 :
                <tr>
                              <td style={tableborder.td}><center>Cash And Bank Balances</center></td>
                              <td style={tableborder.td}><center>0</center></td>
                              <td style={tableborder.td}><center>{obj.bank_acc}</center></td>
                              <td style={tableborder.td}><center>{obj.bank_acc}</center></td>
                            </tr>
                 }



                            <tr>
                              <th style={tableborder.td}><center>Total</center></th>
                              <th style={tableborder.td}><center>0</center></th>
                              <th style={tableborder.td}><center>{data_received_ca.current_liablities_val}</center></th>
                              <th style={tableborder.td}><center>{data_received_ca.current_liablities_val}</center></th>
                            </tr>

                            <tr>
                              <td style={tableborder.td}><center>Net Increase / (Decrease) In Working Capital</center></td>
                              <td style={tableborder.td}><center>0</center></td>
                              <td style={tableborder.td}><center>{obj.diff_in_assets}</center></td>
                              <td style={tableborder.td}><center>{obj.diff_in_assets}</center></td>
                            </tr>

                              </tbody>
                            </table>

                                </Card>

                        <Card>
                        <table className="table table table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th scope="col" colspan="2"><center>C. Funds From Operations</center></th>
                                </tr>
                              </thead>
                              <tbody>

                                                            <tr>
                                <td  style={tableborder.td}><center>Net Profit Before Tax, Prior Period Adjustment And Extra Ordinary Items</center></td>
                                <td  style={tableborder.td}><center>N/A</center></td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}><center></center></td>
                                <td  style={tableborder.td}><center></center></td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}><center>Operating Profit</center></td>
                                <td  style={tableborder.td}><center>N/A</center></td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}><center></center></td>
                                <td  style={tableborder.td}><center></center></td>
                              </tr>
                            <tr>
                              <td  style={tableborder.td}><center>Profit From Operating Activities</center></td>
                              <td  style={tableborder.td}><center>N/A</center></td>
                            </tr>
                              </tbody>
                            </table>

                                </Card>

                            </Col>

                                      )
                })
                 :
                  <Col style={{marginTop:"2%",marginLeft:"5%",marginBottom:"10%"}} xl="11">
                                <Card>

                            <table className="table table table-bordered">

                              <thead className="thead-dark" onClick={this.t_col1}>
                                <tr>
                                  <th scope="col" colspan="4"><center>Statement Of Source & Application Of Funds</center></th>
                                </tr>
                              </thead>
                              <Collapse isOpen={this.state.col1}>
                                <table className="table table table-bordered">

                              <tbody style={{width: "100%"}}>


                                     <tr>
                                <td  style={tableborder.td}><center>SOURCES</center></td>
                                <td  style={tableborder.td} rowspan="2"><center style={{marginTop:"10%"}}>As On 31st May 2019</center></td>
                                <td  style={tableborder.td}><center>APPLICATION</center></td>
                                <td  style={tableborder.td} rowspan="2"><center style={{marginTop:"10%"}}>As On 31st May 2019</center></td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}><center>Particulars</center></td>
                                <td  style={tableborder.td}><center>Particulars</center></td>
                              </tr>
                              <tr>
                                <td  style={tableborder.td}><center>Loans</center></td>
                                <td  style={tableborder.td}><center>6526565</center></td>
                                <td  style={tableborder.td}><center>Capital Accounts</center></td>
                                <td  style={tableborder.td}><center>662652</center></td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}><center>Net Profit</center></td>
                                <td  style={tableborder.td}><center>8266265</center></td>
                                <td  style={tableborder.td}><center>Fixed Assets</center></td>
                                <td  style={tableborder.td}><center>416165</center></td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}><center></center></td>
                                <td  style={tableborder.td}><center></center></td>
                                <td  style={tableborder.td}><center>Increase In Working Capital</center></td>
                                <td  style={tableborder.td}><center>N/A</center></td>
                              </tr>
                              <tr>
                                <td  style={tableborder.td}><center>Total Source Of Funds</center></td>
                                <td  style={tableborder.td}><center>N/A</center></td>
                                <td  style={tableborder.td}><center>Total Application Of Funds</center></td>
                                <td  style={tableborder.td}><center>N/A</center></td>
                              </tr>
                              </tbody>
                              </table>
                              </Collapse>
                            </table>

                            </Card>
                            <Card>
                            <table className="table table table-bordered" style={{marginTop:"0%"}}>
                              <thead className="thead-dark" onClick={this.t_col2} >
                                <tr>
                                  <th scope="col"><center>B.STATEMENT OF CHANGES IN WORKING CAPITAL</center></th>
                                  <th scope="col"><center>Opening</center></th>
                                  <th scope="col"><center>Closing</center></th>
                                  <th scope="col"><center>Change Increase / Decrease</center></th>
                                </tr>
                              </thead>
                              </table>

                                <Collapse isOpen={this.state.col2}>
                                        <table className="table table table-bordered">
                                            <thead className="thead-dark" onClick={this.t_col2} style={{visibility: "collapse"}}>
                                                <tr>
                                                  <th scope="col"><center>B.STATEMENT OF CHANGES IN WORKING CAPITAL</center></th>
                                                  <th scope="col"><center>Opening</center></th>
                                                  <th scope="col"><center>Closing</center></th>
                                                  <th scope="col"><center>Change Increase / Decrease</center></th>
                                                </tr>
                                              </thead>

                                                 <tr  onClick={this.t_current_assets_tog} >
                                                  <td style={tableborder.td}><center>Current Assets:</center></td>
                                                  <td style={tableborder.td}><center></center></td>
                                                  <td style={tableborder.td}><center></center></td>
                                                  <td style={tableborder.td}><center></center></td>
                                                </tr>
                                        </table>

                                        <Collapse isOpen={this.state.current_assets_tog}>
                                            <table className="table table table-bordered">
                                                 <thead className="thead-dark" style={{visibility: "collapse"}}>
                                                    <tr>
                                                      <th scope="col"><center>B.STATEMENT OF CHANGES IN WORKING CAPITAL</center></th>
                                                      <th scope="col"><center>Opening</center></th>
                                                      <th scope="col"><center>Closing</center></th>
                                                      <th scope="col"><center>Change Increase / Decrease</center></th>
                                                    </tr>
                                              </thead>
                                                <tbody>
                                                    <tr>
                                                      <td style={tableborder.td}><center>Cash And Bank Balances</center></td>
                                                      <td style={tableborder.td}><center>0</center></td>
                                                      <td style={tableborder.td}><center>516182</center></td>
                                                      <td style={tableborder.td}><center>516182</center></td>
                                                    </tr>

                                                    <tr>
                                                      <td style={tableborder.td}><center>Inventories</center></td>
                                                      <td style={tableborder.td}><center>0</center></td>
                                                      <td style={tableborder.td}><center>516182</center></td>
                                                      <td style={tableborder.td}><center>516182</center></td>
                                                    </tr>

                                                    <tr>
                                                      <td style={tableborder.td}><center>Trade And Other Receivables</center></td>
                                                      <td style={tableborder.td}><center>0</center></td>
                                                      <td style={tableborder.td}><center>516182</center></td>
                                                      <td style={tableborder.td}><center>516182</center></td>
                                                    </tr>

                                                    <tr>
                                                      <td style={tableborder.td}><center>Loans And Advances</center></td>
                                                      <td style={tableborder.td}><center>0</center></td>
                                                      <td style={tableborder.td}><center>516182</center></td>
                                                      <td style={tableborder.td}><center>516182</center></td>
                                                    </tr>

                                                    <tr>
                                                      <td style={tableborder.td}><center>Deposits</center></td>
                                                      <td style={tableborder.td}><center>0</center></td>
                                                      <td style={tableborder.td}><center>516182</center></td>
                                                      <td style={tableborder.td}><center>516182</center></td>
                                                    </tr>

                                                    <tr>
                                                      <td style={tableborder.td}><center>Others Assets</center></td>
                                                      <td style={tableborder.td}><center>0</center></td>
                                                      <td style={tableborder.td}><center>516182</center></td>
                                                      <td style={tableborder.td}><center>516182</center></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Collapse>

                                        <table className="table table table-bordered">
                                            <thead className="thead-dark" style={{visibility: "collapse"}}>
                                            <tr>
                                              <th scope="col"><center>B.STATEMENT OF CHANGES IN WORKING CAPITAL</center></th>
                                              <th scope="col"><center>Opening</center></th>
                                              <th scope="col"><center>Closing</center></th>
                                              <th scope="col"><center>Change Increase / Decrease</center></th>
                                            </tr>
                                             </thead>

                                            <tbody>

                                                <tr>
                                                  <th style={tableborder.td}><center>Total</center></th>
                                                  <th style={tableborder.td}><center>0</center></th>
                                                  <th style={tableborder.td}><center>516182</center></th>
                                                  <th style={tableborder.td}><center>516182</center></th>
                                                </tr>
                                             </tbody>
                                         </table>
                                         <table className="table table table-bordered">
                                                <thead className="thead-dark" style={{visibility: "collapse"}}>
                                                    <tr>
                                                      <th scope="col"><center>B.STATEMENT OF CHANGES IN WORKING CAPITAL</center></th>
                                                      <th scope="col"><center>Opening</center></th>
                                                      <th scope="col"><center>Closing</center></th>
                                                      <th scope="col"><center>Change Increase / Decrease</center></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr onClick={this.t_current_liablities_tog}>
                                                      <td style={tableborder.td}><center>Current Liabilites</center></td>
                                                      <td style={tableborder.td}><center>0</center></td>
                                                      <td style={tableborder.td}><center>516182</center></td>
                                                      <td style={tableborder.td}><center>516182</center></td>
                                                    </tr>
                                                </tbody>
                                         </table>

                                        <Collapse isOpen={this.state.current_liablities_tog}>
                                            <table className="table table table-bordered">
                                                 <thead className="thead-dark" style={{visibility: "collapse"}}>
                                                        <tr>
                                                          <th scope="col"><center>B.STATEMENT OF CHANGES IN WORKING CAPITAL</center></th>
                                                          <th scope="col"><center>Opening</center></th>
                                                          <th scope="col"><center>Closing</center></th>
                                                          <th scope="col"><center>Change Increase / Decrease</center></th>
                                                        </tr>
                                                 </thead>
                                                 <tbody>

                                                        <tr>
                                                          <td style={tableborder.td}><center>Trade Payables</center></td>
                                                          <td style={tableborder.td}><center>0</center></td>
                                                          <td style={tableborder.td}><center>516182</center></td>
                                                          <td style={tableborder.td}><center>516182</center></td>
                                                        </tr>

                                                        <tr>
                                                          <td style={tableborder.td}><center>Duties & Taxes</center></td>
                                                          <td style={tableborder.td}><center>0</center></td>
                                                          <td style={tableborder.td}><center>516182</center></td>
                                                          <td style={tableborder.td}><center>516182</center></td>
                                                        </tr>

                                                        <tr>
                                                          <td style={tableborder.td}><center>Other Current Liabilities</center></td>
                                                          <td style={tableborder.td}><center>0</center></td>
                                                          <td style={tableborder.td}><center>0</center></td>
                                                          <td style={tableborder.td}><center>0</center></td>

                                                        </tr>
                                                     </tbody>
                                                 </table>

                                                        </Collapse>

                                            <table className="table table table-bordered">
                                                 <thead className="thead-dark" style={{visibility: "collapse"}}>
                                                        <tr>
                                                          <th scope="col"><center>B.STATEMENT OF CHANGES IN WORKING CAPITAL</center></th>
                                                          <th scope="col"><center>Opening</center></th>
                                                          <th scope="col"><center>Closing</center></th>
                                                          <th scope="col"><center>Change Increase / Decrease</center></th>
                                                        </tr>
                                                 </thead>
                                                 <tbody>

                                                        <tr>
                                                          <th style={tableborder.td}><center>Total</center></th>
                                                          <th style={tableborder.td}><center>0</center></th>
                                                          <th style={tableborder.td}><center>516182</center></th>
                                                          <th style={tableborder.td}><center>516182</center></th>
                                                        </tr>

                                                        <tr>
                                                          <td style={tableborder.td}><center>Net Increase / (Decrease) In Working Capital</center></td>
                                                          <td style={tableborder.td}><center>0</center></td>
                                                          <td style={tableborder.td}><center>516182</center></td>
                                                          <td style={tableborder.td}><center>516182</center></td>
                                                        </tr>

                                                  </tbody>
                                              </table>

                              </Collapse>

                                </Card>

                        <Card>
                        <table className="table table table-bordered">
                              <thead className="thead-dark" onClick={this.t_col3}>
                                <tr>
                                  <th scope="col" colspan="2"><center>C. Funds From Operations</center></th>
                                </tr>
                              </thead>
                              <Collapse isOpen={this.state.col3}>
                                <table className="table table table-bordered">
                              <tbody>

                                                            <tr>
                                <td  style={tableborder.td}><center>Net Profit Before Tax, Prior Period Adjustment And Extra Ordinary Items</center></td>
                                <td  style={tableborder.td}><center>N/A</center></td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}><center></center></td>
                                <td  style={tableborder.td}><center></center></td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}><center>Operating Profit</center></td>
                                <td  style={tableborder.td}><center>N/A</center></td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}><center></center></td>
                                <td  style={tableborder.td}><center></center></td>
                              </tr>
                            <tr>
                              <td  style={tableborder.td}><center>Profit From Operating Activities</center></td>
                              <td  style={tableborder.td}><center>N/A</center></td>
                            </tr>
                              </tbody>
                              </table>
                              </Collapse>
                            </table>

                                </Card>

                            </Col>
                            }

                            </Container>
                            </div>
            </React.Fragment>
        );
    }
}

export default Funds_flow;