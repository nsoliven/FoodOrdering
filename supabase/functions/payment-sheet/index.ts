import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { stripe } from "../utils/stripe.ts"
import { createOrRetrieveProfile } from "../utils/supabase.ts"

console.log("Hello from Functions!")

Deno.serve(async (req: Request) => {
  try {
    const { amount } = await req.json()

    const customer = await createOrRetrieveProfile(req);

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer },
      { apiVersion: '2020-08-27' }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: customer,
      payment_method_types: ['card'],
      // ephemeralKey: ephemeralKey.secret,
    })


    const res = {
      paymentIntent: paymentIntent.client_secret,
      publishableKey: Deno.env.get('EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
      customer: customer,
      ephemeralKey: ephemeralKey.secret,
    }

    return new Response(
      JSON.stringify(res), 
      { headers: { "Content-Type": "application/json" }, status: 200 } // OK
    )

  } catch (error) {
    console.error("Error creating payment intent:", error)
    return new Response(
      JSON.stringify({ error: (error as any).message }), // Only send the error message
      { headers: { "Content-Type": "application/json" }, status: 400 } // Internal Server Error
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/payment-sheet' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"amount": 1150}'

*/
