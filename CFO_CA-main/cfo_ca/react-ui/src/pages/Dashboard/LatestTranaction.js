import React, { Component } from "react";

import { Card, CardBody, CardTitle, Badge, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { Friends } from "./CompanyName"
import cookie from "react-cookies"


class LatestTranaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companies: [],
            recruiter_name: "",
            redirect: false,
            recruiter_id: "1"
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

        fetch("/api/v1/company_list/", lookups)
            .then(res => {
                if (res.status > 400) {
                    return console.log("Something went wrong")
                }
                return res.json()
            })
            .then(res => {
                console.log("response recruiter list", res)
                return this.setState({
                    companies: res
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleClick = (id) => {
        return this.setState({
            redirect: true,
            recruiter_id: id
        })
    }

    componentDidMount() {
        this.load_companies()
    }

    downloadApplication() {
        fetch("")
            .then(res => {
                if (res.status > 400) {
                    return console.log("Something went wrong")
                }
            })
            .catch(err => {
                console.log(err)
            })
    }



    render() {
        const { companies } = this.state
        return (
            <React.Fragment>
                <div className="text-right">
                    <button type="button" class="btn btn-dark">Open Software</button>
{' '}
                    <button type="button" class="btn btn-dark"><a href='http://65.2.146.150:8000/api/v1/download-application/' target="_blank"> Download Software </a></button>
                </div>
                <br />
                {companies != null && companies.length > 0 ? companies.map((companyItem, index) => {
                    return (
                        <Link to={{ pathname: `/CompanyDetails/${companyItem.id}` }}><Card className="row" style={{ marginBottom: "10px" }}>
                            <CardBody className="shadow-lg list-group-item col-md-12" style={{ padding: "15px" }}>
                                <div className="row">
                                    <div className="col-md-6 font-weight-bold"><p>{companyItem.company_name}</p></div>
                                    <div className="col-md-4 font-weight-bold">Last Sync {companyItem.sync_timedate}</div>
                                    <Link to={{ pathname: `/chat/${companyItem.id}` }}>
                                        <button type="button" class="btn btn-secondary" style={{ padding: "10px" }}>MIS</button>
                                    </Link>
                                    <div style={{ padding: "1%" }}></div>
                                    <Link to="ManagerView">
                                        <button type="button" class="btn btn-secondary">Manager</button>
                                    </Link>
                                </div>
                            </CardBody>

                        </Card>
                        </Link>
                    )
                })
                    : <Link to={{ pathname: `/CompanyDetails/1` }}>

                        <Card className="row" style={{ marginBottom: "10px" }} >
                            <CardBody className="shadow-lg list-group-item col-md-12" style={{ padding: "15px" }}>
                                <div className="row">
                                    <div className="col-md-6 font-weight-bold"><p>companyItem.company_name</p></div>
                                    <div className="col-md-4 font-weight-bold">Last Sync companyItem.auto_timedate</div>
                                    <Link to={{ pathname: `/chat/28` }}>
                                        <button type="button" class="btn btn-secondary">MIS</button>
                                    </Link>
                                    <div style={{ padding: "1%" }}></div>
                                    <Link to="ManagerView">
                                        <button type="button" class="btn btn-secondary">Manager</button>
                                    </Link>
                                </div>
                            </CardBody>

                        </Card>
                    </Link>
                }





            </React.Fragment>
        );
    }
}

export default LatestTranaction;
