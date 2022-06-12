import { NextPage } from 'next'
import { Layout } from '../../components/layout'
import { MainWrapper } from '../../components/mainWrapper'

interface Props {}

const Success: NextPage<Props> = () => {
  return (
    <Layout title="Subscription success">
      <MainWrapper title="Subscription success">
        Subscription created successfully!
      </MainWrapper>
    </Layout>
  )
}

export default Success
