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

const consuptionChart: ChartType = {
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
    tooltip: {
        enabled: true,
        y: {
            formatter: function (val: number, { seriesIndex }: { seriesIndex: number }) {
                // const units = ['kWh', 'm³', 'kg', 'm³', 'tCO2e'];
                return `${val}`;
            }
        } 
    },
    series: [{
        name: 'Total Energy (kWh)',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }, {
        name: 'Wastewater (M3)',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }, {
        name: 'Waste (kg)',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }, {
        name: 'Water (M3)',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }, {
        name: 'GHG Emission (tons)',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }],
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    colors: ['#FF1744', '#CCCC00', '#34c38f', '#516AE4', '#F1BE65'],
    legend: {
        position: 'bottom',
    },
    fill: {
        opacity: 1
    },
    yaxis: {
        labels: {
            formatter: function (val: number) {
                return Math.round(val); // Format y-axis labels as integers
            }
        }
        // Optional: Uncomment the next line to apply a logarithmic scale
        // type: 'logarithmic'
    },
};

const renewalEnergyUsedChart: ChartType = {
    series: [0],
    chart: {
        height: 450,
        type: "radialBar",
        offsetY: -10
    },
    plotOptions: {
        radialBar: {
            startAngle: -135,
            endAngle: 135,
            dataLabels: {
                name: {
                    fontSize: "16px",
                    color: undefined,
                    offsetY: 120
                },
                value: {
                    offsetY: 76,
                    fontSize: "22px",
                    color: undefined,
                    formatter: function (val: any) {
                        return val + "%";
                    }
                }
            }
        }
    },
    fill: {
        type: "gradient",
        gradient: {
            shade: "dark",
            shadeIntensity: 0.15,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 65, 91]
        }
    },
    stroke: {
        dashArray: 4
    },
    labels: ["Renewable Energy"]
}

const reusedRecycledChart: ChartType = {
    series: [0, 0, 0],
  
    chart: {
      type: 'pie',
      height: 340,
    },
    colors: ['#556ee6', '#34c38f','#FFC154'],
    legend: {
      show: false,
    },
  
    labels: ["Recycled","Reused","Others"]
}


const intencityChart: ChartType = {
    series: [
        {
            name: 'Energy',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: 'Water',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: 'Waste',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            name: 'GHG emission quantity details',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    ],
    chart: {
        height: 440,
        type: 'line',
        toolbar: 'false'
    },
    dataLabels: {
        enabled: false
    },
    colors: ['#556ee6', '#EC6B56', '#FFC154', '#47B39C'],
    stroke: {
        curve: 'smooth',
        width: 3,
    },
};

const HazardNonHazardChart: ChartType = {
    series: [0, 0],
    chart: {
        type: 'donut',
        height: 340,
    },
    labels: ['Hazardous Waste', 'Non-Hazardous Waste'],
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

const WasteWaterChart: ChartType = {
    series: [0, 0, 0],
    chart: {
        type: 'donut',
        height: 380,
    }, 
    colors: ['#556ee6', '#34c38f', '#F1B44C'],
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

const GHGEmissionChart: ChartType = {
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
    series: [{
        name: 'Scope-1',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }, {
        name: 'Scope-2',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }, {
        name: 'Scope-3',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }],
    xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    colors: ['#0B9481', '#DF7720', '#153487'],
    legend: {
        position: 'bottom',
    },
    fill: {
        opacity: 1
    },
    tooltip: {
        enabled: true,
        y: {
            formatter: function (val: number) {
                const units = 'tCO2e';
                return `${val} ${units}`;
            }
        }
    },
};

const emissionChart: ChartType = {
    series: [0, 0],
  
    chart: {
      type: 'pie',
      height: 340,
    },
    //colors: ['#556ee6', '#34c38f'],
    legend: {
      show: false,
    }, 
  };

  const waterWastewaterChart: ChartType = {
    series: [0],
    chart: {
        height: 450,
        type: "radialBar",
        offsetY: -10
    },
    plotOptions: {
        radialBar: {
            startAngle: -135,
            endAngle: 135,
            dataLabels: {
                name: {
                    fontSize: "16px",
                    color: undefined,
                    offsetY: 120
                },
                value: {
                    offsetY: 76,
                    fontSize: "22px",
                    color: undefined,
                    formatter: function (val: any) {
                        return val + "%";
                    }
                }
            }
        }
    },
    fill: {
        type: "gradient",
        gradient: {
            shade: "dark",
            shadeIntensity: 0.15,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 50, 65, 91]
        }
    },
    stroke: {
        dashArray: 4
    },
    labels: ["Wastewater"]
}

export { radialChart, consuptionChart, renewalEnergyUsedChart, intencityChart, HazardNonHazardChart, WasteWaterChart, GHGEmissionChart, emissionChart, reusedRecycledChart, waterWastewaterChart }