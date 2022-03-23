import { GetServerSideProps, NextPage } from "next";
import { Layout } from "../components/layout";
import { MainWrapper } from "../components/mainWrapper";

const Success: NextPage = () => {
  return (
    <Layout title="Success">
      <MainWrapper title="Success">
        Subscription created successfully!
      </MainWrapper>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async({req, query}) => {
  const sessionId = query.session_id;

  // is there anything we want to show the user about their confirmed session?
  // if not, we can just dump this part probably

  return {
    props: {}
  }
}

export default Success
