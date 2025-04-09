import VO from "@/base/vo";

export type TransitNode = {
  title: string;
  amount: number;
  type: number;
  note: string;
}

export type TransitPlan = {
  duration: number;
  distance: number;
  walking_distance: number;
  route: TransitNode[];
}

type Walking = {
  cost: { duration: string }
  origin: string;
  destination: string;
  distance: string;
  steps: { instruction: string, road: string, distance: string }[]
};

type BusStop = {
  name: string,
  id: string,
  location: string
  exit?: { name: string, location: string }
};

type Bus = {
  buslines: {
    departure_stop: BusStop;
    arrival_stop: BusStop;
    name: string,
    id: string,
    type: string,
    distance: string,
    cost: { duration: string },
    bus_time_tips: string,
    bustimetag: string,
    start_time: string,
    end_time: string,
    via_num: string,
    via_stops: BusStop[]
  }[]
}

type RailStop = {
  id: string;
  name: string;
  location: string;
  adcode: string;
  time: string;
  start?: string;
  end?: string;
  wait?: string;
};

type Railway = {
  id: string;
  time: string;
  name: string;
  trip: string;
  distance: string;
  type: string;
  departure_stop: RailStop;
  arrival_stop: RailStop;
  via_stops: RailStop[];
  spaces: { code: string; cost: string; }[];
};

type Taxi = {
  price: string;     // 打车预计花费金额
  drivetime: string; // 打车预计花费时间
  distance: string;  // 打车距离
  polyline: string;  // 线路点集合
  startpoint: string;// 打车起点经纬度
  startname: string; // 打车起点名称
  endpoint: string;  // 打车终点经纬度
  endname: string;   // 打车终点名称
};

type Transit = {
  cost: { duration: string, transit_fee: string }
  distance: string;
  walking_distance: string;
  nightflag: '0' | '1';
  segments: {
    walking?: Walking;
    bus?: Bus;
    railway?: Railway;
    taxi?: Taxi;
  }[];
}

export type Route = {
  origin: string;
  destination: string;
  transits: Transit[]
};

class TransitDirectionVo extends VO<TransitDirectionVo> {
  plans: TransitPlan[];
}

export default TransitDirectionVo;