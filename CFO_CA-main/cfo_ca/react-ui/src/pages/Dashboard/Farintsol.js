import React, { Component } from "react";

import { Card, CardBody, CardTitle, Badge, Button } from "reactstrap";
import { Link } from "react-router-dom";



const Farintsol=()=>{
        return (
            <React.Fragment>
            <center style={{marginTop:"10%",marginLeft:"3%"}}><h1>Farintsol</h1></center>
            <div className="row" style={{marginTop:"3%",marginLeft:"3%"}}>

            <div className="col-md-5 shadow card text-white" style={{marginLeft:"4%",height:"100px",backgroundColor:"#20639B"}}>
              <div className="card-body"><center style={{marginTop:"21px"}}>
                <Link to="FinancialD" style={{color:"white"}}>Financial Dashboard For Business Owners.</Link>
                </center>
              </div>
            </div>

            <div className="col-md-5 shadow card text-white" style={{marginLeft:"4%",height:"100px",backgroundColor:"#20639B"}}>
              <div className="card-body"><center style={{marginTop:"21px"}}>
                <Link to="Liquidity" style={{color:"white"}}>Liquidity Barometer Of Business.</Link></center>
              </div>
            </div>
            </div>
                        <div className="row" style={{marginLeft:"3%"}}>
            <div className="col-md-5 shadow card text-white" style={{marginLeft:"4%",height:"100px",backgroundColor:"#20639B"}}>
              <div className="card-body"><center style={{marginTop:"21px"}}>
               <Link to ="msipage" style={{color:"white"}}>Profit & Loss Account With Segmentation.</Link></center>
              </div>
            </div>
            <div className="col-md-5 shadow card text-white" style={{marginLeft:"4%",height:"100px",backgroundColor:"#20639B"}}>
              <div className="card-body"><center style={{marginTop:"21px"}}>
                <Link to="Funds_flow" style={{color:"white"}}>Fund Flow Statement For The Period.</Link></center>
              </div>
            </div>
            </div>
                        <div className="row" style={{marginLeft:"3%"}}>
            <div className="col-md-5 shadow card text-white" style={{marginLeft:"4%",height:"100px",backgroundColor:"#20639B"}}>
              <div className="card-body"><center style={{marginTop:"21px"}}>
                <Link to="provisional_cashflow" style={{color:"white"}}>Provisional Cashflow for the period.</Link></center>
              </div>
            </div>
            <div className="col-md-5 shadow card text-white" style={{marginLeft:"4%",height:"100px",backgroundColor:"#20639B"}}>
              <div className="card-body"><center style={{marginTop:"21px"}}>
               <Link to="DebtorsAgeing" style={{color:"white"}}>Debtors Ageing Report For The Period.</Link></center>
              </div>
            </div>
            </div>

            </React.Fragment>
        );
}

export default Farintsol;
