import Highcharts from 'highcharts';
import {colorOptions} from "../../config/colors_config.json";
export default Highcharts.theme = {
    chart: {
        backgroundColor: "#141414", //"#323546",
    },
    title: {
        style: {
            color: '#ffffff'
        }
    },
    plotOptions: {
        column: {
            depth: 0
        }
    },
    xAxis: {
        labels: {
            skew3d: true,
            style: {
                fontSize: "11px",
                color: '#fff'
            }
        },
        gridLineColor: '#666666'
    },
    yAxis:{
        labels: {
            style: {
                color: '#fff'
            }
        },
        gridLineColor: '#666666'
    },
    credits: {
        enabled: false
    },
    colorAxis: [
        {
            gridLineColor: "rgb(0, 21, 41)"
        }
    ],
    legend: {
        itemStyle: {
            color: '#fff'
        }
    },
    colors: [
        colorOptions.income,
        colorOptions.expense,
        colorOptions.saving
    ],
}
