import Highcharts from 'highcharts';
import {colorOptions} from "../../config/colors_config.json";
export default Highcharts.theme = {
    chart: {
        backgroundColor: '#ffffff',
    },
    title: {
        style: {
            color: '#666666'
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
                color: '#666666'
            }
        },
        gridLineColor: '#ddd'
    },
    yAxis:{
        labels: {
            style: {
                color: '#666666'
            }
        },
        gridLineColor: '#ddd'
    },
    credits: {
        enabled: false
    },
    colorAxis: [
        {
            gridLineColor: "#ccc"
        }
    ],
    legend: {
        itemStyle: {
            color: '#666666'
        }
    },
    colors: [
        colorOptions.income,
        colorOptions.expense,
        colorOptions.saving
    ],
}
