import React, { Component,useState  } from 'react';
import { Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css';
import "./loadComponent.css";
import loading from "../../assets/images/loading.gif";



const LoadingComponent =()=>{
return(
    <div className='loader-main'>

        <div className="loading-component">
            <img src={loading} className="loader"/>
        </div>




    </div>
    );
    }

export default LoadingComponent;