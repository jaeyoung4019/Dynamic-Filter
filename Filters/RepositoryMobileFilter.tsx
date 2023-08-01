import React, { useEffect, useState } from "react";
import MobilFilterPopup from "@/Components/Views/Explore/common/Filters/MobilFilterPopup";

interface Props {
    apiFilter: ProductsFiltersInterface;
    handleSelectFilter: (type: string) => (value: string) => void;
    selectFilterKeyword: string;
    selectFilterWorkspace: string;
    selectFilterTemplates: string;
    id: string;
}

const RepositoryMobileFilter = ({ id, apiFilter, selectFilterKeyword, selectFilterWorkspace, selectFilterTemplates, handleSelectFilter }: Props) => {
    const [uiFilter, setUiFilter] = useState(apiFilter);
    // array 에 push 및 api 요청하는 String 으로 변환
    const transArrayToStringPush = (selectFilter: string, type: string, value: string) => {
        const list = selectFilter.split("|").filter(el => el != null && el !== "");
        if (!list.includes(value)) {
            const pushList = [...list];
            pushList.push(value);
            handleSelectFilter(type)(pushList.join("|").toString());
        }
    };
    // array 에 remove 및 api 요청하는 String 으로 변환
    const transArrayToStringDelete = (selectFilter: string, type: string, value: string) => {
        const list = selectFilter.split("|").filter(el => el != null && el !== "");
        if (list.includes(value)) {
            const pushList = [...list];
            const index = pushList.indexOf(value);
            pushList.splice(index, 1);
            handleSelectFilter(type)(pushList.join("|").toString());
        }
    };
    // CheckBox handler
    const onClickCheckBox = (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = e.target;
        if (checked) {
            if (type === "Keyword") {
                transArrayToStringPush(selectFilterKeyword, type, value);
            }
            if (type === "Workspace") {
                transArrayToStringPush(selectFilterWorkspace, type, value);
            }
            if (type === "Templates") {
                transArrayToStringPush(selectFilterTemplates, type, value);
            }
        } else if (!checked) {
            if (type === "Keyword") {
                transArrayToStringDelete(selectFilterKeyword, type, value);
            }
            if (type === "Workspace") {
                transArrayToStringDelete(selectFilterWorkspace, type, value);
            }
            if (type === "Templates") {
                transArrayToStringDelete(selectFilterTemplates, type, value);
            }
        }
    };

    useEffect(() => {
        $(document).on("click", function (e) {
            if (!$(e.target).closest(`#${id}Inner`).length) {
                $(".cont_box").removeClass("open");
            }
        });
    }, []);

    useEffect(() => {
        setUiFilter(() => {
            return {
                Workspace: apiFilter?.Workspace.map((value: any, idx: any) => {
                    const locationList = selectFilterWorkspace.split("|").filter(el => el != null && el !== "");
                    if (locationList?.includes(value.name)) {
                        return {
                            name: value.name,
                            checked: true
                        };
                    } else {
                        return value;
                    }
                }),
                Templates: apiFilter?.Templates.map((value: any, idx: any) => {
                    const linkList = selectFilterTemplates.split("|").filter(el => el != null && el !== "");
                    if (linkList?.includes(value.name)) {
                        return {
                            name: value.name,
                            checked: true
                        };
                    } else {
                        return value;
                    }
                }),
                Keyword: apiFilter?.Keyword.map((value: any, idx: any) => {
                    const linkList = selectFilterKeyword.split("|").filter(el => el != null && el !== "");
                    if (linkList?.includes(value.name)) {
                        return {
                            name: value.name,
                            checked: true
                        };
                    } else {
                        return value;
                    }
                })
            };
        });
    }, [apiFilter]);

    return (
        <aside id="flt_lnb_m">
            <h2 className="lnb_tit sound_only">Filters</h2>
            <MobilFilterPopup
                id={"Workspace"}
                list={uiFilter?.Workspace}
                onClickCheckBox={onClickCheckBox("Workspace")}
                select={selectFilterWorkspace}
            />
            <MobilFilterPopup id={"Keyword"} list={uiFilter?.Keyword} onClickCheckBox={onClickCheckBox("Keyword")} select={selectFilterKeyword} />
            <MobilFilterPopup
                id={"Templates"}
                list={uiFilter?.Templates}
                onClickCheckBox={onClickCheckBox("Templates")}
                select={selectFilterTemplates}
            />
        </aside>
    );
};

export default RepositoryMobileFilter;
