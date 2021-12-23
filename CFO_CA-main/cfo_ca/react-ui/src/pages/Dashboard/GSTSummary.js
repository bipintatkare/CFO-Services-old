import React, { Component } from 'react';
import { Row, Table, Col, Card, CardBody, CardTitle, Label, Button, Container, CardSubtitle } from "reactstrap";
import { Link } from "react-router-dom";
import "../../assets/css/style.css";

class GSTSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            abc_tog: [],

        }
        this.handleClick = this.handleClick.bind(this);

    }


    handleClick() {
        window.open('file:///C:/Windows/notepad.exe')
    }

    load_data = () => {
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

        fetch(process.env.REACT_APP_BASEURL_BACKEND+"/api/v1/gst_summary/39", lookups)
            .then(res => {
                if (res.status > 400) {
                    return console.log("Something went wrong")
                }
                return res.json()
            })
            .then(res => {
                console.log("response recruiter list", res[0]['main_obj_list'])
                this.setState({
                    data: res[0]['main_obj_list'],

                })
                var i = 0;
                while (i < this.state.data.length) {
                    this.setState({ abc_tog: this.state.abc_tog.concat([false]) })
                    ++i;
                }
                return this.setState({

                    loading: false,
                    company_id: "39",
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    componentDidMount() {
        this.load_data()
    }

    render() {

        const data_received = this.state.data
        const { abc_tog } = this.state

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        <Card>
                            <CardBody>
                                <CardTitle>GST Summary</CardTitle>
                                <br />
                                <div className="table-responsive">
                                    {/*<button onClick={this.handleClick}> Open Software </button>*/}
                                    <Table className="table-bordered mb-0">

                                        <thead>
                                            <tr>
                                                <th colspan="10" >
                                                    <center>
                                                        Tally
                                                            </center>
                                                </th>
                                                <th colspan="8">
                                                    <center>
                                                        Portal
                                                            </center>
                                                </th>
                                                <th colspan="4">
                                                    <center>
                                                        Difference
                                                            </center>
                                                </th>
                                            </tr>
                                            <tr>

                                                <th>Sr No </th>
                                                <th>Name Of Dealer </th>
                                                <th> GSTIN</th>
                                                <th> Invoice Date</th>
                                                <th>Invoice Number </th>
                                                <th> Taxable Value</th>
                                                <th>CGST </th>
                                                <th>SGST </th>
                                                <th>IGST </th>
                                                <th>CESS </th>
                                                <th> Total Value</th>

                                                <th> Invoice Date</th>
                                                <th>Invoice Number </th>
                                                <th> Taxable Value</th>
                                                <th>CGST </th>
                                                <th>SGST </th>
                                                <th>IGST </th>
                                                <th>CESS </th>
                                                <th> Total Value</th>


                                                <th>CGST </th>
                                                <th>SGST </th>
                                                <th>IGST </th>
                                                <th>CESS </th>

                                            </tr>
                                        </thead>
                                        <tbody>

                                            {data_received != null && data_received.length > 0 ? data_received.map((Item, index) => {

                                                return (
                                                    <>
                                                        <tr key={index} onClick={() => {
                                                            abc_tog[index] = !abc_tog[index];
                                                            this.setState({ abc_tog: abc_tog })
                                                        }

                                                        }>
                                                            <th scope="row">{abc_tog[index] ? '-' : '+'} {index + 1}</th>
                                                            <td>{Item.customer_billing_name}</td>
                                                            <td>{Item.gst_no}</td>
                                                            <td>{Item.inv_date}</td>
                                                            <td>{Item.inv_no}</td>
                                                            <td>{Item.txval}</td>
                                                            <td>{Item.camt}</td>
                                                            <td>{Item.samt}</td>
                                                            <td>{Item.iamt}</td>
                                                            <td>{Item.cess}</td>
                                                            <td></td>
                                                            <td>{Item.inv_date}</td>
                                                            <td>{Item.inv_no}</td>
                                                            <td>{Item.txval_gst_file}</td>

                                                            <td>{Item.camt_gst_file}</td>
                                                            <td>{Item.samt_gst_file}</td>
                                                            <td>{Item.iamt_gst_file}</td>
                                                            <td>{Item.c_ess}</td>
                                                            <td></td>
                                                            <td>{Item.diff_cgst}</td>
                                                            <td>{Item.diff_sgst}</td>
                                                            <td>{Item.diff_igst}</td>
                                                            <td>{Item.diff_txval}</td>

                                                        </tr>

                                                        {Item.sub_item_list != null && Item.sub_item_list.length > 0 ? Item.sub_item_list.map((obj, sub_index) => {

                                                            return (
                                                                abc_tog[index] && (

                                                                    <tr >
                                                                        <th scope="row"></th>
                                                                        <td>{obj.customer_billing_name}</td>
                                                                        <td>{obj.gst_no}</td>
                                                                        <td>{obj.inv_date}</td>
                                                                        <td>{obj.inv_no}</td>
                                                                        <td>{obj.txval}</td>
                                                                        <td>{obj.camt}</td>
                                                                        <td>{obj.samt}</td>
                                                                        <td>{obj.iamt}</td>
                                                                        <td>{obj.cess}</td>
                                                                        <td></td>
                                                                        <td>{obj.gstr1_invoice__invoice_date}</td>
                                                                        <td>{obj.gstr1_invoice__invoice_no}</td>
                                                                        <td>{obj.txval_gst_file}</td>

                                                                        <td>{obj.c_amt}</td>
                                                                        <td>{obj.s_amt}</td>
                                                                        <td>{obj.i_amt}</td>
                                                                        <td>{obj.c_ess}</td>
                                                                        <td></td>
                                                                        <td>{obj.diff_cgst}</td>
                                                                        <td>{obj.diff_sgst}</td>
                                                                        <td>{obj.diff_igst}</td>
                                                                        <td>{obj.diff_txval}</td>
                                                                    </tr>

                                                                )

                                                            )
                                                        })
                                                            :
                                                            <></>
                                                        }
                                                    </>
                                                )
                                            })
                                                :
                                                <tr onClick={() => this.setState({ abc_tog: !abc_tog })}>
                                                    <th scope="row">{abc_tog ? '-' : '+'} 1</th>
                                                    <td>Markwe</td>
                                                    <td>Ottowewewe</td>
                                                    <td>@mdowewe</td>
                                                </tr>
                                            }
                                            {abc_tog && (

                                                <></>

                                            )}

                                        </tbody>
                                    </Table>
                                </div>

                            </CardBody>
                        </Card>


                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default GSTSummary;