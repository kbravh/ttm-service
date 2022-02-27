import { createLogger } from '@logdna/logger';
import { NextApiHandler } from 'next';
import Stripe from 'stripe';
import { withSentry, captureException, addBreadcrumb, Severity } from '@sentry/nextjs';
import { createClient } from '@supabase/supabase-js';
import { UserProfile } from '../../types/database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2020-08-27',
});

const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.PRIVATE_SUPABASE_KEY ?? '');

const handler: NextApiHandler = async (req, res) => {
  const logger = createLogger(process.env.LOGDNA_INGESTION_KEY ?? '', {
    tags: ['create-stripe-customer'],
    app: 'ttm-service',
    env: process.env.NODE_ENV,
    meta: {
      request: {
        body: req.body,
        headers: req.rawHeaders,
        url: req.url,
      },
    },
  });

  if (req.query.SECRET !== process.env.API_SECRET_KEY) {
    return res.status(401).send('You are not authorized to use this API');
  }

  if (!req.body?.record?.id) {
    return res.status(400).send('This resource must be triggered with a user record');
  }

  logger.info?.('Creating stripe customer');
  const customer: Stripe.Customer = await stripe.customers.create({
    email: req.body.record.email,
  });
  logger.info?.(`Stripe customer created: ${customer.id}. Logging to database.`);

  const {data, error} = await adminSupabase
    .from<UserProfile>('users')
    .update({
      stripe_customer_id: customer.id,
    })
    .eq('id', req.body.record.id);

  if (error) {
    logger.error?.(`There was an error updating the user\'s Stripe id: ${error.message}`);
    captureException(error);
  }
  if (data) {
    logger.info?.('Stripe id saved to user.')
  }

  res.send(`Stripe customer created: ${customer.id}`);
};

export default withSentry(handler);
