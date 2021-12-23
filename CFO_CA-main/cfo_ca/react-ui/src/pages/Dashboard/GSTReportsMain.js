import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Button, Container,NavItem, NavLink,TabPane, CardText,CardSubtitle, CardTitle, Nav, TabContent} from "reactstrap";
import { Link } from "react-router-dom";
import "./table_border.css";
import LoadingComponent from './loadingComponent';
import GST1Table from './GST1Table';
import Report1 from './Report1';
import Report2 from './Report2';
import Report3 from './Report3';
import Report4 from './Report4';
import Report5 from './Report5';
import Report6 from './Report6';
import classnames from "classnames";
 import Delayed from './Delayed';

const TableCss={
    border:"1px solid black"
}

class GSTReportsMain extends Component {
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
                                                             <Report1 company_id ={this.props.match.params.company_id} />
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
														    <Report2 company_id ={this.props.match.params.company_id} />
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
															<Report3 company_id ={this.props.match.params.company_id} />
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
															<Report4 company_id ={this.props.match.params.company_id} />
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
															<Report5 company_id ={this.props.match.params.company_id} />
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
															<Report6 company_id ={this.props.match.params.company_id} />
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

export default GSTReportsMain;