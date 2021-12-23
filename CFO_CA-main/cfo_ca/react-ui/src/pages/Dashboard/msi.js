import React, { Component } from "react";

import { Card, CardBody, CardTitle, Badge, Button } from "reactstrap";
import { Link } from "react-router-dom";


class Msi extends Component {
    constructor(props) {
        super(props);
        this.state = {
companies:[],
company_id:'28',
        };

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

        fetch("/api/v1/company_list/", lookups)
        .then(res => {
            if(res.status > 400){
                return console.log("Something went wrong")
            }
            return res.json()
        })
        .then(res => {
            console.log("response recruiter list", res)
            return this.setState({
                companies : res
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
    const {company_id} = this.state
const {companies} = this.state
        return (
               <React.Fragment>

                   {companies!=null && companies.length > 0? companies.map((companyItem,index)=>{
                   if(companyItem.id == company_id)
        return <center style={{marginTop:"2%",marginLeft:"3%"}}><h1>{companyItem.company_name}</h1></center>

                                        })
                                         :
                                         <center style={{marginTop:"2%",marginLeft:"3%"}}><h1>Loading...</h1></center>
                                        }

            <div className="row" style={{marginTop:"3%",marginLeft:"3%"}}>

            <div className="col-md-5 shadow card text-white" style={{marginLeft:"4%",height:"100px",backgroundColor:"#3B4054"}}>
              <div className="card-body"><center style={{marginTop:"21px"}}>
                <Link to={{pathname: `/FinancialD/${company_id}`}} style={{color:"white"}}>Financial Dashboard For Business Owners.</Link>
                </center>
              </div>
            </div>

            <div className="col-md-5 shadow card text-white" style={{marginLeft:"4%",height:"100px",backgroundColor:"#3B4054"}}>
              <div className="card-body"><center style={{marginTop:"21px"}}>
                <Link to={{pathname: `/Liquidity/${company_id}`}} style={{color:"white"}}>Liquidity Barometer Of Business.</Link></center>
              </div>
            </div>
            </div>
                        <div className="row" style={{marginLeft:"3%"}}>
            <div className="col-md-5 shadow card text-white" style={{marginLeft:"4%",height:"100px",backgroundColor:"#3B4054"}}>
              <div className="card-body"><center style={{marginTop:"21px"}}>
               <Link to ={{pathname: `/msipage/${company_id}`}} style={{color:"white"}}>Profit & Loss Account With Segmentation.</Link></center>
              </div>
            </div>
            <div className="col-md-5 shadow card text-white" style={{marginLeft:"4%",height:"100px",backgroundColor:"#3B4054"}}>
              <div className="card-body"><center style={{marginTop:"21px"}}>
                <Link to={{pathname: `/Funds_flow/${company_id}`}} style={{color:"white"}}>Fund Flow Statement For The Period.</Link></center>
              </div>
            </div>
            </div>
                        <div className="row" style={{marginLeft:"3%"}}>
            <div className="col-md-5 shadow card text-white" style={{marginLeft:"4%",height:"100px",backgroundColor:"#3B4054"}}>
              <div className="card-body"><center style={{marginTop:"21px"}}>
                <Link to={{pathname: `/provisional_cashflow/${company_id}`}} style={{color:"white"}}>Provisional Cashflow for the period.</Link></center>
              </div>
            </div>
            <div className="col-md-5 shadow card text-white" style={{marginLeft:"4%",height:"100px",backgroundColor:"#3B4054"}}>
              <div className="card-body"><center style={{marginTop:"21px"}}>
               <Link to={{pathname: `/DebtorsAgeing/${company_id}`}} style={{color:"white"}}>Debtors Ageing Report For The Period.</Link></center>
              </div>
            </div>
            </div>

                   <div className="row" style={{marginLeft:"3%"}}>

            <div className="col-md-5 shadow card text-white" style={{marginLeft:"4%",height:"100px",backgroundColor:"#3B4054"}}>
              <div className="card-body"><center style={{marginTop:"21px"}}>
               <Link to={{pathname: `/CreditorsAgeing/${company_id}`}} style={{color:"white"}}>Creditors Ageing Report For The Period.</Link></center>
              </div>
            </div>
            </div>




            </React.Fragment>
        );
    }
}

export default Msi;

