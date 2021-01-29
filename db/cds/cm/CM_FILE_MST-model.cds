namespace cm;

using util from './util/util-model';
using from './CM_FILE_DTL-model';

entity File_Mst {
    key tenant_id           : String(5) not null    @title: '테넌트ID';
    key file_group_id       : UUID not null         @title: '파일그룹ID';
    
        children            : Composition of many cm.File_Dtl
                                 on  children.tenant_id = tenant_id
                                 and children.file_group_id = file_group_id;
                                 
}

extend File_Mst with util.Managed;
