namespace xx;

/**
 * # Table XX_SAMPLE_V2_T
 * * * *
 * - 설명 : V2 Expand Test 진행을 위한 test용 테이블
 * - Chain  XX(샘플)
 * - Author 조진규 (ckcho@lgcns.com)
 *    |   변경일자   |     비고 |
 *    | ----------  |      --: |
 *    |  2021.02.09 |     최초생성|
 */
entity Sample_V2_T {
  key t_id : Integer64;
  t_cd : String;
  t_name : String;
  h_id : Integer64;
}
