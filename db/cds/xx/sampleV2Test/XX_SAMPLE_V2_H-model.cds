namespace xx;

using {xx.Sample_V2_M as master} from './XX_SAMPLE_V2_M-model';
using {xx.Sample_V2_D as detail} from './XX_SAMPLE_V2_D-model';
using {xx.Sample_V2_T as tail} from './XX_SAMPLE_V2_T-model';


/**
 * # Table XX_SAMPLE_V2_H
 * * * *
 * - 설명 : V2 Expand Test 진행을 위한 test용 테이블
 * - Chain  XX(샘플)
 * - Author 조진규 (ckcho@lgcns.com)
 *    |   변경일자   |     비고 |
 *    | ----------  |      --: |
 *    |  2021.02.09 |     최초생성|
 *    |  2021.02.10 |     details, tails 추가|
 */
entity Sample_V2_H {
  key h_id : Integer64;
  h_cd : String;
  h_name : String;
  m_id : Integer64;
  details : Association to many detail on details.h_id = h_id;
  tails : Association to many tail on tails.h_id = h_id;
}
