import VO from "@/base/vo";

class GeoEncodeVo extends VO<GeoEncodeVo> {
  address: string;   
  province: string;
  city: string;
  district: string;     
  longitude: number;      
  latitude: number;       
}

export default GeoEncodeVo;