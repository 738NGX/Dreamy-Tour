/**
 * 行程统计信息
 */
import * as echarts from '../ec-canvas/echarts'
import { Reporter } from '../../utils/reporter';
import { Tour } from '../../utils/tour/tour';
import { currencyList } from '../../utils/tour/expense'
const app = getApp<IAppOption>();

Component({
  behaviors: [],
  lifetimes: {
    created() {

    },
    attached() {
      this.setData({
        currentTour: new Tour(this.properties.tour),
        currentTourCopyIndex: this.properties.copyIndex
      })
      this.initReport(this.data.currentTour,this.data.currentTourCopyIndex);
      this.initCharts();
    },
    moved() {

    },
    detached() {

    },
  },
  properties: {
 //接收行程对象，日期信息和版本信息，初始化行程并处理版本切换和筛选逻辑
  tour: {                 
    type: Object,
    value: {},
    observer(newVal: any) {
      if (newVal) {
        this.onTourUpdate(newVal);
        this.initReport(this.data.currentTour,this.data.currentTourCopyIndex);
        this.initCharts();
      }
    }
  }, 
  copyIndex: {
    type: Number,
    value: 0,
    observer(newVal: number) {
      this.onCopyChange(newVal);
      this.initReport(this.data.currentTour,this.data.currentTourCopyIndex);
      this.initCharts();
    }
  }
  },
  data: {
    currentTour : null as Tour | null,

    currentTourCopyIndex : 0,

    currencyList:currencyList,
    ec:{
      lazyLoad: true
    },
    reporter: null as Reporter | null,

    activeCollapses: [[], [], [], [], [], []],

    chartDataInType: null as [] | null,
    chartDataInBudget: null as [] | null,
    chartDataInTransportType: null as [] | null,

    chartDataInHotel: {},
    chartDataInMeal: {},
    chartDataInTicket: {},
    chartDataInShopping: {},

    totalTransportCurrency: 0,
  },
 
  methods: {
    initCharts(){
      const chartInType = this.selectComponent('#chartInType')
      chartInType.init((canvas:any, width:any,height:any) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
        });
        this.setChartOptionInType(chart);
        return chart
      })

      const chartInBudget = this.selectComponent('#chartInBudget')
      chartInBudget.init((canvas:any, width:any,height:any) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
        });
        this.setChartOptionInBudget(chart);
        return chart
      })

      const chartInTransportType = this.selectComponent('#chartInTransportType')
      chartInTransportType.init((canvas:any, width:any,height:any) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
        });
        this.setChartOptionInTransportType(chart);
        return chart
      })

      const chartInHotel = this.selectComponent('#chartInHotel')
      chartInHotel.init((canvas:any, width:any,height:any) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
        });
        this.setStatisticChartOption(chart,this.data.chartDataInHotel);
        return chart
      })
      
      const chartInMeal = this.selectComponent('#chartInMeal')
      chartInMeal.init((canvas:any, width:any,height:any) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
        });
        this.setStatisticChartOption(chart,this.data.chartDataInMeal);
        return chart
      })

      const chartInTicket = this.selectComponent('#chartInTicket')
      chartInTicket.init((canvas:any, width:any,height:any) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
        });
        this.setStatisticChartOption(chart,this.data.chartDataInTicket);
        return chart
      })

      const chartInShopping = this.selectComponent('#chartInShopping')
      chartInShopping.init((canvas:any, width:any,height:any) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
        });
        this.setStatisticChartOption(chart,this.data.chartDataInShopping);
        return chart
      })
    },
    initReport(value:any,copyIndex:number){
      const currentTour = new Tour(value);
      
      const reporter = new Reporter(currentTour,copyIndex);
      
      const totalTransportCurrency = reporter.expenseCalculator.calculateTotalTransportCurrency()
      this.setData({
        reporter:reporter,
        chartDataInType: reporter.expenseCalculator.getChartDataInType(),
        chartDataInBudget: reporter.expenseCalculator.getChartDataInBudget(),
        chartDataInTransportType: reporter.expenseCalculator.getChartDataInTransportType(), 
    
        chartDataInHotel: reporter.typeList[0].chartData,
        chartDataInMeal: reporter.typeList[1].chartData,
        chartDataInTicket: reporter.typeList[3].chartData,
        chartDataInShopping: reporter.typeList[4].chartData,

        totalTransportCurrency: totalTransportCurrency,
      })
      console.log("chartdatainhotel",this.data.chartDataInHotel)
    },
    onTourUpdate(data : Tour){
      this.setData({ currentTour: data})
    },
    onCopyChange(index: number) {
      this.setData({ currentTourCopyIndex: index });
    },
    handleCollapsesChange(e: any) {
      this.setData({
          activeCollapses: {
              ...this.data.activeCollapses,
              [e.currentTarget.dataset.index]: e.detail.value
          }
      });
    },


/**
 * 类型区分饼图设置
 * @param chart 
 */
    setChartOptionInType(chart: any){
      if(this.data.reporter){
        var option = {
          title: {
            text: '不同类别消费额',
            left: 'center',
            top: 'auto',
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          legend: {
            left: 'auto',
            top: 'center',
            orient:'hozizonal',
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          series: [
            {
              name: 'Area Mode',
              type: 'pie',
              roseType:'radius',
              label:{
                show:false,
              },
              radius: [20, 100],
              center: ['50%', '50%'],
              itemStyle: {
                borderRadius: 3
              },
              data:this.data.chartDataInType
            }
          ]
        };
        
        
        chart.setOption(option);
      }
    },
    /**
 * 预算区分饼图设置
 * @param chart 
 */
    setChartOptionInBudget(chart: any){
      if(this.data.reporter){
        var option = {
          title: {
            text: '各预算表消费额',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          legend: {
            left: 'auto',
            top: 'buttom',
            orient:'hozizonal',
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          series: [
            {
              name: 'Area Mode',
              type: 'pie',
              roseType:'radius',
              label:{
                show:false,
              },
              radius: [20, 100],
              center: ['50%', '50%'],
              itemStyle: {
                borderRadius: 3
              },
              data:this.data.chartDataInBudget
            }
          ]
        };
        chart.setOption(option);
      }
    },
    /**
 * 交通区分饼图设置
 * @param chart 
 */
    setChartOptionInTransportType(chart: any){
      if(this.data.reporter){
        var option = {
          title: {
            text: '不同交通方式消费额',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          legend: {
            left: 'auto',
            top: 'buttom',
            orient:'hozizonal',
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          series: [
            {
              name: 'Area Mode',
              type: 'pie',
              roseType:'radius',
              label:{
                show:false,
              },
              radius: [20, 100],
              center: ['50%', '50%'],
              itemStyle: {
                borderRadius: 3
              },
              data:this.data.chartDataInTransportType
            }
          ]
        };
        chart.setOption(option);
      }
    },
    /**
 * 多y轴柱状图设置
 * @param chart 
 */
    setStatisticChartOption(chart:any,data:any){
      const colors = ['#5470C6', '#EE6666', '#91CC75'];
      if(this.data.reporter){
        var option = {
          color: colors,

          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          grid: {
            right: '20%'
          },
          toolbox: {
            feature: {
              dataView: { show: true, readOnly: false },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          legend: {
            data: ['Evaporation', 'Precipitation', 'Temperature']
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {
                alignWithLabel: true
              },
              data: ['1','2','3','4','5','6','7','8','9','10']
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: "合计" + currencyList[this.data.reporter.mainCurrency].symbol,
              position: 'left',
              alignTicks: true,
              axisLine: {
                show: true,
                lineStyle: {
                  color: colors[0]
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: currencyList[this.data.reporter.mainCurrency].symbol,
              position: 'right',
              alignTicks: true,
              axisLine: {
                show: true,
                lineStyle: {
                  color: colors[1]
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            },
            {
              type: 'value',
              name: currencyList[this.data.reporter.subCurrency].symbol,
              position: 'right',
              offset: 50,
              alignTicks: true,
              axisLine: {
                show: true,
                lineStyle: {
                  color: colors[2]
                }
              },
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: data
        };
        chart.setOption(option);
      } 
    },
  },
});