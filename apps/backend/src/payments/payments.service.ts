import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import Stripe from 'stripe';


@Injectable()
export class PaymentsService {
  constructor(@Inject('STRIPE') private readonly stripe: Stripe) {}

  async createIntent(amount: number, currency = 'usd'): Promise<{ clientSecret: string }> {
    try {
      const intent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency,
        automatic_payment_methods: { enabled: true },
      });

      if (!intent.client_secret) {
        throw new InternalServerErrorException('Failed to create payment intent');
      }

      return { clientSecret: intent.client_secret };
    } catch (err) {
      if (err instanceof InternalServerErrorException) throw err;
      throw new InternalServerErrorException('Payment service unavailable');
    }
  }
}
