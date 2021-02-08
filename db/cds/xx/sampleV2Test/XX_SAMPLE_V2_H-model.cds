namespace xx;

using {xx.Sample_V2_M as master} from './XX_SAMPLE_V2_M-model';
using {xx.Sample_V2_D as detail} from './XX_SAMPLE_V2_D-model';
using {xx.Sample_V2_T as tail} from './XX_SAMPLE_V2_T-model';


entity Sample_V2_H {
  key h_id : Integer64;
  h_cd : String;
  h_name : String;
  m_id : Integer64;
  details : Association to many detail on details.h_id = h_id;
  tails : Association to many tail on tails.h_id = h_id;
}
