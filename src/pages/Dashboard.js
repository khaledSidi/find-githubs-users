import React from "react";
import { Followers, Info, Repos, User, Search, Navbar } from "../components";
import spinnervlll from "../images/preloader.gif";
import { GithubContext, useGlobalContext } from "../context/context";
const Dashboard = () => {
  const { loading } = useGlobalContext();

  // if (loading) {
  // return (
  //   <main>
  //     <Navbar></Navbar>
  //     <Search></Search>
  //     <img src={spinnervlll} className="loading-img" alt="spinnervlll" />
  //   </main>
  // );
  // }
  return (
    <main>
      <Navbar> </Navbar> <Search> </Search> <Info> </Info> <User> </User>{" "}
      <Repos> </Repos>
    </main>
  );
};

export default Dashboard;
