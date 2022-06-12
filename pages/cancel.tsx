import { NextPage } from "next";
import { Layout } from "../components/layout";
import { MainWrapper } from "../components/mainWrapper";

const Cancel: NextPage = () => {
  return (
    <Layout title="Signup Cancelled">
      <MainWrapper title="Signup Cancelled">
        Sign up cancelled. No subscription has been created.
      </MainWrapper>
    </Layout>
  )
}

export default Cancel
