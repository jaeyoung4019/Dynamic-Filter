import React, {useEffect, useState} from "react";
import MobilFilterPopup from "@/Components/Views/Explore/common/Filters/MobilFilterPopup";

interface Props {
    apiFilter: OrgApiFilterInterface
    handleSelectFilter: (type: string) => (value: string) => void;
    selectFilterLink: string,
    selectFilterLocation: string
    id: string
}

const UserAndOrgMobileFilter = ({id , apiFilter , selectFilterLink , selectFilterLocation  ,handleSelectFilter}: Props) => {

    const [uiFilter , setUiFilter] = useState(apiFilter);
    // array 에 push 및 api 요청하는 String 으로 변환
    const transArrayToStringPush = (selectFilter: string , type: string , value: string) => {
        const list = selectFilter.split("|").filter(el => el != null && el !== "");
        if (!list.includes(value)) {
            const pushList = [...list];
            pushList.push(value)
            handleSelectFilter(type)(pushList.join('|').toString())
        }
    }
    // array 에 remove 및 api 요청하는 String 으로 변환
    const transArrayToStringDelete = (selectFilter: string , type: string , value: string) => {
        const list = selectFilter.split("|").filter(el => el != null && el !== "");
        if (list.includes(value)) {
            const pushList = [...list];
            const index = pushList.indexOf(value);
            pushList.splice(index , 1)
            handleSelectFilter(type)(pushList.join('|').toString())
        }
    }
    // CheckBox handler
    const onClickCheckBox = (type: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const {checked , value} = e.target;
        if (checked) {
            if (type === "location") {
                transArrayToStringPush(selectFilterLocation , type , value)
            }
            if (type === "link") {
                transArrayToStringPush(selectFilterLink , type , value)
            }
        } else if (!checked) {
            if (type === "location") {
                transArrayToStringDelete(selectFilterLocation , type , value)
            }
            if (type === "link") {
                transArrayToStringDelete(selectFilterLink , type , value)
            }
        }
    }

    useEffect(() => {
        $(document).on("click" ,function(e) {
            if(!$(e.target).closest(`#${id}Inner`).length){
                $('.cont_box').removeClass('open');
            }
        });
    } , [])

    useEffect(() => {
        setUiFilter( () => {
            return {
                location : apiFilter?.location.map( (value: any , idx: any) => {
                    const locationList = selectFilterLocation.split("|").filter(el => el != null && el !== "");
                    if (locationList?.includes(value.name)){
                        return {
                            name: value.name,
                            checked: true
                        }
                    } else {
                        return value
                    }
                }),
                link : apiFilter?.link.map( (value: any , idx: any) => {
                    const linkList = selectFilterLink.split("|").filter(el => el != null && el !== "");
                    if (linkList?.includes(value.name)){
                        return {
                            name: value.name,
                            checked: true
                        }
                    } else {
                        return value
                    }
                })
            }
        })
    } , [apiFilter])

    return (
        <aside id="flt_lnb_m">
            <h2 className="lnb_tit sound_only">Filters</h2>
            <MobilFilterPopup id={"Location"} list={uiFilter?.location} onClickCheckBox={onClickCheckBox("location")} select={selectFilterLocation}/>
            <MobilFilterPopup id={"Link"} list={uiFilter?.link} onClickCheckBox={onClickCheckBox("link")} select={selectFilterLink}/>
        </aside>
    )
}

export default UserAndOrgMobileFilter;