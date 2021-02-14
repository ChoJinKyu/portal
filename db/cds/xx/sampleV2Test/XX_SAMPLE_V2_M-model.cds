namespace xx;

using {xx.Sample_V2_H as header} from './XX_SAMPLE_V2_H-model';

/**
 * # Table XX_SAMPLE_V2_M
 * * * *
 * - 설명 : V2 Expand Test 진행을 위한 test용 테이블
 * - Chain  XX(샘플)
 * - Author 조진규 (ckcho@lgcns.com)
 *    |   변경일자   |     비고 |
 *    | ----------  |      --: |
 *    |  2021.02.09 |     최초생성|
 *    |  2021.02.10 |     headers 추가|
 */
entity Sample_V2_M {
  key m_id : Integer64;
  m_cd : String;
  m_name : String;
  headers : Association to many header on headers.m_id = m_id;
}
