namespace pg;

@cds.persistence.exists

entity MI_Max_Node_ID_View {
    key max_node_id : Integer @title : '최대노드ID';
}
