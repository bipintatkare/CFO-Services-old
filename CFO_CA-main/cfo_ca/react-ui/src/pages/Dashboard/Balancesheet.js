import React,{Component} from 'react';
import Collapsible from 'react-collapsible';

const Grater_than="<";
const Smaller_than=">";

const tableborder = {
    td:{
            border:"1px solid black" }
        }


class Balancesheet extends Component {
    constructor() {
        super();

        this.state = {
           data : [
                {id : 1, date : "", total :"Notes" , status : " ", name : " As at March 31,20219 (Rs. in Lakhs) ", points:""  , percent : "As at March 31,2018 (Rs. in Lakh)" },
                {id : 2, date : "EQUITY AND LIABILITIES", total :"" , status : " ", name : " ", points:""  , percent : "" },
                {id : 3, date : "Shareholders' funds", total : 16, status : " ", name : "	1,429.87", points: " ", percent: "1,483.07"},
                {id : 4, date : "Share capital", total : 17, status : " ", name : "	951.09", points: " ", percent: 	"1,637.22"},
                {id : 5, date : "Reserves and surplus", total : 23, status : " ", name : "	951.09", points: " ", percent: 	"1,637.22"},
                {id : 6, date : "Non-current liabilities", total : 18, status : " ", name : "	157.68", points: " ", percent: "26.36"},
                {id : 7, date : "", total : "", status : " ", name : "	2,538.61", points: " ", percent: "3,146.65"},
                {id : 8, date : "", total : "", status : " ", name : "	2,538.61", points: " ", percent: "3,146.65"},
                {id : 9, date : "", total : "", status : " ", name : "	2,538.61", points: " ", percent: "3,146.65"},
                {id : 10, date : "", total : "", status : " ", name : "	2,538.61", points: " ", percent: "3,146.65"},
                {id : 11, date : "", total : "", status : " ", name : "	2,538.61", points: " ", percent: "3,146.65"},
                {id : 12, date : "", total : "", status : " ", name : "	2,538.61", points: " ", percent: "3,146.65"},
                {id : 13, date : "Long-term provisions", total : "", status : " ", name : "	", points: " ", percent: " "},
                {id : 14, date : "Current liabilities", total : "0", status : " ", name : "	", points: " ", percent: " "},
                {id : 15, date : "Other current liabilities", total : "0", status : " 1,023.61", name : "	", points: " ", percent: "943.53"},
                {id : 16, date : "Short-term provisions", total : "21", status : " ", name : "1,023.61	", points: " ", percent: "1,635.20"},
                {id : 17, date : "Depreciation & Amortisation Expenses", total : "21", status : " ", name : "1,023.61	", points: " ", percent: "1,635.20"},
                {id : 18, date : "Finance Costs", total : "21", status : " ", name : "1,023.61	", points: " ", percent: "1,635.20"},
                {id : 19, date : "Foreign Exchange Fluctuation (Net)", total : "21", status : " ", name : "1,023.61	", points: " ", percent: "1,635.20"},
            ],
            expandedRows : []
        };
    }

    handleRowClick(rowId) {
        const currentExpandedRows = this.state.expandedRows;
        const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);

        const newExpandedRows = isRowCurrentlyExpanded ?
			currentExpandedRows.filter(id => id !== rowId) :
			currentExpandedRows.concat(rowId);

        this.setState({expandedRows : newExpandedRows});
    }

    renderItem(item) {
        const clickCallback = () => this.handleRowClick(item.id);
        const itemRows = [

                          <tr onClick={clickCallback} key={"row-data-" + item.id}>
                                    <td style={{width:"30%"}} style={tableborder.td}><center>{item.date}</center></td>
                                    <td style={{width:"15%"}} style={tableborder.td}><center>{item.total}</center></td>
                                    <td style={{width:"15%"}} style={tableborder.td}><center>{item.status}</center></td>
                                     <td style={{width:"15%"}} style={tableborder.td}><center>{item.name}</center></td>
                                     <td style={{width:"15%"}} style={tableborder.td}><center>{item.points}</center></td>
                                     <td style={{width:"15%"}} style={tableborder.td}><center>{item.percent}</center></td>
                                </tr>
                            ];

        if(this.state.expandedRows.includes(item.id)) {
            itemRows.push(
                <tr key={"row-expanded-" + item.id}>
                                     <td style={{width:"30%"}} style={tableborder.td}>{item.date}</td>
                                    <td style={{width:"15%"}} style={tableborder.td}>{item.total}</td>
                                    <td style={{width:"15%"}} style={tableborder.td}>{item.status}</td>
                                     <td style={{width:"15%"}} style={tableborder.td}>{item.name}</td>
                                     <td style={{width:"15%"}} style={tableborder.td}>{item.points}</td>
                                     <td style={{width:"10%"}} style={tableborder.td}>{item.percent}</td>
                </tr>
            );
        }

        return itemRows;
    }

    render() {
        let allItemRows = [];

        this.state.data.forEach(item => {
            const perItemRows = this.renderItem(item);
            allItemRows = allItemRows.concat(perItemRows);
        });

        return (
			     <table className="table table table-bordered">{allItemRows}</table>
        );
    }
}

export default Balancesheet;