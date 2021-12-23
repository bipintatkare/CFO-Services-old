import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col, UncontrolledTooltip, Button, Media, UncontrolledDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Nav, NavItem, NavLink, TabContent, TabPane, Card, Form, FormGroup, InputGroup, InputGroupAddon } from "reactstrap";
import classnames from 'classnames';

//Import Scrollbar
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

//Import Images
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../assets/images/users/avatar-4.jpg";
import avatar6 from "../../assets/images/users/avatar-6.jpg";
import Msi from "../Dashboard/msi";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };

    }



    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                    <Msi company_id={this.props.match.params.id} />
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default Chat;