export interface ChartType {
    chart?: any;
    countVal?: any;
    plotOptions?: any;
    colors?: any;
    series?: any;
    fill?: any;
    dataLabels?: any;
    legend?: any;
    xaxis?: any;
    yaxis?: any;
    stroke?: any;
    labels?: any;
    markers?: any;
    tooltip?: any;
    responsive?: any;

}

const lastaccidentchart: ChartType = {
    series: [0],
    chart: {
        height: 350,
        type: "radialBar"
    },
    plotOptions: {
        radialBar: {
            hollow: {
                size: "70"
            },

            dataLabels: {
                show: true,
                name: {
                    offsetY: -10,
                    show: true,
                    color: "#888",
                    fontSize: "17px"
                },
                value: {
                    formatter: function (val: any) {
                        return parseInt(val.toString(), 10).toString();
                    },
                    color: "#111",
                    fontSize: "36px",
                    show: true
                }
            }

        },

    },
    labels: ["Day since last Accident"],

};

const divisionCategoryChart: ChartType = {
    series: [],
    chart: {
        type: "bar",
        height: 350,
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: "55%",

        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
    },
    xaxis: {
        categories: []
    },
    yaxis: {
        title: {
            text: "Count"
        }
    },
    fill: {
        opacity: 1
    },
    tooltip: {
        y: {
            formatter: function (val: any) {
                return "Count" + val + " thousands";
            }
        }
    }

}



const genderChart: ChartType = {
    series: [0, 0],
    chart: {
        type: 'donut',
        height: 240,
    },
    labels: ['Male', 'Female'],
    colors: ['#2766F6', '#FF1493'],
    legend: {
        show: false,
    },
    plotOptions: {
        pie: {
            donut: {
                size: '70%',
            }
        }
    }
};

const ageChart: ChartType = {
    series: [{
        name: 'Count',
        data: [0, 0, 0, 0, 0, 0, 0]
    }],
    chart: {
        height: 288,
        type: 'line',
        toolbar: 'false',
        dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 8,
            opacity: 0.2
        },
    },
    dataLabels: {
        enabled: false
    },
    colors: ['#556ee6'],
    stroke: {
        curve: 'smooth',
        width: 3,
    },
    xaxis: {
        categories: [
            "16-19",
            "20-24",
            "25-34",
            "35-44",
            "45-54",
            "55-60",
            "60+",

        ]
    }
};





const radialChart: ChartType = {
    series: [0],
    chart: {
        type: 'radialBar',
        width: 60,
        height: 60,
        sparkline: {
            enabled: true
        }
    },
    dataLabels: {
        enabled: false
    },
    colors: ["#EA3C53"],
    plotOptions: {
        radialBar: {
            hollow: {
                margin: 0,
                size: '60%'
            },
            track: {
                margin: 0
            },
            dataLabels: {
                show: true,
                name: {
                    offsetY: -50,
                    show: true,
                    color: "#888",
                    fontSize: "10px",

                },
                value: {
                    formatter: function (val: any) {
                        return parseInt(val.toString(), 10).toString() + '%';
                    },
                    color: "#111",
                    fontSize: "12px",
                    show: true,
                    offsetY: -10,
                }
            }
        }
    },
    labels: [""]
}
const departmentChart: ChartType = {
    series: [0, 0],

    chart: {
        type: 'donut',
        height: 340,
    },
    colors: ['#556ee6', '#34c38f'],
    legend: {
        show: false,
    },
    plotOptions: {
        pie: {
            donut: {
                size: '70%',
            }
        }
    }
};

const severityPieChart: ChartType = {
    series: [0, 0, 0, 0, 0],

    chart: {
        type: 'donut',
        height: 300,
    },
    labels: ['Extreme', 'Very High','High', 'Medium', 'Low'],
    
    colors: ['#FF0000','#FFA500','#FFFF00', '#00FF00', '#87CEFA'],
    legend: {
        show: false,
    },
    plotOptions: {
        pie: {
            donut: {
                size: '70%',
            }
        }
    }


    // series: [44, 55, 13, 43, 22],
    // chart: {
    //     type: "donut"
    // },
    // labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
    // colors: ['#FF0000','#FFA500','#FFFF00', '#00FF00', '#87CEFA'],
    // legend: {
    //     show: false,
    // },
    //  plotOptions: {
    //     pie: {
    //         donut: {
    //             size: '70%',
    //         }
    //     }
    // },
    // responsive: [
    //     {
    //         breakpoint: 480,
    //         options: {
    //             chart: {
    //                 width: 100
    //             },
    //             legend: {
    //                 position: "bottom"
    //             }
    //         }
    //     }
    // ]


    // series: [44, 55, 13, 43, 22],
    // labels: ['Extreme', 'Very High','High', 'Medium', 'Low'],
    // colors: ['#FF0000','#FFA500','#FFFF00', '#00FF00', '#87CEFA'],
    // legend: {
    //     show: false,
    // },
    // plotOptions: {
    //     pie: {
    //         donut: {
    //             size: '70%',
    //         }
    //     }
    // }
};


export { lastaccidentchart, divisionCategoryChart, genderChart, ageChart, radialChart, departmentChart, severityPieChart }