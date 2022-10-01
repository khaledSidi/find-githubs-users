import React, { useState, useEffect, useContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
// import {} from "./";
import axios from "axios";

const rootUrl = "https://api.github.com";
const userUrl = "https://api.github.com/users";

// [Root Endpoint](https://api.github.com)
// - [Repos](https://api.github.com/users/john-smilga/repos?per_page=100)
// - [Followers](https://api.github.com/users/john-smilga/followers)
// - [Rate Limit](https://api.github.com/rate_limit)
// github token : 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

const AppContext = React.createContext();

const GithubProvider = ({ children }) => {
  // const []
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  const [githubUser, setGithubUser] = useState(mockUser);
  const [requestLimit, setRequestLimit] = useState(0);
  const [errorMsg, setErrorMsg] = useState({ show: false, msg: "" });
  const [loading, setLoading] = useState(false);

  const searchGithubUser = async (user) => {
    setLoading(true);
    setErrorMsgFun();
    const response = await axios(`${userUrl}/${user}`).catch((err) => {
      console.log(err);
    });

    if (response) {
      setLoading(false);
      setGithubUser(response.data);
      const { login, followers_url } = response.data;
      //repos
      // .then((response) => {
      //   setRepos(response.data);
      // });

      // //followers
      // .then((response) => {
      //   setFollowers(response.data);
      // });

      await Promise.allSettled([
        axios(`${userUrl}/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          const [repos, followers] = results;
          if (repos.status === "fulfilled") {
            setRepos(repos.value.data);
          }
          if (followers.status === "fulfilled") {
            setFollowers(followers.value.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setErrorMsgFun(true, "there is no user with that usename");
    }
    setLoading(false);
    checkRequest();
  };

  const checkRequest = () => {
    axios(`https://api.github.com/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;
        setRequestLimit(remaining);
        if (remaining === 0) {
          setErrorMsgFun(true, "Sorry you have exceded your request limit");
        }
      })
      .catch((err) => console.log(err));
  };

  const setErrorMsgFun = (show = false, msg = "") => {
    setErrorMsg({ show, msg });
  };

  return (
    <AppContext.Provider
      value={{
        loading,
        searchGithubUser,
        githubUser,
        setErrorMsgFun,
        errorMsg,
        requestLimit,
        repos,
        followers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { GithubProvider, AppContext };
