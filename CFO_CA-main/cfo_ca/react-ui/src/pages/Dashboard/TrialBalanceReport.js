import React, { Component } from 'react';
import { Row, Table, Col, Card, CardBody, CardTitle, Label, Button, Container, CardSubtitle } from "reactstrap";
import { Link } from "react-router-dom";
import "../../assets/css/style.css";

class TrialBalanceReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            abc_tog: [],
            trial_bal_report_data: []
        }
    }

    loadReportData = () => {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        };
        fetch(process.env.REACT_APP_BASEURL_BACKEND + "/reporting/notes/", requestOptions)
            .then(res => {
                if (res.status > 400) {
                    return console.log("Something went wrong")
                }
                return res.json()
            })
            .then(data => {
                console.log(data)
                this.setState({
                    trial_bal_report_data: data
                }, () => {
                    var i = 0;
                    while (i < this.state.trial_bal_report_data.length) {
                        this.setState({ abc_tog: this.state.abc_tog.concat([false]) })
                        ++i;
                    }
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    componentDidMount() {
        this.loadReportData()
    }

    render() {

        const { trial_bal_report_data, abc_tog } = this.state

        return (


            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        <Card>
                            <CardBody>
                                <CardTitle>Trial Balance Report</CardTitle>
                                <br />
                                <div className="table-responsive">
                                    {/*<button onClick={this.handleClick}> Open Software </button>*/}
                                    <Table className="table-bordered mb-0">

                                        <thead>
                                            <tr>
                                                <th>
                                                    <center>
                                                        Sr. No
                                                    </center>
                                                </th>
                                                <th>
                                                    <center>
                                                        Notes
                                                    </center>
                                                </th>
                                                <th>
                                                    <center>
                                                        Groups
                                                    </center>
                                                </th>
                                                <th>
                                                    <center>
                                                        Ledgers
                                                    </center>
                                                </th>
                                                <th>
                                                    <center>
                                                        Amount
                                                    </center>
                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody>

                                            {trial_bal_report_data != null && trial_bal_report_data.length > 0 ? trial_bal_report_data.map((note, index) => {

                                                return (
                                                    <>
                                                        <tr key={index} onClick={() => {
                                                            abc_tog[index] = !abc_tog[index];
                                                            this.setState({ abc_tog: abc_tog })
                                                        }}>
                                                            <th scope="row">{abc_tog[index] ? '-' : '+'} {index + 1}</th>
                                                            <td>{note.name}</td>
                                                            <td></td>
                                                            <td></td>
                                                            <td>{note.total_amount}</td>

                                                        </tr>

                                                        {note.custom_groups != null && note.custom_groups.length > 0 ? note.custom_groups.map((group, sub_index) => {
                                                            return (
                                                                <>

                                                                    {abc_tog[index] && (

                                                                        <tr >
                                                                            <th scope="row"></th>
                                                                            <td></td>
                                                                            <td>{group.name} {group.under !== null &&  
                                                                            <p>Under : {group.under.name} </p> }</td>
                                                                            <td></td>
                                                                            <td>{group.total_amount}</td>


                                                                        </tr>
                                                                    )}



                                                                    {group.ledger != null && group.ledger.length > 0 ? group.ledger.map((ledger_obj, sub_index) => {
                                                                        return (
                                                                            <>

                                                                                {abc_tog[index] && (

                                                                                    <tr >
                                                                                        <th scope="row"></th>
                                                                                        <td></td>
                                                                                        <td></td>
                                                                                        <td>{ledger_obj.name}</td>
                                                                                        <td>{ledger_obj.opening_balance}</td>

                                                                                    </tr>
                                                                                )}
                                                                            </>
                                                                        )
                                                                    })
                                                                        :
                                                                        <></>

                                                                    }
                                                                </>
                                                            )
                                                        })
                                                            :
                                                            <></>

                                                        }
                                                    </>
                                                )

                                            })
                                                :
                                                <></>
                                            }

                                        </tbody>
                                    </Table>
                                </div>

                            </CardBody>
                        </Card>


                    </Container>
                </div>
            </React.Fragment >
        );
    }
}

export default TrialBalanceReport;