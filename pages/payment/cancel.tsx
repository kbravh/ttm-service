import { NextPage } from 'next'
import { Layout } from '../../components/layout'
import { MainWrapper } from '../../components/mainWrapper'

interface Props {}

const Cancel: NextPage<Props> = () => {
  return (
    <Layout title="Subscription not created">
      <MainWrapper title="Subscription not created">
        Subscription not created.
      </MainWrapper>
    </Layout>
  )
}

export default Cancel
