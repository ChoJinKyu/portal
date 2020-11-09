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

namespace pg;

using { User } from '@sap/cds/common';

entity Md_Category_Item {
    key tenant_id                : String(4) not null;
    key company_code             : String(10) not null;
    key md_category_id           : String(4) not null;
    key md_category_item_code    : String(4) not null;
        md_category_item_name    : String(100) not null;
        md_category_item_desc    : String(500);
        md_category_item_type    : String(1) not null;
        md_category_itme_content : String(100);
        md_item_sort_seq         : Integer64 not null;
/*        local_create_date        : UTCDateTime not null;
        local_update_date        : UTCDateTime not null;
        create_user_id           : String(50) not null;
        update_user_id           : String(50) not null;
        system_create_date       : UTCDateTime not null;
        system_update_date       : UTCDateTime not null; */

    @Comment: '로컬등록시간'
    local_create_date: DateTime not null;
    @Comment: '로컬수정시간'
    local_update_date: DateTime not null;
    @Comment: '등록사용자ID'
    create_user_id: User not null @cds.on.insert: $user;
    @Comment: '변경사용자ID'
    update_user_id: User not null @cds.on.insert: $user @cds.on.update: $user;
    @Comment: '시스템등록시간'
    system_create_date: DateTime not null @cds.on.insert: $now;
    @Comment: '시스템수정시간'
    system_update_date: DateTime not null @cds.on.insert: $now  @cds.on.update: $now;


}
