import React from "react";
import { regComma } from "@/utils/reg";
import { transDayFunction } from "@/utils/dayTrans";

interface Props {
    tempList: RepositoryInterface[];
}

const TemplateListView = ({ tempList }: Props) => {
    return (
        <>
            {tempList?.length !== 0 ? (
                <ul className="card_list">
                    {tempList?.map((value: RepositoryInterface, index: number) => {
                        return (
                            <li className="card_item cur_pointer" key={index}>
                                <div className="item_hd">
                                    {value?.repo_type_nm != null ? <div className="info_type">{value?.repo_type_nm}</div> : <div></div>}
                                    <div className="info_favor">
                                        <i className={`icon star ${value.star_yn == "Y" && `chk`}`}></i>
                                        <span className="count">{value.star_cnt?.toString().replace(regComma, ",")}</span>
                                    </div>
                                </div>
                                <div className="item_bd">
                                    <div className="info_subject">
                                        <div className="subject_line">
                                            <i className="icon public"></i>
                                            <span className="tit">{value?.ws_name}</span>
                                        </div>
                                        <div className="subject_line">
                                            <span className="slash">/</span>
                                            <span className="sub_tit">{value?.repo_name}</span>
                                            {value?.version != null ? <span className="version">v.{value?.version}</span> : null}
                                        </div>
                                    </div>
                                    <div className="info_desc">
                                        <span className="txt_line">
                                            <p className="txt">{value?.description} </p>
                                        </span>
                                        {/*<span className="more_box">... <a href="#none"*/}
                                        {/*                                  className="txt_more">more</a></span>*/}
                                    </div>
                                    <div className="info_kwd">
                                        <ul className="kwd_list">
                                            {value?.keyword_arr?.split(",").map((values: string, index: number) => {
                                                return (
                                                    <li key={`${values}${index}`} className="kwd_item">
                                                        <span className="kwd_name">{values}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                        <div className="info_update">
                                            <span>{value?.repo_updated_dt != null ? transDayFunction(value?.repo_updated_dt) : value?.repo_updated_dt}</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}{" "}
                </ul>
            ) : (
                <ul className="card_list no_list">
                    <li className="card_item cur_default">
                        <div className="no_msg">No Data</div>
                    </li>
                </ul>
            )}
        </>
    );
};

export default TemplateListView;
