import { Reporter } from '../../../utils/reporter';
import { Tour } from '../../../utils/tour/tour';
import { currencyList } from '../../../utils/tour/expense'
const app = getApp<IAppOption>();

Component({
    behaviors: [],
    pageLifetimes: {
      show() {
        // 页面显示时，刷新组件数据
        this.initReport();
      },
    },
    properties: {

    },
    data: {
        optsInType: {
            legend: {
                show: true,
                position: "right",
                lineHeight: 25
            },
            title: {
                name: "总消费",
                fontSize: 20,
            },
            subtitle: {
                name: "0CNY",
                fontSize: 15,
            },
        },
        optsInTag: {
            color: ["#aaaaaa", "#ff9547", "#ff9eac", "#27c1b7", "#db0839", "#66c0ff", "#c1cad4", "#ffd010", "#c252c6", "#ff6fbe"],
            legend: {
                show: true,
                position: "right",
                lineHeight: 25
            },
            title: {
                name: "",
            },
            subtitle: {
                name: "",
            },
        },
        optsInTransportType: {
            legend: {
                show: true,
                position: "right",
                lineHeight: 25
            },
            title: {
                name: "交通消费",
                fontSize: 20,
            },
            subtitle: {
                name: "0CNY",
                fontSize: 15,
            },
        },
        optsColumn: {
            touchMoveLimit: 24,
            enableScroll: true,
            xAxis: {
                scrollShow: false,
                itemCount: 3
            },
            yAxis: {
                showTitle: true,
                data: [
                    {
                        position: "left",
                        title: "CNY",
                        min: 0,
                    },
                    {
                        position: "right",
                        title: "JPY",
                        min: 0,
                    },
                ]
            },
        },
        currencyList: currencyList,

        canvas2d: 'true',
        selectingTour: false,
        activeCollapses: [[], [], [], [], [], []],
        selectingMarkerId: -1,

        // 数据缓存
        reporter: null as Reporter | null,
        chartDataInType: {},
        chartDataInTag: {},
        chartDataInHotel: {},
        chartDataInMeal: {},
        chartDataInTransportType: {},
        chartDataInTicket: {},
        chartDataInShopping: {},
    },
    lifetimes: {
      created() {
  
      },
      attached() {
        this.setData({
          selectingTour: app.globalData.selectingTour,
        });
        this.initReport();
      },
      ready(){
        
      },
      moved() {
  
      },
      detached() {
  
      },
    },
    methods: {
        onChildPageChange(e: any) {
            this.setData({
                childPage: e.detail.value
            });
        },
        initReport() {
            if (app.globalData.currentTour) {
                const currentTour = new Tour(app.globalData.currentTour);
                const reporter = new Reporter(currentTour);

                const optsInType = this.data.optsInType;
                const optsInTransportType = this.data.optsInTransportType;
                const optsColumn = this.data.optsColumn;
                console.log("optsColumn:",optsColumn)
           
            optsInType.subtitle.name = reporter.expenseCalculator.total.allCurrency + currencyList[reporter.mainCurrency].symbol;
            optsInTransportType.subtitle.name = reporter.expenseCalculator.totalInType[2].allCurrency + currencyList[reporter.mainCurrency].symbol; 
            optsColumn.yAxis.data[0].title = currencyList[reporter.mainCurrency].symbol;
            optsColumn.yAxis.data[1].title = currencyList[reporter.subCurrency].symbol;


                this.setData({
                    reporter: reporter,
                    chartDataInType: reporter.expenseCalculator.getChartDataInType(),
                    optsColumn: optsColumn,
                    optsInType: optsInType,
                    chartDataInTag: reporter.expenseCalculator.getChartDataInTag(),
                    chartDataInHotel: reporter.typeList[0].chartData,
                    chartDataInMeal: reporter.typeList[1].chartData,
                    chartDataInTransportType: reporter.expenseCalculator.getChartDataInTransportType(),
                    chartDataInTicket: reporter.typeList[3].chartData,
                    chartDataInShopping: reporter.typeList[4].chartData,
                    optsInTransportType: optsInTransportType,
                });
            }
            else {
                this.setData({
                    reporter: null,
                    chartDataInType: {},
                    chartDataInTag: {},
                    chartDataInHotel: {},
                    chartDataInMeal: {},
                    chartDataInTransportType: {},
                    chartDataInTicket: {},
                    chartDataInShopping: {},
                });
            }
        },
        handleCollapsesChange(e: any) {
            this.setData({
                activeCollapses: {
                    ...this.data.activeCollapses,
                    [e.currentTarget.dataset.index]: e.detail.value
                }
            });
        },
    },
})


/**
 * <scroll-view class="scrollarea" scroll-y type="list">
      <view class="container">
        <view class="column">
          <view style="font-weight:bold;">本次"{{reporter.tourData.title}}"行程总消费</view>
          <view class="row" style="margin:0">
            <view>{{currencyList[reporter.mainCurrency].label}}:</view>
            <view>{{reporter.expenseCalculator.total.mainCurrency}}</view>
          </view>
          <view class="row" style="margin:0">
            <view>{{currencyList[reporter.subCurrency].label}}:</view>
            <view>{{reporter.expenseCalculator.total.subCurrency}}</view>
          </view>
          <view class="row" style="margin:0">
            <view>合计{{currencyList[reporter.mainCurrency].label}}:</view>
            <view>{{reporter.expenseCalculator.total.allCurrency}}</view>
          </view>
          <view class="row" style="margin:0">
            <view>参考汇率:</view>
            <view>1{{currencyList[reporter.subCurrency].symbol}}=
              {{reporter.currencyExchangeRate}}
              {{currencyList[reporter.mainCurrency].symbol}}</view>
          </view>
        </view>
        <view class="row" style="font-weight:bold;">分类统计(in {{currencyList[reporter.mainCurrency].symbol}})</view>
        <view class="charts-box">
          <qiun-wx-ucharts type="ring" opts="{{optsInType}}" chartData="{{chartDataInType}}" inScrollView="true" canvas2d canvasId="chatDataInType" />
        </view>
        <view class="row" style="font-weight:bold;">交通统计(in {{currencyList[reporter.mainCurrency].symbol}})</view>
        <view class="charts-box">
          <qiun-wx-ucharts type="ring" opts="{{optsInTransportType}}" chartData="{{chartDataInTransportType}}" inScrollView="true" canvas2d canvasId="chatDataInTransportType" />
        </view>
        <view class="row" style="font-weight:bold;">住宿统计(in {{currencyList[reporter.mainCurrency].symbol}})</view>
        <view class="charts-box">
          <qiun-wx-ucharts type="column" opts="{{optsColumn}}" chartData="{{chartDataInHotel}}" inScrollView="true" ontouch="{{true}}" canvas2d canvasId="chatDataInHotel" />
        </view>
        <t-collapse value="{{activeCollapses[0]}}" bind:change="handleCollapsesChange" data-index="{{0}}">
          <t-collapse-panel header="住宿消费合计" header-right-content="{{reporter.expenseCalculator.totalInType[0].allCurrency}}{{currencyList[reporter.mainCurrency].symbol}}" value="{{0}}" expandIcon>
            <view wx:for="{{reporter.typeList[0].data}}" wx:key="index">
              <t-cell title="{{item.title}}" description="at {{item.from}},\n {{item.time}}" note="{{item.subCurrency === 0 ? item.mainCurrency : item.subCurrency}}{{item.subCurrency === 0 ? currencyList[reporter.mainCurrency].symbol : currencyList[reporter.subCurrency].symbol}}/{{item.allCurrency}}{{currencyList[reporter.mainCurrency].symbol}}" />
            </view>
          </t-collapse-panel>
        </t-collapse>
        <view class="row" style="font-weight:bold;">餐饮统计(in {{currencyList[reporter.mainCurrency].symbol}})</view>
        <view class="charts-box">
          <qiun-wx-ucharts type="column" opts="{{optsColumn}}" chartData="{{chartDataInMeal}}" inScrollView="true" ontouch="{{true}}" canvas2d canvasId="chatDataInMeal" />
        </view>
        <t-collapse value="{{activeCollapses[1]}}" bind:change="handleCollapsesChange" data-index="{{1}}">
          <t-collapse-panel header="餐饮消费合计" header-right-content="{{reporter.expenseCalculator.totalInType[1].allCurrency}}{{currencyList[reporter.mainCurrency].symbol}}" value="{{0}}" expandIcon>
            <view wx:for="{{reporter.typeList[1].data}}" wx:key="index">
              <t-cell title="{{item.title}}" description="at {{item.from}},\n {{item.time}}" note="{{item.subCurrency === 0 ? item.mainCurrency : item.subCurrency}}{{item.subCurrency === 0 ? currencyList[reporter.mainCurrency].symbol : currencyList[reporter.subCurrency].symbol}}/{{item.allCurrency}}{{currencyList[reporter.mainCurrency].symbol}}" />
            </view>
          </t-collapse-panel>
        </t-collapse>
        <view class="row" style="font-weight:bold;">门票统计(in {{currencyList[reporter.mainCurrency].symbol}})</view>
        <view class="charts-box">
          <qiun-wx-ucharts type="column" opts="{{optsColumn}}" chartData="{{chartDataInTicket}}" inScrollView="true" ontouch="{{true}}" canvas2d canvasId="chatDataInTicket" />
        </view>
        <t-collapse value="{{activeCollapses[2]}}" bind:change="handleCollapsesChange" data-index="{{2}}">
          <t-collapse-panel header="门票消费合计" header-right-content="{{reporter.expenseCalculator.totalInType[3].allCurrency}}{{currencyList[reporter.mainCurrency].symbol}}" value="{{0}}" expandIcon>
            <view wx:for="{{reporter.typeList[3].data}}" wx:key="index">
              <t-cell title="{{item.title}}" description="at {{item.from}},\n {{item.time}}" note="{{item.subCurrency === 0 ? item.mainCurrency : item.subCurrency}}{{item.subCurrency === 0 ? currencyList[reporter.mainCurrency].symbol : currencyList[reporter.subCurrency].symbol}}/{{item.allCurrency}}{{currencyList[reporter.mainCurrency].symbol}}" />
            </view>
          </t-collapse-panel>
        </t-collapse>
        <view class="row" style="font-weight:bold;">购物统计(in {{currencyList[reporter.mainCurrency].symbol}})</view>
        <view class="charts-box">
          <qiun-wx-ucharts type="column" opts="{{optsColumn}}" chartData="{{chartDataInShopping}}" inScrollView="true" ontouch="{{true}}" canvas2d canvasId="chatDataInShopping" />
        </view>
        <t-collapse value="{{activeCollapses[3]}}" bind:change="handleCollapsesChange" data-index="{{3}}">
          <t-collapse-panel header="购物消费合计" header-right-content="{{reporter.expenseCalculator.totalInType[4].allCurrency}}{{currencyList[reporter.mainCurrency].symbol}}" value="{{0}}" expandIcon>
            <view wx:for="{{reporter.typeList[4].data}}" wx:key="index">
              <t-cell title="{{item.title}}" description="at {{item.from}},\n {{item.time}}" note="{{item.subCurrency === 0 ? item.mainCurrency : item.subCurrency}}{{item.subCurrency === 0 ? currencyList[reporter.mainCurrency].symbol : currencyList[reporter.subCurrency].symbol}}/{{item.allCurrency}}{{currencyList[reporter.mainCurrency].symbol}}" />
            </view>
          </t-collapse-panel>
        </t-collapse>
        <view class="row" style="font-weight:bold;">分标签统计(in {{currencyList[reporter.mainCurrency].symbol}})</view>
        <view class="charts-box">
          <qiun-wx-ucharts type="pie" chartData="{{chartDataInTag}}" opts="{{optsInTag}}" inScrollView="true" canvas2d canvasId="chatDataInTag" />
        </view>
        <t-collapse value="{{activeCollapses[4]}}" bind:change="handleCollapsesChange" data-index="{{4}}" expandIcon expandMutex>
          <block wx:for="{{[1, 2, 3, 4, 5, 6, 7, 8, 9]}}" wx:key="index" wx:for-item="i">
            <t-collapse-panel header="Tag{{i}}消费合计" header-right-content="{{reporter.expenseCalculator.totalInTag[i].allCurrency}}{{currencyList[reporter.mainCurrency].symbol}}" value="{{i-1}}">
              <view wx:for="{{reporter.tagList[i].data}}" wx:key="index">
                <t-cell title="{{item.title}}" description="at {{item.from}},\n {{item.time}}" note="{{item.subCurrency === 0 ? item.mainCurrency : item.subCurrency}}{{item.subCurrency === 0 ? currencyList[reporter.mainCurrency].symbol : currencyList[reporter.subCurrency].symbol}}/{{item.allCurrency}}{{currencyList[reporter.mainCurrency].symbol}}" />
              </view>
            </t-collapse-panel>
          </block>
        </t-collapse>
      </view>
    </scroll-view>

 */