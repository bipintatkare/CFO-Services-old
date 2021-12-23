import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Button, Container,NavItem, NavLink,TabPane, CardText,CardSubtitle, CardTitle, Nav, TabContent} from "reactstrap";
import { Link } from "react-router-dom";
import "./table_border.css";
import LoadingComponent from './loadingComponent';
import GST1Table from './GST1Table';
import PurchaseReport1 from './PurchaseReport1';
import PurchaseReport2 from './PurchaseReport2';
import PurchaseReport3 from './PurchaseReport3';
import PurchaseReport4 from './PurchaseReport4';
import PurchaseReport5 from './PurchaseReport5';
import PurchaseReport6 from './PurchaseReport6';
import classnames from "classnames";
 import Delayed from './Delayed';

const TableCss={
    border:"1px solid black"
}

class PurchaseGSTReportsMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            activeTabJustify: "1",
        }
        this.toggleCustomJustified = this.toggleCustomJustified.bind(this);
    }

    toggleCustomJustified(tab) {
		if (this.state.activeTabJustify !== tab) {
			this.setState({
				activeTabJustify: tab
			});
		}
	}

    render() {
        const {data_received, loading} = this.state

        return (
            <React.Fragment>
             <div className="page-content">
                    <Container fluid>

                            <Row>

								<Col lg={12}>
								<Card>
									<CardBody>
										<CardTitle>GST Reports</CardTitle>
										<br/>

										<Nav tabs className="nav-tabs-custom nav-justified">
											<NavItem>
												<NavLink
													style={{ cursor: "pointer" }}
													className={classnames({
														active: this.state.activeTabJustify === "1"
													})}
													onClick={() => {
														this.toggleCustomJustified("1");
													}}
												>
													<span className="d-none d-sm-block">GSTR-1 Data</span>
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink
													style={{ cursor: "pointer" }}
													className={classnames({
														active: this.state.activeTabJustify === "2"
													})}
													onClick={() => {
														this.toggleCustomJustified("2");
													}}
												>
													<span className="d-none d-sm-block">Match Data</span>
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink
													style={{ cursor: "pointer" }}
													className={classnames({
														active: this.state.activeTabJustify === "3"
													})}
													onClick={() => {
														this.toggleCustomJustified("3");
													}}
												>
													<span className="d-none d-sm-block">Date Mis-Match</span>
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink
													style={{ cursor: "pointer" }}
													className={classnames({
														active: this.state.activeTabJustify === "4"
													})}
													onClick={() => {
														this.toggleCustomJustified("4");
													}}
												>
													<span className="d-none d-sm-block">Taxable Value Mis-Match </span>
												</NavLink>
											</NavItem>
											<NavItem>
												<NavLink
													style={{ cursor: "pointer" }}
													className={classnames({
														active: this.state.activeTabJustify === "5"
													})}
													onClick={() => {
														this.toggleCustomJustified("5");
													}}
												>
													<span className="d-none d-sm-block">Not Booked</span>
												</NavLink>
											</NavItem>

											<NavItem>
												<NavLink
													style={{ cursor: "pointer" }}
													className={classnames({
														active: this.state.activeTabJustify === "6"
													})}
													onClick={() => {
														this.toggleCustomJustified("6");
													}}
												>
													<span className="d-none d-sm-block">Not Uploaded</span>
												</NavLink>
											</NavItem>

											<NavItem>
												<NavLink
													style={{ cursor: "pointer" }}
													className={classnames({
														active: this.state.activeTabJustify === "7"
													})}
													onClick={() => {
														this.toggleCustomJustified("7");
													}}
												>
													<span className="d-none d-sm-block">B2C In Tally</span>
												</NavLink>
											</NavItem>

										</Nav>

										<TabContent activeTab={this.state.activeTabJustify}>
											<TabPane tabId="1" className="p-3">
												<Row>
													<Col sm="12">
														<CardText>
															<GST1Table company_id ={this.props.match.params.company_id} />
                          								</CardText>
													</Col>
												</Row>
											</TabPane>
											<TabPane tabId="2" className="p-3">
												<Row>
													<Col sm="12">
														<CardText>
														<Delayed waitBeforeShow={10000}>
                                                             <PurchaseReport1 company_id ={this.props.match.params.company_id} />
                                                        </Delayed>

                          								</CardText>
													</Col>
												</Row>
											</TabPane>
											<TabPane tabId="3" className="p-3">
												<Row>
													<Col sm="12">
														<CardText>
														<Delayed waitBeforeShow={13000}>
														    <PurchaseReport2 company_id ={this.props.match.params.company_id} />
														</Delayed>

                          								</CardText>
													</Col>
												</Row>
											</TabPane>

											<TabPane tabId="4" className="p-3">
												<Row>
													<Col sm="12">
														<CardText>
														<Delayed waitBeforeShow={16000}>
															<PurchaseReport3 company_id ={this.props.match.params.company_id} />
														</Delayed>
                          								</CardText>
													</Col>
												</Row>
											</TabPane>

											<TabPane tabId="5" className="p-3">
												<Row>
													<Col sm="12">
														<CardText>
														<Delayed waitBeforeShow={19000}>
															<PurchaseReport4 company_id ={this.props.match.params.company_id} />
														</Delayed>
                          								</CardText>
													</Col>
												</Row>
											</TabPane>

											<TabPane tabId="6" className="p-3">
												<Row>
													<Col sm="12">
														<CardText>
														<Delayed waitBeforeShow={12000}>
															<PurchaseReport5 company_id ={this.props.match.params.company_id} />
														</Delayed>
                          								</CardText>
													</Col>
												</Row>
											</TabPane>

											<TabPane tabId="7" className="p-3">
												<Row>
													<Col sm="12">
														<CardText>
														<Delayed waitBeforeShow={15000}>
															<PurchaseReport6 company_id ={this.props.match.params.company_id} />
														</Delayed>
                          								</CardText>
													</Col>
												</Row>
											</TabPane>

										</TabContent>
									</CardBody>
								</Card>
							</Col>
							</Row>

                </Container>
             </div>
            </React.Fragment>
        );
    }
}

export default PurchaseGSTReportsMain;