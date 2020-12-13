namespace pg;

@cds.persistence.exists

entity MI_Cateogry_Hichy_Stru_View {
    key tenant_id            : String(40) @title : '회사코드';
    key company_code         : String(240)@title : '법인코드';
    key org_type_code        : String(40) @title : '조직유형코드';
    key org_code             : String(240)@title : '조직코드';
        node_id              : Integer    @title : '노드ID';
        hierarchy_level      : Integer    @title : '계층레벨';
    key category_code        : String(40) @title : '카테고리코드';
        category_name        : String(240)@title : '카테고리명';
        parent_node_id       : Integer    @title : '상위노드ID';
        parent_category_code : String(40) @title : '상위카테고리코드';
        sort_sequence        : String     @title : '정렬순서';
        drillstate           : String(10) @title : '노드상태';
        use_flag             : Boolean    @title : '사용여부';
        local_create_dtm     : DateTime   @title : '로컬등록시간';
        local_update_dtm     : DateTime   @title : '로컬수정시간';
        create_user_id       : String(255)@title : '등록사용자ID';
        update_user_id       : String(255)@title : '변경사용자ID';
        system_create_dtm    : DateTime   @title : '시스템등록시간';
        system_update_dtm    : DateTime   @title : '시스템수정시간';
        start_rank           : Integer    @title : '시작노드ID';
        path_code            : String     @title : '코드검색조건';
        path_text            : String     @title : '텍스트검색조건';

}
