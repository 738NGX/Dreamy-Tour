import VO from "@/base/vo";

class GeocodeVo extends VO<GeocodeVo> {
  formatted_address: string;
  country: string;
  province: string;
  citycode: string;
  city: string;
  district: string;
  township: any[];
  neighborhood: any[];
  building: any[];
  adcode: string;
  street: string;
  number: string;
  location: string;
  level: string;
}

export default GeocodeVo;