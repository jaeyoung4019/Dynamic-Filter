import React, { useEffect, useState } from "react";
import { accordion } from "@/utils/common";

interface Props {
    apiFilter: ProductsFiltersInterface;
    handleSelectFilter: (type: string) => (value: string) => void;
    selectFilterKeyword: string;
    selectFilterWorkspace: string;
    selectFilterTemplates: string;
    id: string;
}

const RepositoryPCFilter = ({ id, apiFilter, selectFilterKeyword, selectFilterWorkspace, selectFilterTemplates, handleSelectFilter }: Props) => {
    useEffect(() => {
        accordion(`#${id}`);
    }, []);

    const [uiFilter, setUiFilter] = useState(apiFilter);
    const initKeywordListLength = 5;
    const [keywordLength, setKeywordLength] = useState<number>(initKeywordListLength);

    const handleKeywordLength = () => {
        setKeywordLength((pre: number) => uiFilter?.Keyword?.length);
    };
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
        <aside id="flt_lnb">
            <h2 className="lnb_tit">Filters</h2>
            <ul className="menu_list acc_wrap" id={id}>
                <li className="acc_box open">
                    <div className="acc_tit">
                        <span className="tit">Workspaces</span>
                        <i className="icon arrow arrow_d"></i>
                    </div>
                    <div className="acc_cont">
                        <ul className="sub_menu_list filter_list">
                            {uiFilter?.Workspace?.map((value: ProductsFilterInterface, idx: number) => {
                                return (
                                    <li className="filter_item cus_inp_box chk_inp" key={idx}>
                                        <label htmlFor={`lnb_flt_${idx}`} className="label_box">
                                            {value?.name}
                                            <input
                                                type="checkbox"
                                                id={`lnb_flt_${idx}`}
                                                name="lnb_filters"
                                                value={value?.name}
                                                checked={value?.checked}
                                                onChange={onClickCheckBox("Workspace")}
                                            />
                                            <span className="inp_custom"></span>
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </li>
                <li className="acc_box open">
                    <div className="acc_tit">
                        <span className="tit">Templates</span>
                        <i className="icon arrow arrow_d"></i>
                    </div>
                    <div className="acc_cont">
                        <ul className="sub_menu_list filter_list">
                            {uiFilter?.Templates?.map((value: ProductsFilterInterface, idx: number) => {
                                return (
                                    <li className="filter_item cus_inp_box chk_inp" key={idx}>
                                        <label htmlFor={`lnb_flt_2_${idx}`} className="label_box">
                                            {value?.name}
                                            <input
                                                type="checkbox"
                                                id={`lnb_flt_2_${idx}`}
                                                name="lnb_filters"
                                                value={value?.name}
                                                checked={value?.checked}
                                                onChange={onClickCheckBox("Templates")}
                                            />
                                            <span className="inp_custom"></span>
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </li>
                <li className="acc_box open">
                    <div className="acc_tit">
                        <span className="tit">Keyword</span>
                        <i className="icon arrow arrow_d"></i>
                    </div>
                    <div className="acc_cont">
                        <ul className="sub_menu_list filter_list">
                            {uiFilter?.Keyword?.slice(0, keywordLength).map((value: ProductsFilterInterface, idx: number) => {
                                return (
                                    <li className="filter_item cus_inp_box chk_inp" key={idx}>
                                        <label htmlFor={`lnb_flt_3_${idx}`} className="label_box">
                                            {value?.name}
                                            <input
                                                type="checkbox"
                                                id={`lnb_flt_3_${idx}`}
                                                name="lnb_filters"
                                                value={value?.name}
                                                checked={value?.checked}
                                                onChange={onClickCheckBox("Keyword")}
                                            />
                                            <span className="inp_custom"></span>
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                        <div
                            style={keywordLength === uiFilter?.Keyword?.length || uiFilter?.Keyword?.length < 5 ? { display: "none" } : {}}
                            className="more_kwd_btn"
                            onClick={() => {
                                handleKeywordLength();
                            }}
                        >
                            Show 5 more
                        </div>
                    </div>
                </li>
            </ul>
        </aside>
    );
};

export default RepositoryPCFilter;
