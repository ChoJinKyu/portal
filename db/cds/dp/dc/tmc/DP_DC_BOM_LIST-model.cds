/************************************************
  1. namespace
  - 모듈코드 소문자로 작성
  - 소모듈 존재시 대모듈.소모듈 로 작성
  2. entity
  - 대문자로 작성
  - 테이블명 생성을 고려하여 '_' 추가
  3. 컬럼(속성)
  - 소문자로 작성
  4. .hdbview, .hdbfunction 등으로 이미 생성된 DB Object 사용시
  entity 위에 @cds.persistence.exists 명시
*************************************************/
namespace dp;
using { User } from '@sap/cds/common';
using util from '../../../util/util-model';

entity Dc_Bom_List {
    key tenant_id: String(5) not null @title: '테넌트ID';
    key group_id: Integer not null @title: 'GROUP ID';
    key bom_type: String(10) not null @title: 'BOM TYPE';
    key node_id: Integer not null @title: 'NODE ID';
    parent_node_id: Integer @title: 'PARENT NODE ID';
    operation_type: String(200) @title: '구매운영조직유형';
    operation_code: String(200) @title: '구매운영조직코드';
    sort_order: Integer @title: 'SORT ORDER';
    ogranization_id: Integer @title: 'ORGANIZATION ID';
    item_number: String(50) @title: '품목번호';
    item_id: Integer(20) @title: '품목ID';
    quantity: Integer @title: '소요량';
    start_date: Date @title: '적용시작일';
    end_date: Date @title: '적용종료일';
    effective_date: Date @title: '유효일';
}

  extend Dc_Bom_List with util.Managed;