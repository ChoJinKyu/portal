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
 * 5. namespace : dp
 * 6. entity : Tc_Mcst_Project_Part_List
 * 7. entity description : 재료비의 프로젝트 Part List
 * 8. history -. 2020.12.08 : 정정호 최초작성
 *
 * * * *
 */
namespace dp;

using {User} from '@sap/cds/common';
using util from '../../cm/util/util-model';
using {dp as Mcst_Project_Part_List} from './DP_TC_MCST_PROJECT_PART_LIST-model';

entity Tc_Mcst_Project_Part_List {
    key tenant_id                   : String(5) not null  @title : '테넌트ID';
    key project_code                : String(30) not null @title : '프로젝트코드';
    key model_code                  : String(40) not null @title : '모델코드';
    key version_number              : String(30) not null @title : '버전번호';
    key material_code               : String(40) not null @title : '자재코드';
        commodity_code              : String(100)         @title : '커머디티코드';
        uom_code                    : String(3)           @title : 'UOM코드';
        material_reqm_quantity      : Decimal             @title : '자재소요수량';
        material_reqm_diff_quantity : Decimal             @title : '자재소요차이수량';
        buyer_empno                 : String(30)          @title : '구매담당자사번';
        supplier_code               : String(10)          @title : '공급업체코드';
        change_info_code            : String(30)          @title : '변겅정보코드';
        direct_register_flag        : Boolean             @title : '직접등록여부';
        mapping_id                  : Integer             @title : '매핑ID';
}

extend Tc_Mcst_Project_Part_List with util.Managed;
