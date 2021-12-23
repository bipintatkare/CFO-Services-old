import React, { Component } from "react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withNamespaces } from 'react-i18next';

class SidebarContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.initMenu();
    }

    componentDidUpdate(prevProps) {
        if (this.props.type !== prevProps.type) {
            this.initMenu();
        }
    }

    initMenu() {
        new MetisMenu("#side-menu");

        var matchingMenuItem = null;
        var ul = document.getElementById("side-menu");
        var items = ul.getElementsByTagName("a");
        for (var i = 0; i < items.length; ++i) {
            if (this.props.location.pathname === items[i].pathname) {
                matchingMenuItem = items[i];
                break;
            }
        }
        if (matchingMenuItem) {
            this.activateParentDropdown(matchingMenuItem);
        }
    }

    activateParentDropdown = item => {
        item.classList.add("active");
        const parent = item.parentElement;

        if (parent) {
            parent.classList.add("mm-active");
            const parent2 = parent.parentElement;

            if (parent2) {
                parent2.classList.add("mm-show");

                const parent3 = parent2.parentElement;

                if (parent3) {
                    parent3.classList.add("mm-active"); // li
                    parent3.childNodes[0].classList.add("mm-active"); //a
                    const parent4 = parent3.parentElement;
                    if (parent4) {
                        parent4.classList.add("mm-active");
                    }
                }
            }
            return false;
        }
        return false;
    };

    render() {
        return (
            <React.Fragment>
                <div id="sidebar-menu">
                    <ul className="metismenu list-unstyled" id="side-menu">
                        <li className="menu-title">{this.props.t('Home')}</li>
                        <li>
                            <Link to="/dashboard" className="waves-effect">
                                <i className="bx bx-home-circle"></i>
                                <span>{this.props.t('Dashboard')}</span>
                            </Link>
                        </li>

                        <li className="menu-title">{this.props.t('Apps')}</li>

                        <li>
                            <Link to="/ManagerView" className=" waves-effect">
                                <i className="fa fa-user"></i>
                                <span>{this.props.t('Managers')}</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/chat" className=" has-arrow waves-effect">
                                <i className="fa fa-bar-chart"></i>
                                <span className="badge badge-pill badge-success float-right">{this.props.t('')}</span>
                                <span>{this.props.t('MIS')}</span>
                            </Link>
                            <ul className="sub-menu" aria-expanded="false">
                                <li><Link to="/FinancialD/28">{this.props.t('Financial Dashboard')}</Link></li>
                                <li><Link to="/Liquidity/28">{this.props.t('Liquidity Barometer')}</Link></li>
                                <li><Link to="/msipage/28">{this.props.t('Profit & Loss Account')}</Link></li>
                                <li><Link to="/Funds_flow/28">{this.props.t('Fund Flow Statement')}</Link></li>
                                <li><Link to="/provisional_cashflow/28">{this.props.t('Provisional Cashflow')}</Link></li>
                                <li><Link to="/DebtorsAgeing/28">{this.props.t('Debtors Ageing Report')}</Link></li>
                                <li><Link to="/CreditorsAgeing/28">{this.props.t('Creditors Ageing Report')}</Link></li>

                            </ul>
                        </li>

                        <li>
                            {/* <Link to="/Trailbalance" className="waves-effect"> */}
                            <Link to="/trial-balance-mapping" className="waves-effect">
                                <i className="bx bx-receipt"></i>
                                <span>{this.props.t('Trial Balance')}</span>
                            </Link>
                        </li>



                        <li>
                            <Link to="/BalanceTab" className="waves-effect">
                                <i className="bx bx-receipt"></i>
                                <span>{this.props.t('Balance Sheet')}</span>
                            </Link>
                        </li>



                        <li>
                            <Link to="/ProfitNLoss" className="waves-effect">
                                <i className="bx bx-task"></i>
                                <span>{this.props.t('Profit And Loss')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/syncHistory" className="waves-effect">
                                <i className="bx bx-task"></i>
                                <span>{this.props.t('Sync History')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/EmailCard" className="waves-effect">
                                <i className="bx bx-task"></i>
                                <span>{this.props.t('Schedule Email')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/gst1/39" className="waves-effect">
                                <i className="bx bx-file"></i>
                                <span>{this.props.t('GST Reports')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={{ pathname: `/mail-table/39` }} className="waves-effect">
                                <i className="bx bx-file"></i>
                                <span>{this.props.t('Crucial Numbers')}</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/gst-summary" className="waves-effect">
                                <i className="bx bx-file"></i>
                                <span>{this.props.t('GST Summary')}</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/mom-main" className="waves-effect">
                                <i className="bx bx-file"></i>
                                <span>{this.props.t('Minutes Of Meeting')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/tdl-scripts-home" className="waves-effect">
                                <i className="bx bx-file"></i>
                                <span>{this.props.t('TDL Scripts')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/company-mapping" className="waves-effect">
                                <i className="bx bx-file"></i>
                                <span>{this.props.t('Company Mapping')}</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/comp-grp-list" className="waves-effect">
                                <i className="bx bx-file"></i>
                                <span>{this.props.t('Company Group')}</span>
                            </Link>
                        </li>


                    </ul>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(withNamespaces()(SidebarContent));
