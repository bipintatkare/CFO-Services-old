import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Button,Container, UncontrolledDropdown, UncontrolledTooltip, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Form, FormGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { Link } from "react-router-dom";
import Collaps from "./collapsable";
import SearchFilter from "./SearchFilter"
import LoadingComponent from './loadingComponent';


//Simple bar
import SimpleBar from "simplebar-react";

const Grater_than="<";
const Smaller_than=">";



class CreditorsAgeing extends Component {
    constructor(props) {
        super(props);
        this.state = {
data:[],
loading:true,
company_id: "",
        }

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


        fetch("/api/v1/mis_car/"+`${this.props.match.params.id}`, lookups)
//        fetch("/api/v1/mis_car/"+`${this.props.company_id}`, lookups)
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
                data : res[0].ageing
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

        componentDidMount(){

        this.load_companies()


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

fetch("/api/v1/mis_car/"+`${e}`, lookups)
//        fetch("/api/v1/mis_car/"+`${this.props.company_id}`, lookups)
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
                data : res[0].ageing
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
    const {data,loading} = this.state

        return (
            <React.Fragment>
            <div className="page-content">
                    <Container fluid>




            <SearchFilter mis_id="1" company_id ={this.props.match.params.id} handleData={this.handleParentData} />
            <center><h2 style={{marginTop:"2%"}}>Creditors Ageing Report</h2></center>
                            <Col style={{marginTop:"2%",marginBottom:"10%"}} xl="12">
                                <Card>
                            <table className="table table table-bordered">

                              {loading ? <LoadingComponent /> :
                                              <div>
                                              <thead className="thead-dark">
                                <tr>
                                  <th style={{width:"24.5%"}}><center>Particular</center></th>
                                  <th style={{width:"10.3%"}}><center>Total</center></th>
                                  <th style={{width:"27%"}}><center>{Grater_than} 30 Days</center></th>
                                  <th style={{width:"10%"}}><center>{Smaller_than}30 And {Grater_than}60</center></th>
                                  <th style={{width:"10%"}}><center>{Smaller_than}60 And {Grater_than}90</center></th>
                                  <th style={{width:"10%"}}><center>{Smaller_than}90 And {Grater_than}180 </center></th>
                                  <th style={{width:"10%"}}><center>{Smaller_than}180 And {Grater_than}270 </center></th>
                                  <th style={{width:"10%"}}><center>{Smaller_than}270 And Above </center></th>
                                </tr>
                              </thead>
{data!=null && data.length > 0? data.map((obj,index)=>{
                            return(
                            <tr>
                                   <td style={{width:"24.5%"}}>{obj.customer_name}</td>
                                  <td style={{width:"10.3%",textAlign: "right",}}>{obj.amount}</td>


                                    {obj.days==30?<td scope="col" style={{width:"27%",textAlign: "right",}}>{obj.amount}</td>:
                                  <td scope="col" style={{width:"27%",textAlign: "right",}}></td>}

                                  {obj.days>30 && obj.days<60 ?<td scope="col" style={{width:"10%",textAlign: "right",}}>{obj.amount}</td>:
                                 <td scope="col" style={{width:"10%",textAlign: "right",}}></td>}

                                  {obj.days>60 && obj.days<90?<td scope="col" style={{width:"10%",textAlign: "right",}}>{obj.amount}</td>:
                                 <td scope="col" style={{width:"10%",textAlign: "right",}}></td>}

                                  {obj.days>90 && obj.days<180?<td scope="col" style={{width:"10%",textAlign: "right",}}>{obj.amount}</td>:
                                  <td scope="col" style={{width:"10%",textAlign: "right",}}></td>}

                                  {obj.days>180 && obj.days<270?<td scope="col" style={{width:"10%",textAlign: "right",}}>{obj.amount}</td>:
                                  <td scope="col" style={{width:"10%",textAlign: "right",}}></td>}

                                {obj.days>270?<td scope="col" style={{width:"10%",textAlign: "right",}}>{obj.amount}</td>:
                                  <td scope="col" style={{width:"10%",textAlign: "right",}}></td>}
                                </tr>
                            )
                })
                 :
                 <tbody>
                  <tr>
                      <td scope="col" style={{width:"24.5%"}}><center>Particular</center></td>
                      <td scope="col" style={{width:"10.3%"}}><center>Total</center></td>
                      <td scope="col" style={{width:"27%",textAlign: "right",}}>{Grater_than} 30 Days</td>
                      <td scope="col" style={{width:"10%",textAlign: "right",}}>{Smaller_than}30 And {Grater_than}60</td>
                      <td scope="col" style={{width:"10%",textAlign: "right",}}>{Smaller_than}60 And {Grater_than}90</td>
                      <td scope="col" style={{width:"10%",textAlign: "right",}}>{Smaller_than}90 And Above </td>
                  </tr>
                  </tbody>
                                }

                                </div>
                                }



                            </table>
                           {/* <Collaps company_id = {this.props.match.params.id} />*/}

                            </Card>
                            </Col>
                            </Container>
                            </div>

            </React.Fragment>
        );
    }
}

export default CreditorsAgeing;