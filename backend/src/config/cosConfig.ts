import CosConstant from '@/constant/cosConstant';
import COS from 'cos-nodejs-sdk-v5';

const cos = new COS({
  SecretId: CosConstant.SECRET_ID,
  SecretKey: CosConstant.SECRET_KEY
});

export default cos;