import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Button, UncontrolledDropdown, UncontrolledTooltip, Dropdown, DropdownToggle,
DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup, InputGroupAddon,Container } from "reactstrap";
import { Link } from "react-router-dom";
import "./table_border.css";
import { exportComponentAsJPEG, exportComponentAsPDF, exportComponentAsPNG } from 'react-component-export-image';
import LoadingComponent from './loadingComponent';
import SearchFilter from "./SearchFilter2"


import ColumnChartToast from "./Components/ColumnChartToast";
import BarChart from "./Components/barchart";

import ReactHTMLTableToExcel from 'react-html-table-to-excel';
const TableCss={
    border:"1px solid black"
}


class CFOMailTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            obj_list : [],
            obj_ledgers : [],
            sales_actual_till_date :"0",
            sales_actual_monthly :"0",
            sales_actual_yearly :"0",
            sales_month_list :[],
            sales_amount_list :[],
            data : {},
            data_receipt : {},
            loading:true,

        }

    }

     load_managers = () => {
//        const token = cookie.load("token")

        const lookups = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                                 'Accept': 'application/json',

//                "Authorization": `token ${token}`
            }
        }

        fetch(process.env.REACT_APP_BASEURL_BACKEND+'/api/v1/sales_report/'+`${this.state.company_id}`, lookups)
        .then(res => {
            if(res.status > 400){
                return console.log("Something went wrong")
            }
            console.log(res.body)
            return res.json()
        })
        .then(res => {

            console.log("response list", res[0])
            return this.setState({
            loading: false,
                obj_list : res[0]['obj_list'],
                obj_ledgers : res[0]['obj_ledgers'],
                sales_actual_till_date : res[0]['sales_actual_till_date'],
                sales_actual_monthly : res[0]['sales_actual_monthly'],
                sales_actual_yearly : res[0]['sales_actual_yearly'],
                sales_month_list : res[0]['sales_month_list'],
                sales_amount_list : res[0]['sales_amount_list'],
                data : {
      categories: res[0]['sales_month_list'],
    series: [
        {
            name: 'Sales',
            data: res[0]['sales_amount_list']
        },

    ]
    },
    data_receipt : {
      categories: res[0]['sales_month_list'],
    series: [
        {
            name: 'Sales',
            data: res[0]['sales_amount_list']
        },
        {
            name: 'Reciepts',
            data: res[0]['receipt_amount_list']
        },

    ]
    },
            })
        })
        .catch(err => {
            console.log(err)
        })
    }


    handleParentData = (e,f) => {
     if (f==null){

     this.setState({
company_id: e,
loading: true,
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

fetch('/api/v1/sales_report/'+`${e}`, lookups)
        .then(res => {
            if(res.status > 400){
                return console.log("Something went wrong")
            }
            console.log(res.body)
            return res.json()
        })
        .then(res => {

            console.log("response list", res[0])
            return this.setState({
            loading: false,
                obj_list : res[0]['obj_list'],
                obj_ledgers : res[0]['obj_ledgers'],
                sales_actual_till_date : res[0]['sales_actual_till_date'],
                sales_actual_monthly : res[0]['sales_actual_monthly'],
                sales_actual_yearly : res[0]['sales_actual_yearly'],
                sales_month_list : res[0]['sales_month_list'],
                sales_amount_list : res[0]['sales_amount_list'],
                data : {
      categories: res[0]['sales_month_list'],
    series: [
        {
            name: 'Sales',
            data: res[0]['sales_amount_list']
        },

    ]
    },
    data_receipt : {
      categories: res[0]['sales_month_list'],
    series: [
        {
            name: 'Sales',
            data: res[0]['sales_amount_list']
        },
        {
            name: 'Reciepts',
            data: res[0]['receipt_amount_list']
        },

    ]
    },
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

componentDidMount(){
  this.setState({
company_id: this.props.company_id,
})
        this.load_managers()

    }

    render() {
     const {obj_list} = this.state
     const {obj_ledgers} = this.state
     const {sales_actual_till_date, loading} = this.state
     const {sales_actual_monthly} = this.state
     const {sales_actual_yearly} = this.state
     const sales_amount_list = this.state.sales_amount_list
     const sales_month_list= this.state.sales_month_list
     const data = this.state.data
     const data_receipt = this.state.data_receipt

    		const chartWidth = (window.innerWidth > 991) ? parseInt((window.innerWidth - 0) / 2) : parseInt(window.innerWidth - 100);

        return (
            <React.Fragment>
            <div className="">
            {loading ? <LoadingComponent /> :
                    <Container fluid>
           <SearchFilter mis_id="2" company_id ={this.state.company_id} handleData={this.handleParentData} />

                    <Card>
                    <center>
                        <h2> </h2>
                        <h2> Crucial Numbers </h2>
                    </center>
                        <Card>
                           <CardBody>
                                <table style={TableCss} className="table table table-bordered">
                                      <thead className="thead-dark">
                                        <tr>
                                          <th scope="col" colspan="4"><center>Sales</center></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr style={{backgroundColor: "#f2f2f2"}}>
                                          <th style={{border: "1px solid black"}} scope="row" colspan="2"><center>For The Day</center></th>
                                          <th style={{border: "1px solid black"}} scope="row" colspan="1"><center>Monthly Cumulative	</center></th>
                                          <th style={{border: "1px solid black"}} scope="row" colspan="1"><center>Yearly Cumulative	</center></th>
                                        </tr>
                                        <tr>
                                            <td style={{border: "1px solid black"}} scope="row" colspan="2"><center> {sales_actual_till_date!=null?sales_actual_till_date:0} </center></td>
                                            <td style={{border: "1px solid black"}} scope="row" colspan="1"><center> {sales_actual_monthly!=null?sales_actual_monthly:0} </center> </td>
                                            <td style={{border: "1px solid black"}} scope="row" colspan="1"><center> {sales_actual_yearly!=null?sales_actual_yearly:0} </center> </td>

                                        </tr>

                                       </tbody>
                                </table>
                           </CardBody>
                        </Card>

                        <Card>
                           <CardBody>
                                <table style={TableCss} className="table table table-bordered">
                                      <thead className="thead-dark">
                                        <tr>
                                          <th scope="col" colspan="3"><center>Receipts</center></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr style={{backgroundColor: "#f2f2f2"}}>
                                          <th style={{border: "1px solid black"}} scope="row" colspan="1"><center>Date</center></th>
                                          <th style={{border: "1px solid black"}} scope="row" colspan="1"><center>Customer Name		</center></th>
                                          <th style={{border: "1px solid black"}} scope="row" colspan="1"><center>Amount	</center></th>
                                        </tr>
 {obj_list!=null && obj_list.length > 0? obj_list.map((obj,index)=>{
                            return(
 <tr>
                                            <td style={{border: "1px solid black"}} scope="row" colspan="1"><center> {obj.voucher_id_date}	 </center></td>
                                            <td style={{border: "1px solid black"}} scope="row" colspan="1"><center> {obj.ledger_name_temp}	 </center> </td>
                                            <td style={{border: "1px solid black"}} scope="row" colspan="1"><center> {obj.amt} </center> </td>

                                        </tr>

    )
                })
                            :
                            <>

 <tr>
                                            <td style={{border: "1px solid black"}} scope="row" colspan="1"><center> --	 </center></td>
                                            <td style={{border: "1px solid black"}} scope="row" colspan="1"><center> --	 </center> </td>
                                            <td style={{border: "1px solid black"}} scope="row" colspan="1"><center> -- </center> </td>

                                        </tr>

                          </>
                            }

                                       </tbody>
                                </table>
                           </CardBody>
                        </Card>

                        <Card>
                           <CardBody>
                                <table style={TableCss} className="table table table-bordered">
                                      <thead className="thead-dark">
                                        <tr>
                                          <th scope="col" colspan="2"><center>Bank Balance</center></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr style={{backgroundColor: "#f2f2f2"}}>
                                          <th style={{border: "1px solid black"}} scope="row" colspan="1"><center>Name of the Bank	</center></th>
                                          <th style={{border: "1px solid black"}} scope="row" colspan="1"><center>Amount 	</center></th>
                                        </tr>


                                         {obj_ledgers!=null && obj_ledgers.length > 0? obj_ledgers.map((obj,index)=>{
                            return(


                                          <tr>
                                            <td style={{border: "1px solid black"}} scope="row" colspan="1"><center> {obj.name}	 </center> </td>
                                            <td style={{border: "1px solid black"}} scope="row" colspan="1"><center> {obj.closing_balance} </center> </td>

                                        </tr>

    )
                })
                            :
                            <>

                                              <tr>
                                            <td style={{border: "1px solid black"}} scope="row" colspan="1"><center> N/A	 </center> </td>
                                            <td style={{border: "1px solid black"}} scope="row" colspan="1"><center> N/A </center> </td>

                                        </tr>


                          </>
                            }



                                       </tbody>
                                </table>
                           </CardBody>
                        </Card>
                     </Card>

{/*


                     <Card>
                           <CardBody>
                           <center>
                               <h3> Sales This Month  </h3>
                           </center>
                           <br/>
                           <Row>
                                <Col md="2" ></Col>
                                <Col md="8">
                                    <BarChart chartWidth={chartWidth} data={data} />
                                </Col>
                           </Row>
                           </CardBody>
                     </Card>


                     <Card>
                           <CardBody>
                           <center>
                               <h3> Monthly Sales & Collection </h3>
                           </center>
                           <br/>
                           <Row>
                                <Col md="2"></Col>
                                <Col md="8">
                                   <div className="text-center">
                                     <ColumnChartToast chartWidth={chartWidth} data_receipt={data_receipt} />
                                    </div>

                                </Col>
                           </Row>
                           </CardBody>
                     </Card>

                  */}



                    </Container>                    }

            </div>

            </React.Fragment>
        );
    }
}


export default class MyComponent extends React.Component {
 constructor(props) {
   super(props);
   this.componentRef = React.createRef();
 }

 render() {


   return (
     <React.Fragment>
            <div className="page-content">
       <CFOMailTable ref={this.componentRef} />

       <center>
       <a href="/sales_report_mail/39" target="_blank">
       <button className="btn btn-primary waves-effect waves-light">
        Email This Template
       </button>
       </a>
       </center>


            </div>
     </React.Fragment>
   );
 }
}




