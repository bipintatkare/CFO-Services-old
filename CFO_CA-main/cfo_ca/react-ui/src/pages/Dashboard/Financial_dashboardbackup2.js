import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Button, UncontrolledDropdown, UncontrolledTooltip, Dropdown, DropdownToggle,
DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup, InputGroupAddon,Container } from "reactstrap";
import { Link } from "react-router-dom";
import "./table_border.css";
import SearchFilter from "./SearchFilter"
import PopupBudget from './PopupBudget';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';


//Simple bar
import SimpleBar from "simplebar-react";

const TableCss={
    border:"1px solid black"
}

class FinancialD extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search_Menu: false,
            settings_Menu: false,
            other_Menu: false,
            ProductData: [],
            data_received : [],
            from_date:"",
            to_date:"",

        }
        this.toggleSearch = this.toggleSearch.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);
        this.toggleOther = this.toggleOther.bind(this);
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

        fetch("/api/v1/mis_fdbo/"+`${this.props.match.params.id}`, lookups)
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

      componentDidMount(){
        this.load_details()
    }

     handleParentData = (e,f) => {
this.setState({
from_date: e,
to_date: f,
})

this.load_details_date_range(e,f);
  }

    render() {
        const {data_received} = this.state

        return (
            <React.Fragment>
             <div className="page-content">
                    <Container fluid>
                    <Card>
                            <CardBody>



           <SearchFilter mis_id="1" company_id ={this.props.match.params.id} handleData={this.handleParentData} />

           <Row>
                 <Col md="12">
                     <center>
                     <br/>
                      <h2>Financial Dashboard For Business Owners</h2>
                     <br/>
                     <br/>
                     </center>
                 </Col>
                 <Col md="6" xs="6" sm="6">
                    <PopupBudget/>
                 </Col>
                 <Col md="6" md="6" xs="6" sm="6" className="text-right">

                                     <ReactHTMLTableToExcel
                                        className="btn btn-info"
                                        table="null"
                                        filename="ReportExcel"
                                        sheet="Sheet"
                                        buttonText="Export" />

                                        <ReactHTMLTableToExcel
                                        className="btn btn-info"
                                        table="notnull"
                                        filename="ReportExcel"
                                        sheet="Sheet"
                                        buttonText="Export" />


                 </Col>
           </Row>

  {data_received!=null && data_received.length > 0? data_received.map((Item,index)=>{
                            return(
                            <Row>



                  <Col md="12">
                                <Card>
                            <table style={TableCss} className="table table table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th scope="col" colspan="4"><center>Sales</center></th>
                                </tr>
                              </thead>
                              <tbody>

                                <tr>
                                  <th style={{border: "1px solid black"}} scope="row" colspan="2"><center>Current Month</center></th>
                                  <th style={{border: "1px solid black"}} scope="row" colspan="2"><center>Till Date</center></th>
                                </tr>
                             <tr>
                                <td style={{border: "1px solid black"}}><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>
                                <td style={{border: "1px solid black"}}><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>
                              </tr>

                                    <tr>
                                <td style={{border: "1px solid black"}}><center> </center></td>
                                <td style={{border: "1px solid black"}}><center>{Item.sales_current_month} </center></td>
                                <td style={{border: "1px solid black"}}><center>{Item.budget.sales}</center></td>
                                <td style={{border: "1px solid black"}}><center>{Item.sales_actual_till_date}</center></td>
                                </tr>
                              </tbody>
                            </table>

                            </Card>
                            <Card>
                            <table className="table table table-bordered" style={{marginTop:"0%"}}>
                              <thead className="thead-dark">
                                <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="8"><center>Gross Margin</center></th>
                                </tr>
                              </thead>
                              <tbody>

                              <tr>
                                <td style={{border: "1px solid black"}} colspan="4"><center> Current Month</center></td>
                                <td style={{border: "1px solid black"}} colspan="4"><center>Till Date</center></td>
                              </tr>
                             <tr>
                                <td style={{border: "1px solid black"}}><center>Budget %</center></td>
                                <td style={{border: "1px solid black"}}><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual %</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>

                                <td style={{border: "1px solid black"}}><center>Budget %</center></td>
                                <td style={{border: "1px solid black"}}><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual %</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>
                              </tr>

                              <tr>
                                <td style={{border: "1px solid black"}}>  </td>
                                <td style={{border: "1px solid black"}}> </td>
                                <td style={{border: "1px solid black"}}><center>{Item.gross_per_current_month} %</center> </td>
                                <td style={{border: "1px solid black"}}><center>{Item.gross_margin_current_month}</center> </td>


                                <td style={{border: "1px solid black"}}><center>{Item.budget.gross}</center></td>
                                <td style={{border: "1px solid black"}}><center>{Item.budget.gross}</center></td>
                                <td style={{border: "1px solid black"}}><center>{Item.gross_per_till_date} %</center></td>
                                <td style={{border: "1px solid black"}}><center>{Item.gross_margin} </center></td>
                              </tr>
                              </tbody>
                            </table>

                                </Card>

                        <Card>
                        <table className="table table table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="4"><center>Net Profit</center></th>
                                </tr>
                              </thead>
                              <tbody>

                                <tr>
                                  <th style={{border: "1px solid black"}} scope="row" colspan="2"><center>Current Month</center></th>
                                  <th style={{border: "1px solid black"}} scope="row" colspan="2"><center>Till Date</center></th>
                                </tr>
                             <tr>
                                <td style={{border: "1px solid black"}}><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>
                                <td style={{border: "1px solid black"}}><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>
                              </tr>

                                    <tr>
                                <td style={{border: "1px solid black"}}><center> </center></td>
                                <td style={{border: "1px solid black"}}><center>{Item.net_profit_current_month} </center></td>
                                <td style={{border: "1px solid black"}}><center>{Item.budget.nett}</center></td>
                                <td style={{border: "1px solid black"}}><center>{Item.net_profit}</center></td>
                                </tr>
                              </tbody>
                            </table>

                                </Card>
                                <Card>
                        <table className="table table table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="2"><center>Sundry Debtors (Accounts Receivable)</center></th>
                                </tr>
                              </thead>
                              <tbody>

                                <tr>
                                  <td style={{border: "1px solid black"}} scope="row"><center>Outstanding</center></td>
                                  <td style={{border: "1px solid black"}} scope="row"><center>{Item.SundryDebtors}</center></td>
                                </tr>
                                <tr>
                                  <td style={{border: "1px solid black"}} scope="row"><center>Number Of Days</center></td>
                                  <td style={{border: "1px solid black"}} scope="row"><center>{Item.no_of_days}</center></td>
                                </tr>

                              <tr>
                                <td style={{border: "1px solid black"}}><center>More Than 3 Months</center></td>
                                <td style={{border: "1px solid black"}}><center>{Item.more_than_three_month_debtors}</center></td>
                              </tr>
                               <tr>
                                <td style={{border: "1px solid black"}}><center>More Than 6 Months</center></td>
                                <td style={{border: "1px solid black"}}><center>{Item.more_than_six_month_debtors}</center></td>
                              </tr>

                              </tbody>
                            </table>

                                </Card>

                                <div className="row col-md-12">
                                <Card className="col-md-6">
                        <table className="table table table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="2"><center>Sundry Creditors (Accounts Payable)</center></th>
                                </tr>
                              </thead>
                              <tbody>

                                <tr>
                                  <td style={{border: "1px solid black"}} scope="row"><center>Outstanding</center></td>
                                  <td style={{border: "1px solid black"}} scope="row"><center>{Item.SundryCreditors}</center></td>
                                </tr>
                                <tr>
                                  <td  style={TableCss} scope="row"><center>Number Of Days</center></td>
                                  <td  style={TableCss} scope="row"><center>{Item.no_of_days_creditors}</center></td>
                                </tr>

                              <tr>
                                <td style={{border: "1px solid black"}}><center>More Than 3 Months</center></td>
                                <td style={{border: "1px solid black"}}><center>{Item.more_than_three_month_creditors}</center></td>
                              </tr>

                              </tbody>
                            </table>

                                </Card>
                                                                <Card className="col-md-6">
                        <table className="table table table-bordered">
                              <thead className="thead-dark">
                                                              <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="2"><center>Inventories</center></th>
                                </tr>
                              </thead>
                              <tbody>

                                <tr>
                                  <td  style={TableCss} scope="row"><center>Valuation</center></td>
                                  <td  style={TableCss} scope="row"><center>{Item.Inventories}</center></td>
                                </tr>
                                <tr>
                                  <td  style={TableCss} scope="row"><center>Number Of Days</center></td>
                                  <td  style={TableCss} scope="row"><center></center></td>
                                </tr>

                              <tr>
                                <td style={{border: "1px solid black"}}><center>In Stock For More Than 90 Days</center></td>
                                <td style={{border: "1px solid black"}}> </td>
                              </tr>


                              </tbody>
                            </table>

                                </Card>
                                </div>

                             <Card>
                        <table className="table table table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="5"><center>Major Expenses</center></th>
                                </tr>
                              </thead>
                              <tbody>

                          <tr>
                            <td style={{border: "1px solid black"}} rowspan="2"><center style={{marginTop:"6%"}}>Particulars</center></td>
                            <td style={{border: "1px solid black"}} colspan="2"><center>Current Month</center></td>
                            <td style={{border: "1px solid black"}} colspan="2"><center>Till Date</center></td>

                          </tr>
                                   <tr>
                            <td style={{border: "1px solid black"}}><center>Budgeted Figures</center></td>
                            <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>
                            <td style={{border: "1px solid black"}}><center>Budgeted Figures</center></td>
                            <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>
                          </tr>

                          {Item.major_expenses!=null && Item.major_expenses.length > 0? Item.major_expenses.map((obj,index)=>{
                            return(


                         <tr>
                            <td style={{border: "1px solid black"}}><center>{obj.name}</center></td>
                            <td style={{border: "1px solid black"}}></td>
                            <td style={{border: "1px solid black"}}></td>
                            <td style={{border: "1px solid black"}}><center>{obj.budget}</center></td>
                            <td style={{border: "1px solid black"}}><center>{obj.closing_balance}</center></td>
                          </tr>
    )
                })
                            :
                            <>
                                <tr>
                            <td style={{border: "1px solid black"}}><center>Budgeted Figures</center></td>
                            <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>
                            <td style={{border: "1px solid black"}}><center>Budgeted Figures</center></td>
                            <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>
                          </tr>

                         <tr>
                            <td style={{border: "1px solid black"}}><center>Export Expenses(Non-Table)</center></td>
                            <td style={{border: "1px solid black"}}></td>
                            <td style={{border: "1px solid black"}}></td>
                            <td style={{border: "1px solid black"}}><center>50000.0</center></td>
                            <td style={{border: "1px solid black"}}><center>985955</center></td>
                          </tr>
                         <tr>
                            <td style={{border: "1px solid black"}}><center>Professional Fees</center></td>
                            <td style={{border: "1px solid black"}}></td>
                            <td style={{border: "1px solid black"}}></td>
                            <td style={{border: "1px solid black"}}><center>525222</center></td>
                            <td style={{border: "1px solid black"}}><center>522222</center></td>
                          </tr>
                         <tr>
                            <td style={{border: "1px solid black"}}><center>Export Expenses</center></td>
                            <td style={{border: "1px solid black"}}></td>
                            <td style={{border: "1px solid black"}}></td>
                            <td style={{border: "1px solid black"}}><center>800004</center></td>
                            <td style={{border: "1px solid black"}}><center>800004</center></td>
                          </tr>
                         <tr>
                            <td style={{border: "1px solid black"}}><center>Factory Rent</center></td>
                            <td style={{border: "1px solid black"}}></td>
                            <td style={{border: "1px solid black"}}></td>
                            <td style={{border: "1px solid black"}}><center>800004</center></td>
                            <td style={{border: "1px solid black"}}><center>890000</center></td>
                          </tr>
                          </>
                            }


                              </tbody>
                            </table>
                                </Card>
                            </Col>
                            </Row>


                            )

                })
                 :
                  <Col style={{marginTop:"2%",marginBottom:"10%"}} xl="12" md="12">
                                <Card>
                            <table style={TableCss} className="table table table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th scope="col" colspan="4"><center>Sales</center></th>
                                </tr>
                              </thead>
                              <tbody>

                                <tr>
                                  <th style={{border: "1px solid black"}} scope="row" colspan="2"><center>Current Month</center></th>
                                  <th style={{border: "1px solid black"}} scope="row" colspan="2"><center>Till Date</center></th>
                                </tr>
                             <tr>
                                <td style={{border: "1px solid black"}}><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>
                                <td style={{border: "1px solid black"}}><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>
                              </tr>

                                    <tr>
                                <td style={{border: "1px solid black"}}><center> </center></td>
                                <td style={{border: "1px solid black"}}><center> </center></td>
                                <td style={{border: "1px solid black"}}><center>5000.0</center></td>
                                <td style={{border: "1px solid black"}}><center>84349271400</center></td>
                                </tr>
                              </tbody>
                            </table>

                            </Card>
                            <Card>
                            <table className="table table table-bordered" style={{marginTop:"0%"}}>
                              <thead className="thead-dark">
                                <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="8"><center>Gross Margin</center></th>
                                </tr>
                              </thead>
                              <tbody>

                              <tr>
                                <td style={{border: "1px solid black"}} colspan="4"><center> Current Month</center></td>
                                <td style={{border: "1px solid black"}} colspan="4"><center>Till Date</center></td>
                              </tr>
                             <tr>
                                <td style={{border: "1px solid black"}}><center>Budget %</center></td>
                                <td style={{border: "1px solid black"}}><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual %</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>

                                <td style={{border: "1px solid black"}}><center>Budget %</center></td>
                                <td style={{border: "1px solid black"}}><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual %</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>
                              </tr>

                              <tr>
                                <td style={{border: "1px solid black"}}>  </td>
                                <td style={{border: "1px solid black"}}> </td>
                                <td style={{border: "1px solid black"}}> </td>
                                <td style={{border: "1px solid black"}}> </td>

                                <td style={{border: "1px solid black"}}> </td>
                                <td style={{border: "1px solid black"}}> </td>
                                <td style={{border: "1px solid black"}}><center>100.0</center></td>
                                <td style={{border: "1px solid black"}}><center>86152535100 </center></td>
                              </tr>
                              </tbody>
                            </table>

                                </Card>

                        <Card>
                        <table className="table table table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="4"><center>Net Profit</center></th>
                                </tr>
                              </thead>
                              <tbody>

                                <tr>
                                  <th style={{border: "1px solid black"}} scope="row" colspan="2"><center>Current Month</center></th>
                                  <th style={{border: "1px solid black"}} scope="row" colspan="2"><center>Till Date</center></th>
                                </tr>
                             <tr>
                                <td style={{border: "1px solid black"}}><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>
                                <td style={{border: "1px solid black"}}><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>
                              </tr>

                                    <tr>
                                <td style={{border: "1px solid black"}}><center> </center></td>
                                <td style={{border: "1px solid black"}}><center> </center></td>
                                <td style={{border: "1px solid black"}}><center>5000.0</center></td>
                                <td style={{border: "1px solid black"}}><center>84349271400</center></td>
                                </tr>
                              </tbody>
                            </table>

                                </Card>
                                <Card>
                        <table className="table table table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="2"><center>Sundry Debtors (Accounts Receivable)</center></th>
                                </tr>
                              </thead>
                              <tbody>

                                <tr>
                                  <td style={{border: "1px solid black"}} scope="row"><center>Outstanding</center></td>
                                  <td style={{border: "1px solid black"}} scope="row"><center>155897978800</center></td>
                                </tr>
                                <tr>
                                  <td style={{border: "1px solid black"}} scope="row"><center>Number Of Days</center></td>
                                  <td style={{border: "1px solid black"}} scope="row"><center>67170</center></td>
                                </tr>

                              <tr>
                                <td style={{border: "1px solid black"}}><center>More Than 3 Months</center></td>
                                <td style={{border: "1px solid black"}}> </td>
                              </tr>
                               <tr>
                                <td style={{border: "1px solid black"}}><center>More Than 6 Months</center></td>
                                <td style={{border: "1px solid black"}}> </td>
                              </tr>

                              </tbody>
                            </table>

                                </Card>

                                <div className="row col-md-12">
                                <Card className="col-md-6">
                        <table className="table table table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="2"><center>Sundry Debtors (Accounts Receivable)</center></th>
                                </tr>
                              </thead>
                              <tbody>

                                <tr>
                                  <td style={{border: "1px solid black"}} scope="row"><center>Outstanding</center></td>
                                  <td style={{border: "1px solid black"}} scope="row"><center>155897978800</center></td>
                                </tr>
                                <tr>
                                  <td  style={TableCss} scope="row"><center>Number Of Days</center></td>
                                  <td  style={TableCss} scope="row"><center>67170</center></td>
                                </tr>

                              <tr>
                                <td style={{border: "1px solid black"}}><center> Than 3 Months</center></td>
                                <td style={{border: "1px solid black"}}> </td>
                              </tr>

                              </tbody>
                            </table>

                                </Card>
                                                                <Card className="col-md-6">
                        <table className="table table table-bordered">
                              <thead className="thead-dark">
                                                              <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="2"><center>Inventories</center></th>
                                </tr>
                              </thead>
                              <tbody>

                                <tr>
                                  <td  style={TableCss} scope="row"><center>Valuation</center></td>
                                  <td  style={TableCss} scope="row"><center>77444150000</center></td>
                                </tr>
                                <tr>
                                  <td  style={TableCss} scope="row"><center>Number Of Days</center></td>
                                  <td  style={TableCss} scope="row"><center></center></td>
                                </tr>

                              <tr>
                                <td style={{border: "1px solid black"}}><center>In Stock For More Than 90 Days</center></td>
                                <td style={{border: "1px solid black"}}> </td>
                              </tr>


                              </tbody>
                            </table>

                                </Card>
                                </div>

                             <Card>
                        <table className="table table table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="5"><center>Sundry Debtors (Accounts Receivable)</center></th>
                                </tr>
                              </thead>
                              <tbody>

                          <tr>
                            <td style={{border: "1px solid black"}} rowspan="2"><center style={{marginTop:"6%"}}>Particulars</center></td>
                            <td style={{border: "1px solid black"}} colspan="2"><center>Current Month</center></td>
                            <td style={{border: "1px solid black"}} colspan="2"><center>Till Date</center></td>

                          </tr>

                          <tr>
                            <td style={{border: "1px solid black"}}><center>Budgeted Figures</center></td>
                            <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>
                            <td style={{border: "1px solid black"}}><center>Budgeted Figures</center></td>
                            <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>
                          </tr>

                         <tr>
                            <td style={{border: "1px solid black"}}><center>Export Expenses(Non-Table)</center></td>
                            <td style={{border: "1px solid black"}}></td>
                            <td style={{border: "1px solid black"}}></td>
                            <td style={{border: "1px solid black"}}><center>50000.0</center></td>
                            <td style={{border: "1px solid black"}}><center>985955</center></td>
                          </tr>
                         <tr>
                            <td style={{border: "1px solid black"}}><center>Professional Fees</center></td>
                            <td style={{border: "1px solid black"}}></td>
                            <td style={{border: "1px solid black"}}></td>
                            <td style={{border: "1px solid black"}}><center>525222</center></td>
                            <td style={{border: "1px solid black"}}><center>522222</center></td>
                          </tr>
                         <tr>
                            <td style={{border: "1px solid black"}}><center>Export Expenses</center></td>
                            <td style={{border: "1px solid black"}}></td>
                            <td style={{border: "1px solid black"}}></td>
                            <td style={{border: "1px solid black"}}><center>800004</center></td>
                            <td style={{border: "1px solid black"}}><center>800004</center></td>
                          </tr>
                         <tr>
                            <td style={{border: "1px solid black"}}><center>Factory Rent</center></td>
                            <td style={{border: "1px solid black"}}></td>
                            <td style={{border: "1px solid black"}}></td>
                            <td style={{border: "1px solid black"}}><center>800004</center></td>
                            <td style={{border: "1px solid black"}}><center>890000</center></td>
                          </tr>
                              </tbody>
                            </table>
                                </Card>
                            </Col>

                }


{/* Null Table Modifies */}


<div style={{display: "none"}}>
  {data_received!=null && data_received.length > 0? data_received.map((Item,index)=>{
                            return(

                            <Col style={{marginTop:"2%",marginBottom:"10%"}} xl="12" md="12">
                            <table id="notnull" style={TableCss} className="table table table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th scope="col" colspan="8"><center>Sales</center></th>
                                </tr>
                              </thead>
                              <tbody>

                                <tr>
                                  <th style={{border: "1px solid black"}} scope="row" colspan="4"><center>Current Month</center></th>
                                  <th style={{border: "1px solid black"}} scope="row" colspan="4"><center>Till Date</center></th>
                                </tr>
                             <tr>
                                <td style={{border: "1px solid black"}} colspan="2"><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>Actual Figures</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>Actual Figures</center></td>
                              </tr>

                                    <tr>
                                <td style={{border: "1px solid black"}} colspan="2"><center> </center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center> {Item.sales_current_month}</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>{Item.budget.sales}</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>{Item.sales_actual_till_date}</center></td>
                                </tr>
                              </tbody>

                              <thead className="thead-dark">
                                <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="8"><center>Gross Margin</center></th>
                                </tr>
                              </thead>
                              <tbody>

                              <tr>
                                <td style={{border: "1px solid black"}} colspan="4"><center> Current Month</center></td>
                                <td style={{border: "1px solid black"}} colspan="4"><center>Till Date</center></td>
                              </tr>
                             <tr>
                                <td style={{border: "1px solid black"}}><center>Budget %</center></td>
                                <td style={{border: "1px solid black"}}><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual %</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>

                                <td style={{border: "1px solid black"}}><center>Budget %</center></td>
                                <td style={{border: "1px solid black"}}><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual %</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>
                              </tr>

                              <tr>
                                <td style={{border: "1px solid black"}}>  </td>
                                <td style={{border: "1px solid black"}}> </td>
                                <td style={{border: "1px solid black"}}> {Item.gross_per_current_month} %</td>
                                <td style={{border: "1px solid black"}}> {Item.gross_margin_current_month}</td>

                                <td style={{border: "1px solid black"}}> {Item.budget.gross}</td>
                                <td style={{border: "1px solid black"}}> {Item.budget.gross}</td>
                                <td style={{border: "1px solid black"}}><center>{Item.gross_per_till_date} %</center></td>
                                <td style={{border: "1px solid black"}}><center>{Item.gross_margin} </center></td>
                              </tr>
                              </tbody>


                              <thead className="thead-dark">
                                <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="8"><center>Net Profit</center></th>
                                </tr>
                              </thead>
                              <tbody>

                                <tr>
                                  <th style={{border: "1px solid black"}} scope="row" colspan="4"><center>Current Month</center></th>
                                  <th style={{border: "1px solid black"}} scope="row" colspan="4"><center>Till Date</center></th>
                                </tr>
                             <tr>
                                <td style={{border: "1px solid black"}} colspan="2"><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>Actual Figures</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>Actual Figures</center></td>
                              </tr>

                                    <tr>
                                <td style={{border: "1px solid black"}} colspan="2"><center> </center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center> {Item.net_profit_current_month}</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>{Item.budget.nett}</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>{Item.net_profit}</center></td>
                                </tr>
                              </tbody>

                              <thead className="thead-dark">
                                <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="8"><center>Sundry Debtors (Accounts Receivable)</center></th>
                                </tr>
                              </thead>
                              <tbody>

                                <tr>
                                  <td style={{border: "1px solid black"}} scope="row" colspan="4"><center>Outstanding</center></td>
                                  <td style={{border: "1px solid black"}} scope="row" colspan="4"><center>{Item.SundryDebtors}</center></td>
                                </tr>
                                <tr>
                                  <td style={{border: "1px solid black"}} scope="row" colspan="4"><center>Number Of Days</center></td>
                                  <td style={{border: "1px solid black"}} scope="row" colspan="4"><center>{Item.no_of_days}</center></td>
                                </tr>

                              <tr>
                                <td style={{border: "1px solid black"}} colspan="4"><center>More Than 3 Months</center></td>
                                <td style={{border: "1px solid black"}} colspan="4"> {Item.more_than_three_month_debtors}</td>
                              </tr>
                               <tr>
                                <td style={{border: "1px solid black"}} colspan="4"><center>More Than 6 Months</center></td>
                                <td style={{border: "1px solid black"}} colspan="4"> {Item.more_than_six_month_debtors}</td>
                              </tr>

                              </tbody>


                              <thead className="thead-dark">
                                <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="4"><center>Sundry Debtors (Accounts Receivable)</center></th>
                                    <th style={{border: "1px solid black"}} scope="col" colspan="4"><center>Inventories</center></th>

                                </tr>
                              </thead>
                              <tbody>

                                <tr>
                                  <td style={{border: "1px solid black"}} scope="row" colspan="2"><center>Outstanding</center></td>
                                  <td style={{border: "1px solid black"}} scope="row" colspan="2"><center>155897978800</center></td>
                                  <td  style={TableCss} scope="row" colspan="2"><center>Valuation</center></td>
                                  <td  style={TableCss} scope="row" colspan="2"><center>77444150000</center></td>
                                </tr>
                                <tr>
                                  <td  style={TableCss} scope="row" colspan="2"><center>Number Of Days</center></td>
                                  <td  style={TableCss} scope="row" colspan="2"><center>67170</center></td>
                                    <td  style={TableCss} scope="row" colspan="2"><center>Number Of Days</center></td>
                                  <td  style={TableCss} scope="row" colspan="2"><center></center></td>
                                </tr>

                              <tr>
                                <td style={{border: "1px solid black"}} colspan="2"><center> Than 3 Months</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"> </td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>In Stock For More Than 90 Days</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"> </td>
                              </tr>

                              </tbody>

                              <thead className="thead-dark">
                                <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="2"><center>Sundry Creditors (Accounts Payable)</center></th>
                                </tr>
                              </thead>
                              <tbody>

                                <tr>
                                  <td style={{border: "1px solid black"}} scope="row"><center>Outstanding</center></td>
                                  <td style={{border: "1px solid black"}} scope="row"><center>{Item.SundryCreditors}</center></td>
                                </tr>
                                <tr>
                                  <td  style={TableCss} scope="row"><center>Number Of Days</center></td>
                                  <td  style={TableCss} scope="row"><center>{Item.no_of_days_creditors}</center></td>
                                </tr>

                              <tr>
                                <td style={{border: "1px solid black"}}><center>More Than 3 Months</center></td>
                                <td style={{border: "1px solid black"}}><center>{Item.more_than_three_month_creditors}</center></td>
                              </tr>

                              </tbody>




                              <thead className="thead-dark">
                                <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="8"><center>Sundry Debtors (Accounts Receivable)</center></th>
                                </tr>
                              </thead>
                              <tbody>

                          <tr>
                            <td style={{border: "1px solid black"}} rowspan="2"  colspan="2"><center style={{marginTop:"6%"}}>Particulars</center></td>
                            <td style={{border: "1px solid black"}} colspan="3"><center>Current Month</center></td>
                            <td style={{border: "1px solid black"}} colspan="3"><center>Till Date</center></td>

                          </tr>

                          <tr>
                            <td style={{border: "1px solid black"}} colspan="1"><center>Budgeted Figures</center></td>
                            <td style={{border: "1px solid black"}} colspan="2"><center>Actual Figures</center></td>
                            <td style={{border: "1px solid black"}} colspan="1"><center>Budgeted Figures</center></td>
                            <td style={{border: "1px solid black"}} colspan="2"><center>Actual Figures</center></td>
                          </tr>

                         <tr>
                            <td style={{border: "1px solid black"}} colspan="2"><center>Export Expenses(Non-Table)</center></td>
                            <td style={{border: "1px solid black"}} colspan="1"></td>
                            <td style={{border: "1px solid black"}} colspan="2"></td>
                            <td style={{border: "1px solid black"}} colspan="1"><center>50000.0</center></td>
                            <td style={{border: "1px solid black"}} colspan="2"><center>985955</center></td>
                          </tr>
                         <tr>
                            <td style={{border: "1px solid black"}} colspan="2"><center>Professional Fees</center></td>
                            <td style={{border: "1px solid black"}} colspan="1"></td>
                            <td style={{border: "1px solid black"}} colspan="2"></td>
                            <td style={{border: "1px solid black"}} colspan="1"><center>525222</center></td>
                            <td style={{border: "1px solid black"}} colspan="2"><center>522222</center></td>
                          </tr>
                         <tr>
                            <td style={{border: "1px solid black"}} colspan="2"><center>Export Expenses</center></td>
                            <td style={{border: "1px solid black"}} colspan="1"></td>
                            <td style={{border: "1px solid black"}} colspan="2"></td>
                            <td style={{border: "1px solid black"}} colspan="1"><center>800004</center></td>
                            <td style={{border: "1px solid black"}} colspan="2"><center>800004</center></td>
                          </tr>
                         <tr>
                            <td style={{border: "1px solid black"}} colspan="2"><center>Factory Rent</center></td>
                            <td style={{border: "1px solid black"}} colspan="1"></td>
                            <td style={{border: "1px solid black"}} colspan="2"></td>
                            <td style={{border: "1px solid black"}} colspan="1"><center>800004</center></td>
                            <td style={{border: "1px solid black"}} colspan="2"><center>890000</center></td>
                          </tr>
                              </tbody>
                            </table>
                            </Col>





                            )
                })
                 :
                  <Col xl="12" md="12">
                            <table id="null" style={TableCss} className="table table table-bordered">
                              <thead className="thead-dark">
                                <tr>
                                  <th scope="col" colspan="8"><center>Sales</center></th>
                                </tr>
                              </thead>
                              <tbody>

                                <tr>
                                  <th style={{border: "1px solid black"}} scope="row" colspan="4"><center>Current Month</center></th>
                                  <th style={{border: "1px solid black"}} scope="row" colspan="4"><center>Till Date</center></th>
                                </tr>
                             <tr>
                                <td style={{border: "1px solid black"}} colspan="2"><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>Actual Figures</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>Actual Figures</center></td>
                              </tr>

                                    <tr>
                                <td style={{border: "1px solid black"}} colspan="2"><center> </center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center> </center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>5000.0</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>84349271400</center></td>
                                </tr>
                              </tbody>

                              <thead className="thead-dark">
                                <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="8"><center>Gross Margin</center></th>
                                </tr>
                              </thead>
                              <tbody>

                              <tr>
                                <td style={{border: "1px solid black"}} colspan="4"><center> Current Month</center></td>
                                <td style={{border: "1px solid black"}} colspan="4"><center>Till Date</center></td>
                              </tr>
                             <tr>
                                <td style={{border: "1px solid black"}}><center>Budget %</center></td>
                                <td style={{border: "1px solid black"}}><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual %</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>

                                <td style={{border: "1px solid black"}}><center>Budget %</center></td>
                                <td style={{border: "1px solid black"}}><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual %</center></td>
                                <td style={{border: "1px solid black"}}><center>Actual Figures</center></td>
                              </tr>

                              <tr>
                                <td style={{border: "1px solid black"}}>  </td>
                                <td style={{border: "1px solid black"}}> </td>
                                <td style={{border: "1px solid black"}}> </td>
                                <td style={{border: "1px solid black"}}> </td>

                                <td style={{border: "1px solid black"}}> </td>
                                <td style={{border: "1px solid black"}}> </td>
                                <td style={{border: "1px solid black"}}><center>100.0</center></td>
                                <td style={{border: "1px solid black"}}><center>86152535100 </center></td>
                              </tr>
                              </tbody>


                              <thead className="thead-dark">
                                <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="8"><center>Net Profit</center></th>
                                </tr>
                              </thead>
                              <tbody>

                                <tr>
                                  <th style={{border: "1px solid black"}} scope="row" colspan="4"><center>Current Month</center></th>
                                  <th style={{border: "1px solid black"}} scope="row" colspan="4"><center>Till Date</center></th>
                                </tr>
                             <tr>
                                <td style={{border: "1px solid black"}} colspan="2"><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>Actual Figures</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>Budget Figures</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>Actual Figures</center></td>
                              </tr>

                                    <tr>
                                <td style={{border: "1px solid black"}} colspan="2"><center> </center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center> </center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>5000.0</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>84349271400</center></td>
                                </tr>
                              </tbody>

                              <thead className="thead-dark">
                                <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="8"><center>Sundry Debtors (Accounts Receivable)</center></th>
                                </tr>
                              </thead>
                              <tbody>

                                <tr>
                                  <td style={{border: "1px solid black"}} scope="row" colspan="4"><center>Outstanding</center></td>
                                  <td style={{border: "1px solid black"}} scope="row" colspan="4"><center>155897978800</center></td>
                                </tr>
                                <tr>
                                  <td style={{border: "1px solid black"}} scope="row" colspan="4"><center>Number Of Days</center></td>
                                  <td style={{border: "1px solid black"}} scope="row" colspan="4"><center>67170</center></td>
                                </tr>

                              <tr>
                                <td style={{border: "1px solid black"}} colspan="4"><center>More Than 3 Months</center></td>
                                <td style={{border: "1px solid black"}} colspan="4"> </td>
                              </tr>
                               <tr>
                                <td style={{border: "1px solid black"}} colspan="4"><center>More Than 6 Months</center></td>
                                <td style={{border: "1px solid black"}} colspan="4"> </td>
                              </tr>

                              </tbody>


                              <thead className="thead-dark">
                                <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="4"><center>Sundry Debtors (Accounts Receivable)</center></th>
                                    <th style={{border: "1px solid black"}} scope="col" colspan="4"><center>Inventories</center></th>

                                </tr>
                              </thead>
                              <tbody>

                                <tr>
                                  <td style={{border: "1px solid black"}} scope="row" colspan="2"><center>Outstanding</center></td>
                                  <td style={{border: "1px solid black"}} scope="row" colspan="2"><center>155897978800</center></td>
                                  <td  style={TableCss} scope="row" colspan="2"><center>Valuation</center></td>
                                  <td  style={TableCss} scope="row" colspan="2"><center>77444150000</center></td>
                                </tr>
                                <tr>
                                  <td  style={TableCss} scope="row" colspan="2"><center>Number Of Days</center></td>
                                  <td  style={TableCss} scope="row" colspan="2"><center>67170</center></td>
                                    <td  style={TableCss} scope="row" colspan="2"><center>Number Of Days</center></td>
                                  <td  style={TableCss} scope="row" colspan="2"><center></center></td>
                                </tr>

                              <tr>
                                <td style={{border: "1px solid black"}} colspan="2"><center> Than 3 Months</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"> </td>
                                <td style={{border: "1px solid black"}} colspan="2"><center>In Stock For More Than 90 Days</center></td>
                                <td style={{border: "1px solid black"}} colspan="2"> </td>
                              </tr>

                              </tbody>


                              <thead className="thead-dark">
                                <tr>
                                  <th style={{border: "1px solid black"}} scope="col" colspan="8"><center>Sundry Debtors (Accounts Receivable)</center></th>
                                </tr>
                              </thead>
                              <tbody>

                          <tr>
                            <td style={{border: "1px solid black"}} rowspan="2"  colspan="2"><center style={{marginTop:"6%"}}>Particulars</center></td>
                            <td style={{border: "1px solid black"}} colspan="3"><center>Current Month</center></td>
                            <td style={{border: "1px solid black"}} colspan="3"><center>Till Date</center></td>

                          </tr>

                          <tr>
                            <td style={{border: "1px solid black"}} colspan="1"><center>Budgeted Figures</center></td>
                            <td style={{border: "1px solid black"}} colspan="2"><center>Actual Figures</center></td>
                            <td style={{border: "1px solid black"}} colspan="1"><center>Budgeted Figures</center></td>
                            <td style={{border: "1px solid black"}} colspan="2"><center>Actual Figures</center></td>
                          </tr>

                         <tr>
                            <td style={{border: "1px solid black"}} colspan="2"><center>Export Expenses(Non-Table)</center></td>
                            <td style={{border: "1px solid black"}} colspan="1"></td>
                            <td style={{border: "1px solid black"}} colspan="2"></td>
                            <td style={{border: "1px solid black"}} colspan="1"><center>50000.0</center></td>
                            <td style={{border: "1px solid black"}} colspan="2"><center>985955</center></td>
                          </tr>
                         <tr>
                            <td style={{border: "1px solid black"}} colspan="2"><center>Professional Fees</center></td>
                            <td style={{border: "1px solid black"}} colspan="1"></td>
                            <td style={{border: "1px solid black"}} colspan="2"></td>
                            <td style={{border: "1px solid black"}} colspan="1"><center>525222</center></td>
                            <td style={{border: "1px solid black"}} colspan="2"><center>522222</center></td>
                          </tr>
                         <tr>
                            <td style={{border: "1px solid black"}} colspan="2"><center>Export Expenses</center></td>
                            <td style={{border: "1px solid black"}} colspan="1"></td>
                            <td style={{border: "1px solid black"}} colspan="2"></td>
                            <td style={{border: "1px solid black"}} colspan="1"><center>800004</center></td>
                            <td style={{border: "1px solid black"}} colspan="2"><center>800004</center></td>
                          </tr>
                         <tr>
                            <td style={{border: "1px solid black"}} colspan="2"><center>Factory Rent</center></td>
                            <td style={{border: "1px solid black"}} colspan="1"></td>
                            <td style={{border: "1px solid black"}} colspan="2"></td>
                            <td style={{border: "1px solid black"}} colspan="1"><center>800004</center></td>
                            <td style={{border: "1px solid black"}} colspan="2"><center>890000</center></td>
                          </tr>
                              </tbody>
                            </table>
                            </Col>

                }

</div>

</CardBody>
</Card>

 </Container>
 </div>
            </React.Fragment>
        );
    }
}

export default FinancialD;