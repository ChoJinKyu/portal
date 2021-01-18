/**
 * * * *
 *
 * 1. namespace
 *
 * - 모듈코드 소문자로 작성
 * - 소모듈 존재시 대모듈.소모듈 로 작성
 *
 * 2. entity
 *
 * - 대문자로 작성
 * - 테이블명 생성을 고려하여 '\_' 추가
 *
 * 3. 컬럼(속성)
 *
 * - 소문자로 작성
 *
 * 4. .hdbview, .hdbfunction 등으로 이미 생성된 DB Object 사용시 entity 위에
 *    @cds.persistence.exists 명시
 *
 * 5. namespace : sp
 *
 * 6. entity : Vi_Expected_Mtl
 *
 * 7. entity description : VI예상품번
 *
 * 8. history -. 2021.01.13 : 이경상 최초작성
 *
 * * * *
 */
namespace sp;

using util from '../../cm/util/util-model';
// using {sp as viExpMtl} from '../Sp/SP_VI_EXPECTED_MTL-model';

entity Vi_Expected_Mtl {
    key tenant_id     : String(5) not null  @title : '테넌트ID';
    key plant_code    : String(10) not null @title : '플랜트코드';
    key material_code : String(40) not null @title : '자재코드';
    key txn_yyyymm    : String(8) not null  @title : '트랜잭션년월';
    key txn_type_code : String(30) not null @title : '거래유형코드';
}

extend Vi_Expected_Mtl with util.Managed;
annotate Vi_Expected_Mtl with @title : 'VI예상품번'  @description : 'VI예상품번';
