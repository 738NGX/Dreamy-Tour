import VO from "@/base/vo";

interface AddressComponent {
  country: string;
  province: string;
  city: string;
  citycode: string;
  district: string;
  adcode: string;
  township: string;
  towncode: string;
  neighborhood: Neighborhood[];
  building: Building[];
  streetNumber: StreetNumber[];
  businessAreas: BusinessAreaItem[];
  seaArea: string;
}

interface Neighborhood {
  name: string;
  type: string;
}

interface Building {
  name: string;
  type: string;
}

interface StreetNumber {
  street: string;
  number: string;
  location: string;
  direction: string;
  distance: number;
}

interface BusinessAreaItem {
  location: string;
  name: string;
  id: string;
}

interface Road {
  road: {
    id: string;
    name: string;
    distance: number;
    direction: string;
    location: string;
  };
}

interface RoadInter {
  roadinter: {
    distance: number;
    direction: string;
    location: string;
    first_id: string;
    first_name: string;
    second_id: string;
    second_name: string;
  };
}

interface Poi {
  poi: {
    id: string;
    name: string;
    type: string;
    tel: string;
    distance: number;
    direction: string;
    address: string;
    location: string;
    businessarea: string;
  };
}

interface Aoi {
  aoi: {
    id: string;
    name: string;
    adcode: string;
    location: string;
    area: number;
    distance: number;
    type: string;
  };
}

class RegeocodeVo extends VO<RegeocodeVo> {
  addressComponent: AddressComponent;
  formatted_address: string;
  roads: Road;
  roadinters: RoadInter;
  pois: Poi;
  aois: Aoi;
}

export default RegeocodeVo;