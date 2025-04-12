import VO from "@/base/vo";

export type WalkPath = {
  distance: string;
  cost: { duration: string };
  steps: { 
    instruction: string,
    orientation: string,
    road_name: string,
    step_distance: string,
  }[];
};

export type WalkRoute = {
  origin: string;
  destination: string;
  paths: WalkPath[]
};

export type WalkPlan = {
  duration: number;
  distance: number;
  note: string;
}

class WalkDirectionVo extends VO<WalkDirectionVo> {
  plans: WalkPlan[];
}

export default WalkDirectionVo;