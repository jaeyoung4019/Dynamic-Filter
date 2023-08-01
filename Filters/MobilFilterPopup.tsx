import React, { useEffect, useRef } from "react";
interface Props {
    id: string;
    list: any[];
    onClickCheckBox: any;
    select: string;
}

const MobilFilterPopup = ({ id, list, onClickCheckBox, select }: Props) => {
    const contBoxRef = useRef<HTMLDivElement>(null);

    const dropBtnOnClick = (e: any) => {
        const contBox = contBoxRef.current;
        if (contBox != null) {
            const contBoxClassList = contBox.className.split(" ");
            const contBoxClose = "cont_box";
            const contBoxOpen = "cont_box open";
            if (contBoxClassList.includes("open")) {
                contBox.className = contBoxClose;
            } else {
                contBox.className = contBoxOpen;
            }
        }
        e.stopPropagation();
    };

    const hideMenu = () => {
        const contBox = contBoxRef.current;
        if (contBox != null) {
            const contBoxClose = "cont_box";
            contBox.className = contBoxClose;
        }
    };

    useEffect(() => {
        $(document).on("click", function (e) {
            if (!$(e.target).closest(`#${id}Inner`).length) {
                $(".cont_box").removeClass("open");
            }
        });
    }, []);

    return (
        <li className="menu_item">
            <div className="cont_tit" onClick={dropBtnOnClick}>
                <span className="tit">
                    Filters : <span className="tit_sta">{select === "" ? id : select}</span>
                </span>
                <i className="icon arrow arrow_d"></i>
            </div>
            <div className="cont_box" ref={contBoxRef}>
                <div className="box_inner" id={`${id}Inner`}>
                    <div className="box_close_btn" onClick={hideMenu}>
                        <i className="icon close"></i>
                    </div>
                    <div className="menu_tit">{id}</div>
                    <ul className="sub_menu_list filter_list">
                        {list?.map((value: OrgFilterInterface, idx: number) => {
                            return (
                                <li className="filter_item cus_inp_box chk_inp" key={idx}>
                                    <label htmlFor={`m_${id}_opt_${idx}`} className="label_box">
                                        {value?.name}
                                        <input
                                            type="checkbox"
                                            id={`m_${id}_opt_${idx}`}
                                            name="lnb_filters"
                                            value={value?.name}
                                            checked={value?.checked}
                                            onChange={onClickCheckBox}
                                        />
                                        <span className="inp_custom"></span>
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </li>
    );
};

export default MobilFilterPopup;
