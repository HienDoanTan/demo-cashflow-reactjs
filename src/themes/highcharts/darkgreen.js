import Highcharts from 'highcharts';
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
            depth: 0,
            stacking: "normal",
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
    }
}
