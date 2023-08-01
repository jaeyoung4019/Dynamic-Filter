import React from "react";
import TemplateListView from "@/Components/Views/Explore/Templates/TemplateListView";

interface Props {
    tempList: RepositoryInterface[],
}

const TemplateListContainer = ({ tempList } : Props) => {
    return <TemplateListView tempList={tempList} />
}

export default TemplateListContainer;