import React, { Component } from 'react';
import { Container, Row, Col, Card, Alert, CardBody, Media, Button } from "reactstrap";
import '../../../src/assets/css/profile.css'

// availity-reactstrap-validation
import { AvForm, AvField } from 'availity-reactstrap-validation';

// Redux
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

//Import Breadcrumb
import Breadcrumb from '../../components/Common/Breadcrumb';

import avatar from '../../assets/images/users/avatar-1.jpg';
// actions
import { editProfile } from '../../store/actions';

class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = { email: "", name: ""}

        // handleValidSubmit
        this.handleValidSubmit = this.handleValidSubmit.bind(this);
    }

    // handleValidSubmit
    handleValidSubmit(event, values) {
        this.props.editProfile(values);
    }

    componentDidMount() {
        const user = JSON.parse(localStorage.getItem("authUser"));
        this.setState({
            'role':user.role,
            'email': user.email,
            'name': user.first_name + " " + user.last_name,
            'user_type': user.user_type
        })
      
    }

    render() {

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                        {/* Render Breadcrumb */}
                        <Breadcrumb breadcrumbItem="Profile" />

                        <Row>
                            <Col lg="12">
                                {this.props.error && this.props.error ? <Alert color="danger">{this.props.error}</Alert> : null}
                                {this.props.success && this.props.success ? <Alert color="success">{this.props.success}</Alert> : null}
                               
                                <div className="p-5 ml-auto mr-auto main-div"></div>
                                <div  className="avatar-lg profile-user-wid ml-auto mr-auto" >
                                                    <span className="avatar-title rounded-circle">
                                                    <img src={avatar} alt="" className="avatar-lg rounded-circle img-thumbnail icon"
                                                     />
                                                    </span>
                                                </div>
                                <Card className="overflow-hidden box ml-auto mr-auto">
                                    <CardBody className="box-2">
                                    
                                        <div className="p-2 mt-5" >
                                        <div>
                                            <Media body className="align-self-center">
                                                <div className="text-muted text-center ">
                                                    <h4 className="font-weight-bold">{this.state.name}</h4>
                                                    <p className="">{this.state.email}</p>
                                                    <p>{this.state.user_type}</p>
                                                </div>
                                            </Media>
                                            </div>
                                        
                                        </div>
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
const mapStatetoProps = state => {
    const { error,success } = state.Profile;
    return { error,success };
}

export default withRouter(connect(mapStatetoProps, { editProfile })(UserProfile));


