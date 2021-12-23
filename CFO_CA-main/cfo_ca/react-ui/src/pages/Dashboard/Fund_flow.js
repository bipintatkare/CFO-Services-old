import React, { Component } from 'react';
import { Row, Col, Card,Collapse, CardBody, Button,Container, UncontrolledDropdown, UncontrolledTooltip, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { Link } from "react-router-dom";
import SearchFilter from "./SearchFilter"
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import LoadingComponent from './loadingComponent';


//Simple bar
import SimpleBar from "simplebar-react";


const tableborder = {
    td:{
            border:"1px solid black"
        },
    tdRight:{
            border:"1px solid black",
            textAlign: "right",
        },


        }
class Funds_flow extends Component {
    constructor(props) {
        super(props);
         this.state = {
            data:[],
            current_assets_tog: false,
            current_liablities_tog: false,
            cash_and_bank_balance: false,
            loading:true,

        }
    }

               load_companies = () => {
        const token = cookie.load("token")
        const csrf  = cookie.load("csrftoken")

        const lookups = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                 'Accept': 'application/json',
                "X-CSRFToken": csrf,
                "Authorization": `token ${token}`
            }
        }

        fetch("/api/v1/mis_ffsftp/"+`${this.props.match.params.id}`, lookups)
        .then(res => {
            if(res.status > 400){
                return console.log("Something went wrong")
            }
            return res.json()
        })
        .then(res => {
            console.log("response recruiter list", res)
            return this.setState({
            loading: false,
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
    const { current_assets_tog } = this.state
    const { current_liablities_tog } = this.state
    const { cash_and_bank_balance } = this.state

    const {data, loading} = this.state
    const data_received_ca = this.state.data[0]
        return (
            <React.Fragment>
             <div className="page-content">
             {loading ? <LoadingComponent /> :
                    <Container fluid>
            <SearchFilter/>
            <center>
                <h2 style={{marginTop:"2%"}}>Fund Flow Statement</h2>
            </center>

            {data!=null && data.length > 0? data.map((obj,index)=>{
                            return(

                            <Col style={{marginTop:"2%",marginLeft:"5%",marginBottom:"10%"}} xl="11">
                                <Card>

                            <table className="table table table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th scope="col" colspan="4">Statement Of Source & Application Of Funds</th>
                                </tr>
                              </thead>
                              <tbody>


                                     <tr>
                                <td  style={tableborder.td}>SOURCES</td>
                                <td  style={tableborder.td} rowspan="2"><center style={{marginTop:"10%"}}>As On 31st May 2019</center></td>
                                <td  style={tableborder.td}>APPLICATION</td>
                                <td  style={tableborder.td} rowspan="2"><center style={{marginTop:"10%"}}>As On 31st May 2019</center></td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}>Particulars</td>
                                <td  style={tableborder.td}>Particulars</td>
                              </tr>
                              <tr>
                                <td  style={tableborder.td}>Loans</td>
                                <td  style={tableborder.tdRight}>{data_received_ca.loans_val}</td>
                                <td  style={tableborder.td}>Capital Accounts</td>
                                <td  style={tableborder.tdRight}>{data_received_ca.capital_ac_val}</td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}>Net Profit</td>
                                <td  style={tableborder.tdRight}>{data_received_ca.net_profit_val}</td>
                                <td  style={tableborder.td}>Fixed Assets</td>
                                <td  style={tableborder.tdRight}>{data_received_ca.fixed_asset_val}</td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}></td>
                                <td  style={tableborder.td}></td>
                                <td  style={tableborder.td}>Increase In Working Capital</td>
                                <td  style={tableborder.tdRight}>N/A</td>
                              </tr>
                              <tr>
                                <td  style={tableborder.td}>Total Source Of Funds</td>
                                <td  style={tableborder.tdRight}>N/A</td>
                                <td  style={tableborder.td}>Total Application Of Funds</td>
                                <td  style={tableborder.tdRight}>N/A</td>
                              </tr>
                              </tbody>
                            </table>

                            </Card>
                            <Card>
                            <table className="table table table-bordered" style={{marginTop:"0%"}}>
                              <thead className="thead-dark">
                                <tr>
                                  <th scope="col">B.STATEMENT OF CHANGES IN WORKING CAPITAL</th>
                                  <th scope="col">Opening</th>
                                  <th scope="col">Closing</th>
                                  <th scope="col">Change Increase / Decrease</th>
                                </tr>
                              </thead>
                              <tbody>

                             <tr onClick={() => this.setState({ current_assets_tog: !current_assets_tog })}>
                              <td style={tableborder.td}> { current_assets_tog ? '-' : '+' } Current Assets:</td>
                              <td style={tableborder.tdRight}></td>
                              <td style={tableborder.tdRight}></td>
                              <td style={tableborder.tdRight}></td>
                            </tr>

                            {data_received_ca.current_assets!=null && data_received_ca.current_assets.length > 0? data_received_ca.current_assets.map((object,index)=>{
                            const diff= object.amt-object.opening_balance;
                            return(

                           current_assets_tog && (

                          <tr key={index}>
                            <td style={tableborder.td}>{object.name}</td>
                              <td style={tableborder.tdRight}>{object.opening_balance}</td>
                              <td style={tableborder.tdRight}>{object.amt}</td>
                              <td style={tableborder.tdRight}>{diff}</td>

                          </tr>
                          )
)
                })
                 :
                 current_assets_tog && (
                            <tr>
                            <td style={tableborder.td}>Inventory / Stock</td>
                            <td style={tableborder.td}>Value</td>

                            </tr>
                  )
                 }


                            <tr>
                              <th style={tableborder.td}>Total</th>
                              <th style={tableborder.tdRight}>0</th>
                             <td style={tableborder.tdRight}>{data_received_ca.current_assets_val}</td>
                             <td style={tableborder.tdRight}>{data_received_ca.current_assets_val}</td>
                            </tr>





                            <tr onClick={() => this.setState({ current_liablities_tog: !current_liablities_tog })}>
                              <td style={tableborder.td}> { current_liablities_tog ? '-' : '+' } Current Liabilites:</td>
                              <td style={tableborder.tdRight}></td>
                              <td style={tableborder.tdRight}></td>
                              <td style={tableborder.tdRight}></td>
                            </tr>


                                                    {data_received_ca.current_liablities!=null && data_received_ca.current_liablities.length > 0? data_received_ca.current_liablities.map((object,index)=>{
                                                       const diff= object.amt-object.opening_balance;

                            return(


                            current_liablities_tog && (


                          <tr key={index}>
                              <td style={tableborder.td}>{object.name}</td>
                              <td style={tableborder.tdRight}>{object.opening_balance}</td>
                              <td style={tableborder.tdRight}>{object.amt}</td>
                              <td style={tableborder.tdRight}>{diff}</td>
                            </tr>

                            )
)
                })
                 :
                  current_liablities_tog && (
                            <tr>
                              <td style={tableborder.td}>Cash And Bank Balances</td>
                              <td style={tableborder.td}>0</td>
                              <td style={tableborder.td}>{obj.bank_acc}</td>
                              <td style={tableborder.td}>{obj.bank_acc}</td>
                            </tr>
                            )
                 }



                            <tr>
                              <th style={tableborder.td}>Total</th>
                              <th style={tableborder.tdRight}>0</th>
                              <th style={tableborder.tdRight}>{data_received_ca.current_liablities_val}</th>
                              <th style={tableborder.tdRight}>{data_received_ca.current_liablities_val}</th>
                            </tr>

                            <tr>
                              <td style={tableborder.td}>Net Increase / (Decrease) In Working Capital</td>
                              <td style={tableborder.tdRight}>0</td>
                              <td style={tableborder.tdRight}>{obj.diff_in_assets}</td>
                              <td style={tableborder.tdRight}>{obj.diff_in_assets}</td>
                            </tr>

                              </tbody>
                            </table>

                                </Card>

                        <Card>
                        <table className="table table table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th scope="col" colspan="2">C. Funds From Operations</th>
                                </tr>
                              </thead>
                              <tbody>

                                                            <tr>
                                <td  style={tableborder.td}>Net Profit Before Tax, Prior Period Adjustment And Extra Ordinary Items</td>
                                <td  style={tableborder.tdRight}>N/A</td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}></td>
                                <td  style={tableborder.td}></td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}>Operating Profit</td>
                                <td  style={tableborder.tdRight}>N/A</td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}></td>
                                <td  style={tableborder.td}></td>
                              </tr>
                            <tr>
                              <td  style={tableborder.td}>Profit From Operating Activities</td>
                              <td  style={tableborder.tdRight}>N/A</td>
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

                              <thead className="thead-dark">
                                <tr>
                                  <th scope="col" colspan="4">Statement Of Source & Application Of Funds</th>
                                </tr>
                              </thead>
                                <table className="table table table-bordered">

                              <tbody style={{width: "100%"}}>


                                     <tr>
                                <td  style={tableborder.td}>SOURCES</td>
                                <td  style={tableborder.td} rowspan="2"><center style={{marginTop:"10%"}}>As On 31st May 2019</center></td>
                                <td  style={tableborder.td}>APPLICATION</td>
                                <td  style={tableborder.td} rowspan="2"><center style={{marginTop:"10%"}}>As On 31st May 2019 </center></td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}>Particulars</td>
                                <td  style={tableborder.td}>Particulars</td>
                              </tr>
                              <tr>
                                <td  style={tableborder.td}>Loans</td>
                                <td  style={tableborder.tdRight}>6526565</td>
                                <td  style={tableborder.td}>Capital Accounts</td>
                                <td  style={tableborder.tdRight}>662652</td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}>Net Profit</td>
                                <td  style={tableborder.tdRight}>8266265</td>
                                <td  style={tableborder.td}>Fixed Assets</td>
                                <td  style={tableborder.tdRight}>416165</td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}></td>
                                <td  style={tableborder.td}></td>
                                <td  style={tableborder.td}>Increase In Working Capital</td>
                                <td  style={tableborder.tdRight}>N/A</td>
                              </tr>
                              <tr>
                                <td  style={tableborder.td}>Total Source Of Funds</td>
                                <td  style={tableborder.tdRight}>N/A</td>
                                <td  style={tableborder.td}>Total Application Of Funds</td>
                                <td  style={tableborder.tdRight}>N/A</td>
                              </tr>
                              </tbody>
                              </table>
                            </table>

                            </Card>


                            <Card>

                            <table className="table table table-bordered" style={{marginTop:"0%"}}>
                              <thead className="thead-dark">
                                    <tr>
                                      <th scope="col">B.STATEMENT OF CHANGES IN WORKING CAPITAL</th>
                                      <th scope="col">Opening</th>
                                      <th scope="col">Closing</th>
                                      <th scope="col">Change Increase / Decrease</th>
                                    </tr>
                               </thead>
                               <tbody>

                                     <tr onClick={() => this.setState({ current_assets_tog: !current_assets_tog })}>
                                      <td style={tableborder.td}> { current_assets_tog ? '-' : '+' } Current Assets:</td>
                                      <td style={tableborder.tdRight}></td>
                                      <td style={tableborder.tdRight}></td>
                                      <td style={tableborder.tdRight}></td>
                                    </tr>
                                    </tbody>
                                      {current_assets_tog && (
                                       <tbody>
                                        <tr onClick={() => this.setState({ cash_and_bank_balance: !cash_and_bank_balance })}>
                                          <td style={tableborder.td}>{ cash_and_bank_balance ? '-' : '+' } Cash And Bank Balances</td>
                                          <td style={tableborder.tdRight}>0</td>
                                          <td style={tableborder.tdRight}>516182</td>
                                          <td style={tableborder.tdRight}>516182</td>
                                        </tr>

                                            { cash_and_bank_balance && (

                                                 <tr>
                                                  <td style={tableborder.td}> Dummy DATA</td>
                                                  <td style={tableborder.tdRight}> 32323</td>
                                                  <td style={tableborder.tdRight}> 34342</td>
                                                  <td style={tableborder.tdRight}> 2323</td>
                                                </tr>


                                            )}


                                    <tr>
                                      <td style={tableborder.td}>Inventories</td>
                                      <td style={tableborder.tdRight}>0</td>
                                      <td style={tableborder.tdRight}>516182</td>
                                      <td style={tableborder.tdRight}>516182</td>
                                    </tr>

                                    <tr>
                                      <td style={tableborder.td}>Trade And Other Receivables</td>
                                      <td style={tableborder.tdRight}>0</td>
                                      <td style={tableborder.tdRight}>516182</td>
                                      <td style={tableborder.tdRight}>516182</td>
                                    </tr>

                                    <tr>
                                      <td style={tableborder.td}>Loans And Advances</td>
                                      <td style={tableborder.tdRight}>0</td>
                                      <td style={tableborder.tdRight}>516182</td>
                                      <td style={tableborder.tdRight}>516182</td>
                                    </tr>

                                    <tr>
                                      <td style={tableborder.td}>Deposits</td>
                                      <td style={tableborder.tdRight}>0</td>
                                      <td style={tableborder.tdRight}>516182</td>
                                      <td style={tableborder.tdRight}>516182</td>
                                    </tr>

                                    <tr>
                                      <td style={tableborder.td}>Others Assets</td>
                                      <td style={tableborder.tdRight}>0</td>
                                      <td style={tableborder.tdRight}>516182</td>
                                      <td style={tableborder.tdRight}>516182</td>
                                    </tr>

                                       </tbody>
                                )}
                                 <tbody>



                                    <tr>
                                      <th style={tableborder.td}>Total</th>
                                      <th style={tableborder.tdRight}>0</th>
                                      <th style={tableborder.tdRight}>516182</th>
                                      <th style={tableborder.tdRight}>516182</th>
                                    </tr>


                                    <tr onClick={() => this.setState({ current_liablities_tog: !current_liablities_tog })}>
                                      <td style={tableborder.td}>{ current_liablities_tog ? '-' : '+' } Current Liabilites</td>
                                      <td style={tableborder.tdRight}>0</td>
                                      <td style={tableborder.tdRight}>516182</td>
                                      <td style={tableborder.tdRight}>516182</td>
                                    </tr>

                                    </tbody>
                                    { current_liablities_tog && (
                                       <tbody>

                                    <tr>
                                      <td style={tableborder.td}>Trade Payables</td>
                                      <td style={tableborder.tdRight}>0</td>
                                      <td style={tableborder.tdRight}>516182</td>
                                      <td style={tableborder.tdRight}>516182</td>
                                    </tr>

                                    <tr>
                                      <td style={tableborder.td}>Duties & Taxes</td>
                                      <td style={tableborder.tdRight}>0</td>
                                      <td style={tableborder.tdRight}>516182</td>
                                      <td style={tableborder.tdRight}>516182</td>
                                    </tr>

                                    <tr>
                                      <td style={tableborder.td}>Other Current Liabilities</td>
                                      <td style={tableborder.tdRight}>0</td>
                                      <td style={tableborder.tdRight}>0</td>
                                      <td style={tableborder.tdRight}>0</td>

                                    </tr>
                                        </tbody>
                                )}
                                <tbody>

                                    <tr>
                                      <th style={tableborder.td}>Total</th>
                                      <th style={tableborder.tdRight}>0</th>
                                      <th style={tableborder.tdRight}>516182</th>
                                      <th style={tableborder.tdRight}>516182</th>
                                    </tr>

                                    <tr>
                                      <td style={tableborder.td}>Net Increase / (Decrease) In Working Capital</td>
                                      <td style={tableborder.tdRight}>0</td>
                                      <td style={tableborder.tdRight}>516182</td>
                                      <td style={tableborder.tdRight}>516182</td>
                                    </tr>

                                  </tbody>
                              </table>

                                </Card>

                        <Card>
                        <table className="table table table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th scope="col" colspan="2">C. Funds From Operations</th>
                                </tr>
                              </thead>

                                <table className="table table table-bordered">
                              <tbody>

                                                            <tr>
                                <td  style={tableborder.td}>Net Profit Before Tax, Prior Period Adjustment And Extra Ordinary Items</td>
                                <td  style={tableborder.tdRight}>N/A</td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}></td>
                                <td  style={tableborder.td}></td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}>Operating Profit</td>
                                <td  style={tableborder.tdRight}>N/A</td>
                              </tr>

                              <tr>
                                <td  style={tableborder.td}></td>
                                <td  style={tableborder.td}></td>
                              </tr>
                            <tr>
                              <td  style={tableborder.td}>Profit From Operating Activities</td>
                              <td  style={tableborder.tdRight}>N/A</td>
                            </tr>
                              </tbody>
                              </table>
                            </table>

                                </Card>

                            </Col>
                            }

                            </Container> }

                            </div>
            </React.Fragment>
        );
    }
}

export default Funds_flow;