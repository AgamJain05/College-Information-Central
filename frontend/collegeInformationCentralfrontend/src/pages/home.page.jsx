import { useEffect, useState } from "react"
import AnimationWrapper from "../common/pageanimation"
import InPageNavigation from "../components/InPageNavigationComponent"
import Loader from "../components/loader.component"
import axios from "axios"
import BlogPostCard from "../components/blog-post-component"
import MinimalBlogPost from "../components/no-banner-blogPost-component"
import { activeTabRef } from "../components/InPageNavigationComponent"
import NoDataComponent from "../components/No-Data-component"
import { filterPaginationData } from "../common/filter-pagination-data"
import LoadMoreDataBtn from "../components/load-more.component"

const HomePage = () => {

  const [blogs, setBlog] = useState(null)

// Pagination of blogs

  // blogs = [{} , {} , {}]

  // let blogs = {
  //   results: [{} , {} , {}],
  //   page: 2,
  //   totalDocs:10,
  // }




  const [trendingBlogs, setTrendingBlog] = useState(null)
  const [pageState, setPageState] = useState("home")

  let categories = ["tech", "finance", "hollywood", "cooking", "travel", "social media", "film making", "programming"]
  const fetchLatestBlogs = ({page = 1}) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs" , {page})
      .then( async({ data }) => {

          let formetedData = await filterPaginationData({
            state: blogs,
            data: data.blogs,
            page: page,
            countRoute: "/all-latest-blogs-count"
          
          })

          console.log(formetedData)

        setBlog(formetedData)
        
      })
      .catch(err => {
        console.log(err)
      })
  }
  const fetchTrendingBlogs = () => {
    axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
      .then(({ data }) => {
        setTrendingBlog(data.blogs)
      })
      .catch(err => {
        console.log(err)
      })
  }
  const fetchBlogsByCategory = ({page = 1}) => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs" ,{ tag: pageState , page} )
      .then( async({ data }) => {
        let formetedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page: page,
          countRoute: "/search-blogs-count",
          data_to_send: { tag: pageState }
        
        })
        setBlog(formetedData)

      })
      .catch(err => {
        console.log(err)
      })
  }
  useEffect(() => {

    activeTabRef.current.click()
    if(pageState == "home"){
      fetchLatestBlogs(1)
    }
    else{
      fetchBlogsByCategory(1)
    }
    if(!trendingBlogs){
      fetchTrendingBlogs()
    }
    
  },[pageState])

  const loadblogByCatagory = (e) => {
    let category = e.target.innerText.toLowerCase()
    setBlog(null)
    if(pageState == category){
      setPageState("home")
      return;
    }
    setPageState(category)
  }
  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* latest blogs */}
        <div className="w-full">

          <InPageNavigation routes={[pageState, "trending blogs"]} defaultHidden={["trending blogs"]}>

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
              <LoadMoreDataBtn state = {blogs} fetchDataFun= {(pageState == "home" ? fetchLatestBlogs : fetchBlogsByCategory)}/>
            </>

            {
              trendingBlogs == null ? <Loader />
                :
                trendingBlogs.length ?
                  trendingBlogs.map((blog, i) => {
                    return <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}><MinimalBlogPost blog={blog} index={i} /></AnimationWrapper>
                  })
                : <NoDataComponent message="No Trending Blogs" />  
            }

          </InPageNavigation>


        </div>
        {/* filters and trending blogs */}
        <div className="min-w-[40%] lg:min-w-[400] max-w-min border border-grey  pl-8 pt-3 max-md:hidden">

          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">Stories from all interests</h1>
              <div className="flex gap-3 flex-wrap">
                  {
                        categories.map((category, i) => {
                          return (
                            <button key={i} onClick={loadblogByCatagory} className={"tag " + (pageState == category ? "bg-black text-white " : " " ) }>
                              {category}
                            </button>
                        )      
                  })
                  } 
            </div>
            </div>


            <div>
              <h1 className="font-medium text-xl mb-8">Trending <i className="fi fi-rr-arrow-trend-up"> </i></h1>

              {
                
                trendingBlogs == null ? <Loader />
                  :
                  trendingBlogs.length ?
                    trendingBlogs.map((blog, i) => {
                      return <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}><MinimalBlogPost blog={blog} index={i} /></AnimationWrapper>
                    })
                  : <NoDataComponent message="No Trending Blogs"/> 
              }

            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  )
}

export default HomePage