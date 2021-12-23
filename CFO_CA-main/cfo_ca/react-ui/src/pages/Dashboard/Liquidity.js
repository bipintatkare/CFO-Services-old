import React, { Component } from 'react';
import { Row, Col, Card, CardBody,Container, Button, UncontrolledDropdown, UncontrolledTooltip, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { Link } from "react-router-dom";
import "./table_border.css";
import SearchFilter from "./SearchFilter2"
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


class Liquidity extends Component {
    constructor(props) {
        super(props);
        this.state = {
        total_current_assets: false,
        total_current_liablities: false,
        net_liquid_funds: false,
        taxes_and_expense_payable: false,
        loading:true,
company_id : "",
            data_received : [],
 from_date:"",
            to_date:"",
        }
    }

            load_details_date_range = (from_date,to_date) => {
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

        fetch("/api/v1/mis_fdbo/"+`${this.props.match.params.id}`+"?from_date="+`${from_date}`+"&to_date="+`${to_date}`, lookups)
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
                data_received : res
            })
        })
        .catch(err => {
            console.log(err)
        })
    }


        load_details = () => {
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

        fetch("/api/v1/mis_lbob/"+`${this.props.match.params.id}`, lookups)
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
                data_received : res
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

          componentDidMount(){
        this.load_details()
    }

     handleParentData = (e,f) => {
     if (f==null){
     console.log("e")
     console.log(e)
     this.setState({
company_id: e,
})

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
        console.log("{this.state.company_id}")

        fetch(process.env.REACT_APP_BASEURL_BACKEND+"/api/v1/mis_lbob/"+`${e}`, lookups)
//              fetch("/api/v1/mis_lbob/"+`${e}`, lookups)
        .then(res => {
            if(res.status > 400){
                return console.log("Something went wrong")
            }
            return res.json()
        })
        .then(res => {
            console.log("response recruiter list", res)
            return this.setState({
                data_received : res
            })
        })
        .catch(err => {
            console.log(err)
        })
     }else{
     this.setState({
from_date: e,
to_date: f,
})

this.load_details_date_range(e,f);
     }

  }

    render() {
    const { total_current_assets } = this.state
    const { total_current_liablities } = this.state
    const { net_liquid_funds } = this.state
    const { taxes_and_expense_payable } = this.state

    const {data_received,loading} = this.state
    const data_received_ca = this.state.data_received[0]

        return (
            <React.Fragment>
  <div className="page-content">
  {loading ? <LoadingComponent /> :
                    <Container fluid>
           <SearchFilter mis_id="2" company_id ={this.props.match.params.id} handleData={this.handleParentData} />
            <center>
             <h2 style={{marginTop:"2%"}}>Liquidity Barometer Of Business</h2>
            </center>
            {data_received!=null && data_received.length > 0? data_received.map((Item,index)=>{
                            return(


                            <Col key={index} style={{marginTop:"2%",marginLeft:"5%",marginBottom:"10%"}} xl="11">
                                <Card>
                            <table className="table table table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th scope="col">Particulars</th>
                                  <th scope="col">Amounts</th>
                                </tr>
                              </thead>
                              <tbody>

                              <tr onClick={() => this.setState({ total_current_assets: !total_current_assets })}>
                            <th style={tableborder.td}>{ total_current_assets ? '-' : '+' }Total Current Assets (A)</th>
                                <th style={tableborder.tdRight}>{data_received_ca.current_assets_val}</th>

                          </tr>

{data_received_ca.current_assets!=null && data_received_ca.current_assets.length > 0? data_received_ca.current_assets.map((object,index)=>{
                            return(
                            total_current_assets && (
                          <tr key={index}>
                            <td style={tableborder.td}>{object.name}</td>
                            <td style={tableborder.tdRight}>{object.amt}</td>

                          </tr>
                          )
)
                })
                 :
                 <tr>
                            <td style={tableborder.td}>Inventory / Stock</td>
                            <td style={tableborder.tdRight}>Value</td>

                          </tr>
                 }




                           <tr onClick={() => this.setState({ total_current_liablities: !total_current_liablities })}>
                            <th style={tableborder.td}>{ total_current_liablities ? '-' : '+' }Total Current Liabilities (B)</th>
                                <th style={tableborder.tdRight}> {data_received_ca.current_liablities_val}</th>

                          </tr>


                          {data_received_ca.current_liablities!=null && data_received_ca.current_liablities.length > 0? data_received_ca.current_liablities.map((object,index)=>{
                            return(
                            total_current_liablities && (
                          <tr key={index}>
                            <td style={tableborder.td}>{object.name}</td>
                            <td style={tableborder.tdRight}>{object.amt}</td>

                          </tr>
                          )
)
                })
                 :

                          <tr>
                            <td style={tableborder.td}>Inventory / Stock</td>
                            <td style={tableborder.tdRight}>Value</td>

                          </tr>

                 }



                          <tr>
                            <td style={tableborder.td}></td>
                            <td style={tableborder.tdRight}></td>
                          </tr>


                          <tr onClick={() => this.setState({ net_liquid_funds: !net_liquid_funds })}>
                            <th style={tableborder.td}> Net Liquid Funds (A-B)</th>
                            <th style={tableborder.tdRight}>{Item.a_b_value}</th>
                          </tr>

                          <tr>
                            <td style={tableborder.td}></td>
                            <td style={tableborder.tdRight}></td>
                          </tr>


                          <tr>
                            <td style={tableborder.td}> Less: Bank Overdraft Utilized</td>
                                <td style={tableborder.tdRight}>{Item.od_ac_value}</td>

                          </tr>

                          <tr>
                            <td style={tableborder.td}></td>
                            <td style={tableborder.tdRight}></td>
                          </tr>

                          <tr>
                            <td style={tableborder.td}> Less: Bank Open Cash Credit Utilized</td>
                                <td style={tableborder.tdRight}>{Item.occ_ac_value}</td>

                          </tr>

                          <tr>
                            <td style={tableborder.td}></td>
                            <td style={tableborder.tdRight}></td>
                          </tr>

                          <tr>
                            <th style={tableborder.td}>Net Liquidity In Company</th>
                                <th style={tableborder.tdRight}>{Item.a_b_value_final}</th>
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
                                  <th scope="col"><center> Particulars </center></th>
                                  <th scope="col"><center> Amounts </center></th>
                                </tr>
                              </thead>
                              <tbody>

                          <tr>
                            <td style={tableborder.td}></td>
                            <td style={tableborder.tdRight}></td>
                          </tr>

                          <tr>
                            <td style={tableborder.td}>Inventory / Stock</td>
                            <td style={tableborder.tdRight}>125574444</td>

                          </tr>

                          <tr>
                            <td style={tableborder.td}> Debtors / Accounts Receivable</td>
                            <td style={tableborder.tdRight}>125574444</td>

                          </tr>

                          <tr>
                            <td style={tableborder.td}>Bank / Cash In Hand</td>
                            <td style={tableborder.tdRight}>125574444</td>
                          </tr>

                          <tr>
                            <td style={tableborder.td}></td>
                            <td style={tableborder.tdRight}></td>
                          </tr>

                          <tr onClick={() => this.setState({ total_current_assets: !total_current_assets })}>
                            <th style={tableborder.td}> { total_current_assets ? '-' : '+' }Total Current Assets (A)</th>
                                <th style={tableborder.tdRight}></th>
                          </tr>
                          </tbody>

                        {total_current_assets && (
                        <tbody>

                          <tr>
                            <td style={tableborder.td}></td>
                            <td style={tableborder.tdRight}></td>
                          </tr>


                          <tr onClick={() => this.setState({ taxes_and_expense_payable: !taxes_and_expense_payable })}>
                            <td style={tableborder.td}> { taxes_and_expense_payable ? '-' : '+' } Taxes & Expenses Payable</td>
                            <td style={tableborder.tdRight}>125574444</td>
                          </tr>

                          {taxes_and_expense_payable && (

                          <tr>
                            <td style={tableborder.td}>Dummy DATA</td>
                            <td style={tableborder.tdRight}>5422</td>
                          </tr>

                          )}

                          <tr>
                            <td style={tableborder.td}>Creditors / Accounts Payable</td>
                            <td style={tableborder.tdRight}>125574444</td>
                          </tr>
                          </tbody>
                          )}
                          <tbody>

                          <tr>
                            <td style={tableborder.td}></td>
                            <td style={tableborder.tdRight}></td>
                          </tr>

                          <tr onClick={() => this.setState({ total_current_liablities: !total_current_liablities })}>
                            <th style={tableborder.td}> { total_current_liablities ? '-' : '+' } Total Current Liabilities (B)</th>
                                <th style={tableborder.tdRight}> 6565265265</th>

                          </tr>


                        {total_current_liablities && (

                          <tr>
                            <td style={tableborder.td}>Dummy DATA</td>
                            <td style={tableborder.tdRight}>3784</td>
                          </tr>
                          )}

                          <tr onClick={() => this.setState({ net_liquid_funds: !net_liquid_funds })}>
                            <th style={tableborder.td}> Net Liquid Funds (A-B)</th>
                            <th style={tableborder.tdRight}>-526526565</th>
                          </tr>
                          </tbody>
                          {net_liquid_funds && (
                            <tbody>

                                  <tr>
                                    <td style={tableborder.td}></td>
                                    <td style={tableborder.tdRight}></td>
                                  </tr>


                                  <tr>
                                    <td style={tableborder.td}> Less: Bank Overdraft Utilized</td>
                                        <td style={tableborder.tdRight}>0</td>

                                  </tr>
                                  </tbody>
                            )}
                            <tbody>
                          <tr>
                            <td style={tableborder.td}></td>
                            <td style={tableborder.tdRight}></td>
                          </tr>

                          <tr>
                            <th style={tableborder.td}>Net Liquidity In Company</th>
                                <th style={tableborder.tdRight}>-3652515</th>
                          </tr>
                              </tbody>
                            </table>


                                </Card>
                            </Col>
                            }
</Container>
}
</div>
            </React.Fragment>
        );
    }
}

export default Liquidity;