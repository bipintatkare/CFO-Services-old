import React,{Component} from 'react';
import Collapsible from 'react-collapsible';

const Grater_than="<";
const Smaller_than=">";

const tableborder = {
    td:{
            border:"1px solid black" }
        }


class Collaps extends Component {
    constructor() {
        super();

        this.state = {
            data : [
                {'id': 781, 'customer_name': 'Aaiji Trading Company', 'data_sum': '-45000.00'},
                 {'id': 732, 'customer_name': 'ACROSS INDIA', 'data_sum': '63178.00'},
            ],
            expandedRows : []
        };
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

        fetch("/api/v1/mis_dar/"+`${this.props.company_id}`, lookups)
        .then(res => {
            if(res.status > 400){
                return console.log("Something went wrong")
            }
            return res.json()
        })
        .then(res => {
            console.log("response recruiter list", res)
            return this.setState({
                data : res
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

        componentDidMount(){
        this.load_companies()
    }

    handleRowClick(rowId) {
        const currentExpandedRows = this.state.expandedRows;
        const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);

        const newExpandedRows = isRowCurrentlyExpanded ?currentExpandedRows.filter(id => id !== rowId) : currentExpandedRows.concat(rowId);

        this.setState({expandedRows : newExpandedRows});
    }

    renderItem(item) {
        const clickCallback = () => this.handleRowClick(item.id);
        const itemRows = [

                          <tr onClick={clickCallback} key={"row-data-" + item.id}>
                                <td style={{width:"15%"}} style={tableborder.td}><center>{item.customer_name}</center></td>
                                <td style={{width:"15%"}} style={tableborder.td}><center>{item.data_sum}</center></td>
                                <td style={{width:"15%"}} style={tableborder.td}><center>{item.status}</center></td>
                                <td style={{width:"15%"}} style={tableborder.td}><center>{item.name}</center></td>
                                <td style={{width:"15%"}} style={tableborder.td}><center>{item.points}</center></td>
                                <td style={{width:"15%"}} style={tableborder.td}><center>{item.percent}</center></td>
                          </tr>
                            ];

        if(this.state.expandedRows.includes(item.id)) {
            itemRows.push(
                <tr key={"row-expanded-" + item.id}>
                <td style={{width:"15%"}} style={tableborder.td}>{item.customer_name}</td>
                <td style={{width:"15%"}} style={tableborder.td}>{item.data_sum}</td>
                <td style={{width:"15%"}} style={tableborder.td}>{item.status}</td>
                <td style={{width:"15%"}} style={tableborder.td}>{item.name}</td>
                <td style={{width:"15%"}} style={tableborder.td}>{item.points}</td>
                <td style={{width:"15%"}} style={tableborder.td}>{item.percent}</td>
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

export default Collaps;