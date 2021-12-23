import React from "react";
import { Redirect } from "react-router-dom";

// Pages Component
import Chat from "../pages/Chat/Chat";
import Tables from "../pages/Dashboard/Msipage";
import ProvisinalCashflow from "../pages/Dashboard/provisional_cashflow";
import ManagerView from "../pages/Dashboard/Manager";
import FinancialD from "../pages/Dashboard/Financial_dashboard";
import Liquidity from "../pages/Dashboard/Liquidity";
import Funds_flow from "../pages/Dashboard/Fund_flow";
import DebtorsAgeing from "../pages/Dashboard/DebtorsAgeing";
import CreditorsAgeing from "../pages/Dashboard/CreditorsAgeing";
import Add_manager from "../pages/Dashboard/Add_manager";
import ProfitAndLoss from "../pages/Dashboard/ProfitandLoss";
import BalanceTab from "../pages/Dashboard/BalanceSheettab";
import Trailbalance from "../pages/Dashboard/Trailbalance";
import OpenCard from "../pages/Dashboard/CardOpen";
import Farintsol from "../pages/Dashboard/Farintsol";
import Atms from "../pages/Dashboard/Atms";
import Farinsolcard from "../pages/Dashboard/farintsolcard";
import CompanyDetails from "../pages/Dashboard/company_details";
import AtmsCard from "../pages/Dashboard/Atmscard";
import EmailCard from "../pages/Dashboard/emailtocompany";
import TableToHtml from "../pages/Dashboard/trialcode/tabletohtml";
import TableCollapse from "../pages/Dashboard/CompanyDetailTables/TableCollapse";
import GST1 from "../pages/Dashboard/GST1";
import GST1Table from "../pages/Dashboard/GST1Table";
import GSTSummary from "../pages/Dashboard/GSTSummary";

import CompanyMapping from "../pages/Dashboard/CompanyMapping";
import ComMappingGrpList from "../pages/Dashboard/ComMappingGrpList";

//MOM
import momMain from "../pages/MOM/MinutesOfMeeting";
import GSTReportsMain from "../pages/Dashboard/GSTReportsMain";
import PurchaseGSTReportsMain from "../pages/Dashboard/PurchaseGSTReportsMain";
import ThreadHome from "../pages/MOM/ThreadHome";
import MeetingHome from "../pages/MOM/MeetingsHome";
import ThreadForm from "../pages/MOM/ThreadForm";
import MeetingForm from "../pages/MOM/MeetingForm";
import MeetingDetails from "../pages/MOM/MeetingDetails";
import ThreadWiseTask from "../pages/MOM/ThreadWiseTask";
import TaskForm from "../pages/MOM/TaskForm";
import MeetingReport from "../pages/MOM/MeetingReport";
import Report from '../pages/MOM/Report';

import Report1 from "../pages/Dashboard/Report1";
import Report2 from "../pages/Dashboard/Report2";
import Report3 from "../pages/Dashboard/Report3";
import Report4 from "../pages/Dashboard/Report4";
import Report5 from "../pages/Dashboard/Report5";
import CFOMailTable from "../pages/Dashboard/CFOMailTable";

import TrialBalanceMapping from "../pages/Dashboard/TrialBalanceMapping";
import AddDropdownContentTB from "../pages/Dashboard/AddDropdownContentTB";
import AddReportsNotes from "../pages/Dashboard/AddReport_Notes";
import TBColapseableTable from "../pages/Dashboard/TBColapseableTable";

//tdl scripts
import TDLScriptsHome from "../pages/TDL-Scripts/TDLScriptsHome";


// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import UpdatePasswordPage from "../pages/Authentication/UpdatePassword";
import TaskClosure from "../pages/Authentication/TaskClosure";

// Inner Authentication
import Login1 from "../pages/AuthenticationInner/Login";
import Register1 from "../pages/AuthenticationInner/Register";
import ForgetPwd1 from "../pages/AuthenticationInner/ForgetPassword";
import LockScreen from "../pages/AuthenticationInner/auth-lock-screen";

// Dashboard
import Dashboard from "../pages/Dashboard/index";
import SyncHistory from "../pages/Dashboard/SyncHistory";
import DashboardSaas from "../pages/Dashboard-saas/index";
import DashboardCrypto from "../pages/Dashboard-crypto/index";


//Company Detail Collapseable Tables
import Groups from "../pages/Dashboard/CompanyDetailTables/Groups";
import VoucherTypes from "../pages/Dashboard/CompanyDetailTables/VoucherTypes";
import Ledgers from "../pages/Dashboard/CompanyDetailTables/Ledgers";


//Pages
import PagesMaintenance from "../pages/Utility/pages-maintenance";
import PagesComingsoon from "../pages/Utility/pages-comingsoon";
import Pages404 from "../pages/Utility/pages-404";
import Pages500 from "../pages/Utility/pages-500";



//Other
import TryTable from "../pages/Dashboard/tryTable";
import TaskHome from "../pages/MOM/TaskHome";
import UserProfile from "../pages/Authentication/UserProfile";

import ReportList from "../pages/Dashboard/Report Table/ReportList";
import TrialBalanceReport from "../pages/Dashboard/TrialBalanceReport";
import ProfitNLoss from "../pages/Dashboard/ProfitNLoss";
import BalanceNSheet from "../pages/Dashboard/BalanceNSheet";
import LedgerQueryHome from "../pages/TDL-Scripts/LedgerQueryHome";
import VoucherQueryHome from "../pages/TDL-Scripts/VouchersQueryHome";

const authProtectedRoutes = [

    { path: "/dashboard", component: Dashboard },
	{ path: "/table-to-html", component: TableToHtml },
	{ path: "/gst-summary", component: GSTSummary },
	{ path: "/company-mapping", component: CompanyMapping },
	{ path: "/comp-grp-list", component: ComMappingGrpList },


	{ path: "/mom-main", component: momMain },
	{ path: "/update-meeting/:meeting_id", component: MeetingForm },
	{ path: "/create-meeting", component: MeetingForm },
	{ path: "/detail-meeting/:meeting_id", component: MeetingDetails },
	{ path: "/thread-home", component: ThreadHome },
	{ path: "/meeting-home", component: MeetingHome },
	{ path: "/update-thread/:thread_id", component: ThreadForm },
	{ path: "/create-thread", component: ThreadForm },
	{ path: "/task-home", component: TaskHome },
	{ path: "/thread-wise-task/:thread_id", component: ThreadWiseTask },
	{ path: "/task/:task_id", component: TaskForm },
	{ path: "/meeting-report/:meeting_id", component: MeetingReport },
	{ path: "/gst-reports-main/:company_id", component: GSTReportsMain },
	{ path: "/purchase-gst-reports-main/:company_id", component: PurchaseGSTReportsMain },
	{ path: "/report", component: Report },

	{ path: "/profile", component: UserProfile },

	{ path: "/table-collapse", component: TableCollapse },
	{ path: "/GST1/:company_id", component: GST1 },
	{ path: "/gst1-table/:company_id", component: GST1Table },
	{ path: "/syncHistory", component: SyncHistory },

	{ path: "/report-1/:company_id", component: Report1 },
	{ path: "/report-2/:company_id", component: Report2 },
	{ path: "/report-3/:company_id", component: Report3 },
	{ path: "/report-4/:company_id", component: Report4 },
	{ path: "/report-5/:company_id", component: Report5 },
	{ path: "/mail-table/:company_id", component: CFOMailTable },

	{ path: "/tdl-scripts-home", component: TDLScriptsHome },

	{ path: "/trial-balance-mapping", component: TrialBalanceMapping },
	{ path: "/add-dropdown-content", component: AddDropdownContentTB },
	{ path: "/add-reports-notes", component: AddReportsNotes },
	{ path: "/tb-collapseable-table", component: TBColapseableTable },
	{ path: "/ProfitNLoss", component: ProfitNLoss },

	{ path: "/dashboard-saas", component: DashboardSaas },
	{ path: "/dashboard-crypto", component: DashboardCrypto },

	//Company Detail Collapseable Tables
	{ path: "/company-groups", component: Groups },
	{ path: "/company-voucher-types", component: VoucherTypes },
	{ path: "/company-ledgers", component: Ledgers },

    { path: "/chat/:id", component: Chat },
	{ path: "/msipage", component: Tables },
	{ path: "/provisional_cashflow", component: ProvisinalCashflow },
	{ path: "/ManagerView", component: ManagerView },
	{ path: "/FinancialD/:id", component: FinancialD },
	{ path: "/Liquidity/:id", component: Liquidity },
	{ path: "/Funds_flow/:id", component: Funds_flow },
	{ path: "/DebtorsAgeing/:id", component: DebtorsAgeing },
	{ path: "/CreditorsAgeing/:id", component: CreditorsAgeing },
	{ path: "/Add_manager", component: Add_manager },
	{ path: "/ProfitAndLoss", component: ProfitAndLoss },
	{ path: "/BalanceTab", component: BalanceNSheet },
	{ path: "/Trailbalance", component: Trailbalance },
	{ path: "/OpenCard", component: OpenCard },
	{ path: "/Farintsol", component: Farintsol },
	{ path: "/Atms", component: Atms },
	{ path: "/Farinsolcard", component: Farinsolcard },
	{ path: "/CompanyDetails/:id", component: CompanyDetails },
	{ path: "/AtmsCard", component: AtmsCard },
	{ path: "/EmailCard", component: EmailCard },

	{ path: "/reportList", component: ReportList},
	{ path: "/trial-balance-report", component: TrialBalanceReport },
	{ path: "/ledger-query-home/:script_id", component: LedgerQueryHome},
	{ path: "/vouchers-query-home/:script_id", component: VoucherQueryHome },


	// this route should be at the end of all other routes
	{ path: "/", exact: true, component: () => <Redirect to="/dashboard" /> }
];

const publicRoutes = [
	{ path: "/logout", component: Logout },
	{ path: "/login", component: Login },
	{ path: "/forgot-password", component: ForgetPwd },
	{ path: "/register", component: Register },
	{ path: "/change-password/:user_id", component: UpdatePasswordPage },

	{ path: "/pages-maintenance", component: PagesMaintenance },
	{ path: "/pages-comingsoon", component: PagesComingsoon },
	{ path: "/pages-404", component: Pages404 },
	{ path: "/pages-500", component: Pages500 },

	// Authentication Inner
	{ path: "/pages-login", component: Login1 },
	{ path: "/pages-register", component: Register1 },
	{ path: "/pages-forgot-pwd", component: ForgetPwd1 },
	{ path: "/auth-lock-screen", component: LockScreen },

	{ path: "/task-closure/:task_id", component: TaskClosure },

];

export { authProtectedRoutes, publicRoutes };
