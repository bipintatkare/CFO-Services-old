import React, { Component } from "react";

import { Card, CardBody, CardTitle, Badge, Button } from "reactstrap";
import { Link } from "react-router-dom";

class Farinsolcard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: [
                { id: "customCheck2", orderId: "Company A", billingName: " ", Date: " ", total: " ", badgeClass: " ", paymentStatus: " ", methodIcon: " ", link: "#" },
                { id: "customCheck3", orderId: "Company B", billingName: " ", Date: " ", total: " ", badgeClass: " ", paymentStatus: " ", methodIcon: " ", link: "#" },
                { id: "customCheck4", orderId: "Company C", billingName: " ", Date: " ", total: " ", badgeClass: " ", paymentStatus: " ", methodIcon: " ", link: "#" },
                { id: "customCheck5", orderId: "Company D", billingName: " ", Date: " ", total: " ", badgeClass: " ", paymentStatus: " ", methodIcon: " ", link: "#" },
            ]
        };


    }

    render() {
    console.log(this.props.location.query);
        return (
            <React.Fragment>
            <h3 style={{margin:"10% 0% 2% 2%"}}>Farinsol</h3>
                        <div style={{margin:"0% 2% 10% 2%"}}>
                        <div className="card shadow card " style={{borderRadius:"20px"}}>
                          <div className="card-body">
                            <h5><lable style={{marginLeft:"1%",marginRight:"8%"}}><strong>1</strong></lable> <lable style={{marginRight:"1%"}}>Primary Group</lable> <lable style={{marginLeft:"30%",marginRight:"25%"}}>108 Entries</lable> <lable>Last Sync: 02/02/2018</lable></h5>
                          </div>
                        </div>
                           <div className="card shadow card " style={{borderRadius:"20px"}}>
                          <div className="card-body">
                            <h5><lable style={{marginLeft:"1%",marginRight:"8%"}}><strong>2</strong></lable> <lable style={{marginRight:"1%",marginLeft:"1%"}}>Parent Group</lable> <lable style={{marginLeft:"29%",marginRight:"25%"}}>108 Entries</lable> <lable>Last Sync: 02/02/2018</lable></h5>
                          </div>
                        </div>
                        <div className="card shadow card " style={{borderRadius:"20px"}}>
                          <div className="card-body">
                            <h5><lable style={{marginLeft:"1%",marginRight:"8%"}}><strong>3</strong></lable> <lable style={{marginRight:"1%"}}>Ledger</lable> <lable style={{marginLeft:"34%",marginRight:"26%"}}>108 Entries</lable> <lable>Last Sync: 02/02/2018</lable></h5>
                          </div>
                        </div>
                        <div className="card shadow card " style={{borderRadius:"20px"}}>
                          <div className="card-body">
                            <h5><lable style={{marginLeft:"1%",marginRight:"8%"}}><strong>4</strong></lable> <lable style={{marginRight:"1%"}}>Vouchers</lable> <lable style={{marginLeft:"32%",marginRight:"26%"}}>108 Entries</lable> <lable>Last Sync: 02/02/2018</lable></h5>
                          </div>
                        </div>
                        <div className="card shadow card " style={{borderRadius:"20px"}}>
                          <div className="card-body">
                            <h5><lable style={{marginLeft:"1%",marginRight:"8%"}}><strong>5</strong></lable> <lable style={{marginRight:"1%"}}>Stock Items</lable> <lable style={{marginLeft:"30%",marginRight:"26%"}}>108 Entries</lable> <lable>Last Sync: 02/02/2018</lable></h5>
                          </div>
                        </div>
                        <div className="card shadow card " style={{borderRadius:"20px"}}>
                          <div className="card-body">
                            <h5><lable style={{marginLeft:"1%",marginRight:"8%"}}><strong>6</strong></lable> <lable style={{marginRight:"1%"}}>Trail Balance</lable> <lable style={{marginLeft:"29%",marginRight:"26%"}}>108 Entries</lable> <lable>Last Sync: 02/02/2018</lable></h5>
                          </div>
                        </div>
                        <div className="card shadow card " style={{borderRadius:"20px"}}>
                          <div className="card-body">
                            <h5><lable style={{marginLeft:"1%",marginRight:"8%"}}><strong>7</strong></lable> <lable style={{marginRight:"1%"}}>Balance Sheet</lable> <lable style={{marginLeft:"28%",marginRight:"26%"}}>108 Entries</lable> <lable>Last Sync: 02/02/2018</lable></h5>
                          </div>
                        </div>
                        <div className="card shadow card " style={{borderRadius:"20px"}}>
                          <div className="card-body">
                            <h5><lable style={{marginLeft:"1%",marginRight:"8%"}}><strong>8</strong></lable> <lable style={{marginRight:"1%"}}>Profit And Loss</lable> <lable style={{marginLeft:"28%",marginRight:"26%"}}>108 Entries</lable> <lable>Last Sync: 02/02/2018</lable></h5>
                          </div>
                        </div>

                        </div>


            </React.Fragment>
        );
    }
}


export default Farinsolcard;
