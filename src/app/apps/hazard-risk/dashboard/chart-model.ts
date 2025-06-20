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

const divisionChart: ChartType = {
    series: [
        {
            name: "High",
            data: []
        },
        {
            name: "Medium",
            data: []
        },
        {
            name: "Low",
            data: []
        }
    ],
    colors: [],
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
            borderRadius: 4,
            columnWidth: "55%",
            endingShape: "rounded"
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

    fill: {
        opacity: 1
    },
    tooltip: {
        y: {
            formatter: function (val: any) {
                return "$ " + val + " thousands";
            }
        }
    }
}

const statusChart: ChartType = {
    series: [70],
    chart: {
        height: 350,
        type: "radialBar"
    },
    plotOptions: {
        radialBar: {
            hollow: {
                size: "70%"
            }
        }
    },
    labels: ["Completed"]
}

const totalLevelChart: ChartType = {
    series: [10],
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

const comLevelChart: ChartType = {
    series: [10],
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
    colors: ["#34c38f"],
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

const TatChart: ChartType = {
    series: [0,0,0],
    chart: {
        height: 390,
        type: "radialBar"
    },
    plotOptions: {
        radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
                margin: 5,
                size: "30%",
                background: "transparent",
                image: undefined
            },
            dataLabels: {
                name: {
                    show: true,
                    fontSize: '16px',
                    fontWeight: 600,
                    offsetY: -10
                },
                value: {
                    show: true,
                    fontSize: '14px',
                    offsetY: 4,
                    formatter: function (val: any) {
                        return val + '%'
                    }
                },
                total: {
                    show: true,
                    label: 'Total',
                    color: '#999',
                    fontSize: '16px',
                    fontFamily: undefined,
                    fontWeight: 600,
                    formatter: function (w: any) {
                        return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                            return a + b;
                        }, 0) + '%';
                    }
                }
            },
            track: {
                show: true,
                startAngle: undefined,
                endAngle: undefined,
                background: '#f2f2f2',
                strokeWidth: '97%',
                opacity: 1,
                margin: 12,
                dropShadow: {
                    enabled: false,
                    top: 0,
                    left: 0,
                    blur: 3,
                    opacity: 0.5
                }
            },
        }
    },
    stroke: {
        lineCap: 'round'
    },
    colors: ["#1ab7ea", "#0084ff", "#39539E"],
    labels: ["Closed on Time", "Closed but Delayed", "Pending"],
    legend: {
        show: false,
        floating: true,
        fontSize: "16px",
        position: "left",
        offsetX: 50,
        offsetY: 10,
        labels: {
            useSeriesColors: true
        },
        formatter: function (seriesName: any, opts: any) {
            return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
        },
        itemMargin: {
            horizontal: 3
        }
    },
    responsive: [
        {
            breakpoint: 480,
            options: {
                legend: {
                    show: false
                }
            }
        }
    ]
}

const riskLevelChart: ChartType = {
    series: [44, 55, 41],
    chart: {
        width: 350,
        type: "donut"
    },
    dataLabels: {
        enabled: true
    },
    fill: {
        type: "solid"
    },
    labels: ['High', 'Medium', 'Low'],
    colors: ['#FF1744', '#CCCC00', '#34c38f'],

    legend: {
        position: "bottom",
        formatter: function (val: any, opts: any) {
            return val + " - " + opts.w.globals.series[opts.seriesIndex];
        }

    },
    responsive: [
        {
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: "top"
                }
            }
        }
    ]
};

const riskChart: ChartType = {
    series: [44, 55, 13, 43, 22],
      chart: {
        type: "donut"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]

}
const unsafeActConditionChart: ChartType = {
    series: [0, 0],
    chart: {
        type: 'donut',
        height: 340,
    },
    labels: ['Unsafe Act', 'Unsafe Condition'],
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

const hazardMonthlyChart: ChartType = {

    series: [
    ],
    chart: {
      type: "bar",
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded"
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
      categories: [
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct"
      ]
    },
    yaxis: {
      title: { 
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
         
      }
    }
  
}
export { divisionChart, statusChart, totalLevelChart, comLevelChart, TatChart, riskLevelChart, riskChart, unsafeActConditionChart, hazardMonthlyChart }