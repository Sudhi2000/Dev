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

    chart: {
        height: 340,
        type: 'bar',
        stacked: true,
        toolbar: {
            show: false
        },
        zoom: {
            enabled: true
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '15%',
            endingShape: 'rounded'
        },
    },
    dataLabels: {
        enabled: false
    },
    xaxis: {
        categories: []
    },
    colors: ['#FF1744', '#CCCC00', '#34c38f', '#516AE4', '#F1BE65'],
    legend: {
        position: 'bottom',
    },
    fill: {
        opacity: 1
    },
    series: [
        {
            name: "Social",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: "Health",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: "Environment",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: "Security",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: "Management System",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    ],
};
const priorityLevelChart: ChartType = {
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
const externalMonthlyChart: ChartType = {

    series: [
        {
            name: "Audit Score",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: "Final Score",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: "Social Auditing Score",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: "Health & Safety Auditing Score",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: "Environment Auditing Score",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
        , {
            name: 'Management System Auditing Score',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
        , {
            name: 'Security Auditing Score',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    ],
    chart: {
        type: "bar",
        height: 350,
        toolbar: {
            show: false
        },
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
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
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

const avgInternalScoreChart: ChartType = {
    series: [{
        name: 'Score',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }],
    chart: {
        type: "area",
        height: 350,
        stacked: true,
        toolbar: {
            show: false
        },
    },
    dataLabels: {
        enabled: false
    },
    colors: [
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#FF4560",
        "#775DD0",
        "#546E7A",
        "#26a69a",
        "#D10CE8"
    ],
    stroke: {
        curve: 'smooth',
        width: 3,
    },
    xaxis: {
        categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ]
    },

};

const timelinessChart: ChartType = {
    series: [0, 0, 0],
    chart: {
        height: 390,
        type: "radialBar",
        toolbar: {
            show: false
        },
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
    colors: ["#1ab7ea", "#0084ff", "#39539E", '#F1BE65'],
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
const gradeChart: ChartType = {
    series: [],
    chart: {
        type: 'donut',
        height: 340,
    },
    labels: [],

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

const heirarchyChart: ChartType = {
    series: [0, 0],

    chart: {
        type: 'pie',
        height: 340,
    },
    colors: ['#FFC154', '#47B39C'],
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

const announcementChart: ChartType = {
    series: [],

    chart: {
        type: 'pie',
        height: 340,
    },
    colors: ['#FFC154', '#47B39C'],
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

const auditTypeChart: ChartType = {
    series: [0, 0],

    chart: {
        type: 'pie',
        height: 340,
    },
    colors: ['#FFC154', '#47B39C', '#34c38f', '#516AE4', '#F1BE65'],
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

const auditFirmChart: ChartType = {
    series: [],
    labels: [],
    chart: {
      type: 'donut',
      height: 350,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
      toolbar: {
        show: false 
      }
    },
    colors: [
      '#4E79A7', '#F28E2B', '#E15759', '#76B7B2',
      '#59A14F', '#EDC949', '#AF7AA1', '#FF9DA7'
    ],
    legend: {
      show: false
    },
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '16px',
              fontWeight: 600,
              color: '#333',
              offsetY: -10
            },
            value: {
              show: true,
              fontSize: '14px',
              fontWeight: 400,
              color: '#666',
              offsetY: 10,
              formatter: (val: number) => `${val} Audits`
            },
            total: {
              show: true,
              label: 'Total Firms',
              fontSize: '16px',
              fontWeight: 500,
              color: '#111',
              formatter: (w: any) => {
                const sum = w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0);
                return `${sum}`;
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        colors: ['#fff']
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: '#000',
        opacity: 0.45
      },
      formatter: function (val: number) {
        return `${val.toFixed(1)}%`;
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['#fff']
    },
    tooltip: {
      y: {
        formatter: function (value: number, opts: any) {
          const total = opts.w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
          const percent = ((value / total) * 100).toFixed(2);
          return `${value} Audits (${percent}%)`;
        }
      }
    }
  };
  
const categoryBreakdownChart: ChartType = {

    chart: {
        height: 340,
        type: 'bar',
        stacked: true,
        toolbar: {
            show: false
        },
        zoom: {
            enabled: true
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '15%',
            endingShape: 'rounded'
        },
    },
    dataLabels: {
        enabled: false
    },
    xaxis: {
        categories: []
    },
    colors: ['#FF1744', '#CCCC00', '#34c38f', '#516AE4', '#F1BE65'],
    legend: {
        position: 'bottom',
    },
    fill: {
        opacity: 1
    },
    series: [
        {
            name: "",
            group: '',
            data: [0, 0, 0, 0, 0, 0, 0,]
        },

    ],
};

const divisionWiseChart: ChartType = {
    series: [
        {
            name: "year",
            data: []
        }
    ],
    chart: {
        id: "barYear",
        height: 400,
        width: "100%",
        type: "bar",
        events: {

        },
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            distributed: true,
            horizontal: true,
            barHeight: "75%",
            dataLabels: {
                position: "bottom"
            }
        }
    },
    dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
            colors: ["#fff"]
        },
        formatter: function (val: any, opt: any) {
            return opt.w.globals.labels[opt.dataPointIndex];
        },
        offsetX: 0,
        dropShadow: {
            enabled: true
        }
    },

    colors: ['#FF1744', '#CCCC00', '#34c38f', '#516AE4', '#F1BE65'],


    tooltip: {
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (val: any, opts: any) {
                    return opts.w.globals.labels[opts.dataPointIndex];
                }
            }
        }
    },
    yaxis: {
        labels: {
            show: false
        }
    }
};

const divisionWiseOptions: ChartType = {
    series: [
        {
            name: "quarter",
            data: []
        }
    ],
    chart: {
        id: "barQuarter",
        height: 400,
        width: "100%",
        type: "bar",
        stacked: true,
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            columnWidth: "50%",
            horizontal: false
        }
    },
    legend: {
        show: false
    },

    yaxis: {
        labels: {
            show: false
        }
    },
    tooltip: {
        x: {
            formatter: function (val: any, opts: any) {
                return opts.w.globals.seriesNames[opts.seriesIndex];
            }
        },
        y: {
            title: {
                formatter: function (val: any, opts: any) {
                    return opts.w.globals.labels[opts.dataPointIndex];
                }
            }
        }
    }
};

const standardChart: ChartType = {
    series: [
        {
            name: "basic",
            data: [0]
        }
    ],
    chart: {
        type: "bar",
        height: 350,
        toolbar: {
            show: false
        }
    },
    plotOptions: {
        bar: {
            horizontal: true,

        }
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false,
    },
    xaxis: {
        categories: []
    }
};
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

export { divisionChart, comLevelChart, externalMonthlyChart, priorityLevelChart, avgInternalScoreChart, timelinessChart, radialChart, gradeChart, heirarchyChart, announcementChart, auditTypeChart, categoryBreakdownChart, divisionWiseChart, divisionWiseOptions, standardChart, auditFirmChart };