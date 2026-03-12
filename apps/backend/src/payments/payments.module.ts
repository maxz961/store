import { Module } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';


@Module({
  controllers: [PaymentsController],
  providers: [
    {
      provide: 'STRIPE',
      useFactory: () => new Stripe(process.env.STRIPE_SECRET_KEY!),
    },
    PaymentsService,
  ],
})
export class PaymentsModule {}
