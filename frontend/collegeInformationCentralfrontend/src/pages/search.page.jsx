import { useParams } from "react-router-dom";
import InPageNavigation from "../components/InPageNavigationComponent";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post-component";
import AnimationWrapper from "../common/pageanimation";
import NoDataComponent from "../components/No-Data-component";
import NoDataMessage from "../components/No-Data-component";
import LoadMoreDataBtn from "../components/load-more.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import UserCard from "../components/usercard.component";
const SearchPage = () => {
    let { query } = useParams();

    let [blogs, setBlog] = useState(null)
    let [users, setUsers] = useState(null)
    const searchBlogs = ({ page = 1, create_new_arr = false }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { query, page })
            .then(async ({ data }) => {

                let formetedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page: page,
                    countRoute: "/search-blogs-count",
                    data_to_send: { query },
                    create_new_arr

                })

                setBlog(formetedData)

            })
            .catch(err => {
                console.log(err)
            })
    }

    const fetchUsers = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query })
            .then(async ({ data: { users } }) => {
                setUsers(users)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const resetState = () => {
        setBlog(null)
        setUsers(null)
    }
    useEffect(() => {
        resetState()
        searchBlogs({ page: 1, create_new_arr: true })
        fetchUsers()
    }, [query])

    const UserCardWrapper = () => {
        if (users == null) return <Loader />
        else {
            if (users.length) {
                return users.map((user, i) => {
                    return <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                        <UserCard user={user} />
                    </AnimationWrapper>
                })
            }
            else {
                return <NoDataMessage message="No Users Found" />
            }
        }
    }

    return (
        <section className="h-cover flex justify-center gap-10">
            <div className="w-full">
                <InPageNavigation
                    routes={[`Search Results from "${query}"`, "Accounts Matched"]}
                    defaultHidden={["Accounts Matched"]}>
                    <>

                        {
                            blogs == null ? <Loader />
                                :
                                blogs.results.length ?
                                    blogs.results.map((blog, i) => {
                                        return <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}><BlogPostCard content={blog} author={blog.author.personal_info} /></AnimationWrapper>
                                    })
                                    : <NoDataComponent message="No Blogs Found" />
                        }

                        <LoadMoreDataBtn state={blogs} fetchDataFun={searchBlogs} />

                    </>
                    <UserCardWrapper />
                </InPageNavigation>


            </div>

            <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">
                <h1 className="font-medium text-xl mb-8">User related to search <i className="fi fi-rr-user
                 mt-1"></i></h1>

                <UserCardWrapper />
            </div>
        </section>
    );
}

export default SearchPage;