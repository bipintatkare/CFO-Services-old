import React, { Component } from "react";

import { Card, CardBody, CardTitle, Badge, Button, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
class CompanyDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
        data:[],
            transactions: [
                { id: "customCheck2", orderId: "Company A", billingName: " ", Date: " ", total: " ", badgeClass: " ", paymentStatus: " ", methodIcon: " ", link: "#" },
                { id: "customCheck3", orderId: "Company B", billingName: " ", Date: " ", total: " ", badgeClass: " ", paymentStatus: " ", methodIcon: " ", link: "#" },
                { id: "customCheck4", orderId: "Company C", billingName: " ", Date: " ", total: " ", badgeClass: " ", paymentStatus: " ", methodIcon: " ", link: "#" },
                { id: "customCheck5", orderId: "Company D", billingName: " ", Date: " ", total: " ", badgeClass: " ", paymentStatus: " ", methodIcon: " ", link: "#" },
            ]
        };
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

        fetch('/api/v1/company_details/'+`${this.props.match.params.id}`, lookups)
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
                data : res
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

componentDidMount(){
        this.load_managers()

    }

    render() {
    const {data}=this.state;
    console.log("datakkkkkk");
    console.log(data!=null);
        return (
            <React.Fragment>

            <h3 style={{margin:"10% 0% 2% 2%"}}></h3>
                        <div style={{margin:"0% 2% 10% 2%"}}>

                           {data!=null && data.length > 0? data.map((Item,index)=>{
                            return(
<>
                        <div className="card shadow card " style={{borderRadius:"20px"}} key={index} >
                          <div className="card-body">
                            <h5>
                            <Row>
                                <Col md="1"> <lable><strong>{index+1}</strong></lable> </Col>
                                <Col md="5"> <lable>{console.log(Object.keys(Item)[index])}{Item.name}</lable> </Col>
                                <Col md="3"> <lable>{Item.count} Entries</lable> </Col>
                                <Col md="3">  <lable>Last Sync: {Item.time_date}</lable> </Col>
                            </Row>
                            </h5>
                          </div>
                        </div>

                        </>
                         )
                })
                 :
                           <p>Data Not Found</p>
                         }



                        </div>


            </React.Fragment>
        );
    }
}


export default CompanyDetails;
