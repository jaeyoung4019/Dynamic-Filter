import React, { useCallback, useEffect, useState } from "react";
import ContentTop from "@/Components/Views/Explore/common/ContentTop";
import TopTopicContainer from "@/Components/Views/Explore/common/TopTopic/TopTopicContainer";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
import { Link } from "react-router-dom";
import { ApiConfig } from "@/libs/api/authApi/apiConfig";
import { queryKey } from "@/libs/Hooks/react-query/reactQueryUtils";
import useSelectQuery from "@/libs/Hooks/react-query/useSelectQuery";
import { apiRequest } from "@/libs/api/apiInstance";
import Loading from "@/Components/Ui/Loadable/Loading";
import SearchBarContainer from "@/Components/Views/Explore/common/SearchBar/SearchBarContainer";
import TemplateListContainer from "@/Components/Views/Explore/Templates/TemplateListContainer";
import useSearchForm from "@/libs/Hooks/useSearchForm";
import Pagination from "@/Components/Ui/Commons/Pagination/Pagination";
import useWindowDimensions from "@/libs/Hooks/useWindowDimensions";
import { regComma } from "@/utils/reg";
import ExploreSort from "@/Components/Ui/Commons/SelectBox/ExploreSort";
import RepositoryPCFilter from "@/Components/Views/Explore/common/Filters/RepositoryPCFilter";
import RepositoryMobileFilter from "@/Components/Views/Explore/common/Filters/RepositoryMobileFilter";

const ExploreTemplates = () => {
    const { isLogin }: UserInterface = useAppSelector((state: RootState) => state.userSlice);
    const keywordInitVariable = {
        keyword: ""
    };

    const defaultPageSize = 20;
    const [value, onChangeFunction, reset, debounce, enterKey] = useSearchForm(keywordInitVariable);
    const { width } = useWindowDimensions();
    const pageInitVariable = {
        page: 1,
        pageSize: defaultPageSize
    };
    const [page, setPage] = useState(pageInitVariable);

    const handleMoreButton = useCallback(() => {
        setPage((preValue: any) => {
            return {
                ...preValue,
                pageSize: preValue.pageSize + defaultPageSize
            };
        });
    }, [page]);

    const [sort, setSort] = useState<organizationMemberListSortType>("");

    const handleSort = useCallback(
        (value: organizationMemberListSortType) => {
            setSort(() => value);
        },
        [sort]
    );

    //Filter 함수 구간
    const initApiFilter: ProductsFiltersInterface = {
        Keyword: [],
        Workspace: [],
        Templates: []
    };

    const [apiFilter, setApiFilter] = useState<ProductsFiltersInterface>(initApiFilter); // api 에서 내려준 값
    const [selectFilterKeyword, setSelectFitlerKeyword] = useState<string>("");
    const [selectFilterWorkspace, setSelectFilterWorkspace] = useState<string>("");
    const [selectFilterTemplates, setSelectFilterTemplates] = useState<string>("");

    const handleSelectFilter = (type: string) => (value: string) => {
        switch (type) {
            case "Workspace": {
                setSelectFilterWorkspace(() => value);
                break;
            }
            case "Keyword": {
                setSelectFitlerKeyword(() => value);
                break;
            }
            case "Templates": {
                setSelectFilterTemplates(() => value);
                break;
            }
            default: {
                break;
            }
        }
    };

    // api Request
    const listConfig = new ApiConfig.Builder()
        .setUrl("/pub/explore/templates")
        .setParam({
            keyword: value.keyword,
            page: page.page,
            pageSize: page.pageSize,
            fl_keywords: selectFilterKeyword === "" ? null : selectFilterKeyword,
            fl_works: selectFilterWorkspace === "" ? null : selectFilterWorkspace,
            fl_repos: selectFilterTemplates === "" ? null : selectFilterTemplates,
            sort: sort
        })
        .build();
    const query_key = queryKey("select_key_explore_templates_list").addKey(
        page,
        value,
        sort,
        selectFilterKeyword,
        selectFilterWorkspace,
        selectFilterTemplates
    );
    const templateListQuery = useSelectQuery(query_key, () => apiRequest.aas.get(listConfig));
    const userInfoApi = new ApiConfig.Builder().setUrl("/prv/user/setting/profile").build();
    const user_query_key = queryKey("user_profile_select_key_explore_templates").defaultKey;
    const userInfoQuery = useSelectQuery(user_query_key, () => apiRequest.iam.get(userInfoApi), isLogin);

    // topic Select
    const handleSelectTopic = useCallback((value: string) => {
        onChangeFunction("keyword")(value);
    }, []);

    const handlePage = useCallback(
        (type: string) => (value: number) => {
            setPage(data => {
                return {
                    ...data,
                    [type]: value
                };
            });
        },
        [page]
    );

    const propsSetterFunction = (array: ProductsFilterInterface[], type: string) => {
        const defaultLocationList = array?.map((value: { name: string }, idx: number) => {
            return {
                name: value.name,
                checked: false
            };
        });
        setApiFilter((pre: ProductsFiltersInterface) => {
            return {
                ...pre,
                [type]: defaultLocationList
            };
        });
    };

    // mobile or Pc Paging State Change
    useEffect(() => {
        if (width < 1154 || width > 1156) {
            setPage(() => {
                return {
                    page: 1,
                    pageSize: defaultPageSize
                };
            });
        }
    }, [width]);

    useEffect(() => {
        if (templateListQuery.status === "success") {
            const KeywordArray = templateListQuery?.data?.flKeywords;
            const RepositoryArray = templateListQuery?.data?.flRepos;
            const WorkspaceArray = templateListQuery?.data?.flWorks;

            if (KeywordArray !== undefined) {
                propsSetterFunction(KeywordArray, "Keyword");
            }
            if (RepositoryArray !== undefined) {
                propsSetterFunction(RepositoryArray, "Templates");
            }
            if (WorkspaceArray !== undefined) {
                propsSetterFunction(WorkspaceArray, "Workspace");
            }
        }
    }, [templateListQuery.isFetching, templateListQuery.status]);

    if (userInfoQuery.isLoading || templateListQuery.isLoading) {
        return <Loading />;
    }

    return (
        <div className="explore_wrap">
            <ContentTop tabState={"Templates"} />
            <SearchBarContainer value={value} debounce={debounce} />
            <TopTopicContainer topicList={templateListQuery?.data?.topTopic} handleSelectTopic={handleSelectTopic} />
            <section id="contents">
                <div className="inner flex_wrap">
                    <RepositoryPCFilter
                        apiFilter={apiFilter}
                        handleSelectFilter={handleSelectFilter}
                        selectFilterKeyword={selectFilterKeyword}
                        selectFilterWorkspace={selectFilterWorkspace}
                        selectFilterTemplates={selectFilterTemplates}
                        id={"explore_templates_filter_pc"}
                    />
                    <RepositoryMobileFilter
                        apiFilter={apiFilter}
                        handleSelectFilter={handleSelectFilter}
                        selectFilterKeyword={selectFilterKeyword}
                        selectFilterWorkspace={selectFilterWorkspace}
                        selectFilterTemplates={selectFilterTemplates}
                        id={"explore_templates_filter_mobile"}
                    />
                    <div id="main">
                        <div className="sort_box">
                            <div className="sort_result_txt">
                                <span className="result_count">{templateListQuery?.data?.total?.toString().replace(regComma, ",")}</span> available
                                results.
                            </div>
                            <div className="filter_info">
                                <ExploreSort sort={sort} handleSort={handleSort} id={"explore_sort_box_Templates"} />
                            </div>
                        </div>
                        <TemplateListContainer tempList={templateListQuery?.data?.tempList} />
                        <div className="list_more" style={page.pageSize >= templateListQuery?.data?.total ? { display: "none" } : {}}>
                            <Link to="#" onClick={handleMoreButton} className="btn basic2">
                                more
                            </Link>
                        </div>
                        <Pagination
                            handlePage={handlePage}
                            page={page}
                            pageInfo={{
                                total: templateListQuery?.data?.total
                            }}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ExploreTemplates;
