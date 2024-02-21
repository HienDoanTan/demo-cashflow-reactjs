import Highcharts from 'highcharts';
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
            depth: 0,
            stacking: "normal",
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
    }
}
